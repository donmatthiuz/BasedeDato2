"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Lightbulb, ArrowRight, MapPin } from "lucide-react"
import type { Puzzle, PuzzlePiece } from "@/types/puzzle"

interface PuzzleSolverProps {
  selectedPuzzle: Puzzle | null
  puzzles: Puzzle[]
  onSelectPuzzle: (puzzle: Puzzle) => void
}

interface SolvingStep {
  step: number
  description: string
  pieces: number[]
  reasoning: string
}

export function PuzzleSolver({ selectedPuzzle, puzzles, onSelectPuzzle }: PuzzleSolverProps) {
  const [searchPiece, setSearchPiece] = useState("")
  const [solvingSteps, setSolvingSteps] = useState<SolvingStep[]>([])
  const [currentPiece, setCurrentPiece] = useState<PuzzlePiece | null>(null)

  const generateSolvingSteps = (piece: PuzzlePiece): SolvingStep[] => {
    if (!selectedPuzzle) return []

    const steps: SolvingStep[] = []
    let stepNumber = 1

    // Step 1: Identify piece type and starting strategy
    if (piece.edgeType === "corner") {
      steps.push({
        step: stepNumber++,
        description: "Start with corner piece strategy",
        pieces: [piece.number],
        reasoning: `Piece #${piece.number} is a corner piece. Corner pieces are ideal starting points as they have two flat edges and limited connection possibilities.`,
      })
    } else if (piece.edgeType === "edge") {
      steps.push({
        step: stepNumber++,
        description: "Edge piece placement strategy",
        pieces: [piece.number],
        reasoning: `Piece #${piece.number} is an edge piece with one flat side. Look for the border first, then work inward.`,
      })
    } else {
      steps.push({
        step: stepNumber++,
        description: "Center piece - work from established areas",
        pieces: [piece.number],
        reasoning: `Piece #${piece.number} is a center piece. These are best placed after establishing the border and some internal structure.`,
      })
    }

    // Step 2: Find direct neighbors
    if (piece.connections.length > 0) {
      const neighborNumbers = piece.connections.map((conn) => conn.neighborNumber)
      const availableNeighbors = neighborNumbers.filter((num) => selectedPuzzle.pieces.some((p) => p.number === num))

      if (availableNeighbors.length > 0) {
        steps.push({
          step: stepNumber++,
          description: "Locate direct neighbor pieces",
          pieces: [piece.number, ...availableNeighbors],
          reasoning: `Find pieces ${availableNeighbors.join(", ")} which directly connect to piece #${piece.number}. Check the connection types and directions.`,
        })
      }
    }

    // Step 3: Color and pattern matching
    if (piece.color || piece.pattern) {
      const similarPieces = selectedPuzzle.pieces
        .filter(
          (p) =>
            p.number !== piece.number &&
            ((piece.color && p.color === piece.color) || (piece.pattern && p.pattern === piece.pattern)),
        )
        .map((p) => p.number)

      if (similarPieces.length > 0) {
        steps.push({
          step: stepNumber++,
          description: "Group by color and pattern",
          pieces: [piece.number, ...similarPieces.slice(0, 5)],
          reasoning: `Look for pieces with similar ${piece.color ? "color (" + piece.color + ")" : ""}${piece.color && piece.pattern ? " and " : ""}${piece.pattern ? "pattern (" + piece.pattern + ")" : ""} to build cohesive sections.`,
        })
      }
    }

    // Step 4: Connection analysis
    piece.connections.forEach((conn) => {
      const neighborPiece = selectedPuzzle.pieces.find((p) => p.number === conn.neighborNumber)
      if (neighborPiece) {
        steps.push({
          step: stepNumber++,
          description: `Connect to piece #${conn.neighborNumber} on ${conn.direction} side`,
          pieces: [piece.number, conn.neighborNumber],
          reasoning: `Piece #${piece.number} has a ${conn.connectionType} connection on the ${conn.direction} side that matches with piece #${conn.neighborNumber}. Verify the fit by checking the complementary connection type.`,
        })
      }
    })

    // Step 5: Advanced strategy based on piece characteristics
    if (piece.dents.length > 0 || piece.holes.length > 0) {
      steps.push({
        step: stepNumber++,
        description: "Use unique features for identification",
        pieces: [piece.number],
        reasoning: `This piece has distinctive features: ${piece.dents.length > 0 ? "dents at " + piece.dents.join(", ") : ""}${piece.dents.length > 0 && piece.holes.length > 0 ? " and " : ""}${piece.holes.length > 0 ? "holes at " + piece.holes.join(", ") : ""}. Use these as landmarks for placement.`,
      })
    }

    return steps
  }

  const handleSearch = () => {
    if (!selectedPuzzle || !searchPiece) return

    const pieceNumber = Number.parseInt(searchPiece)
    const piece = selectedPuzzle.pieces.find((p) => p.number === pieceNumber)

    if (piece) {
      setCurrentPiece(piece)
      setSolvingSteps(generateSolvingSteps(piece))
    } else {
      setCurrentPiece(null)
      setSolvingSteps([])
    }
  }

  const getConnectionDirection = (direction: string) => {
    const directions = {
      top: "↑",
      right: "→",
      bottom: "↓",
      left: "←",
    }
    return directions[direction as keyof typeof directions] || direction
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Puzzle Solver
          </CardTitle>
          <CardDescription>Enter a piece number to get step-by-step solving guidance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {puzzles.length > 0 && (
              <div>
                <Label htmlFor="puzzle-select">Select Puzzle</Label>
                <Select
                  value={selectedPuzzle?.id || ""}
                  onValueChange={(value) => {
                    const puzzle = puzzles.find((p) => p.id === value)
                    if (puzzle) onSelectPuzzle(puzzle)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a puzzle to solve" />
                  </SelectTrigger>
                  <SelectContent>
                    {puzzles.map((puzzle) => (
                      <SelectItem key={puzzle.id} value={puzzle.id}>
                        {puzzle.name} ({puzzle.pieces.length} pieces registered)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedPuzzle && (
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="piece-search">Piece Number</Label>
                  <Input
                    id="piece-search"
                    type="number"
                    value={searchPiece}
                    onChange={(e) => setSearchPiece(e.target.value)}
                    placeholder="Enter piece number to solve"
                    min="1"
                    max={selectedPuzzle.totalPieces}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Get Solving Steps
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!selectedPuzzle && (
        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription>Please select a puzzle first to start solving.</AlertDescription>
        </Alert>
      )}

      {selectedPuzzle && searchPiece && !currentPiece && (
        <Alert>
          <AlertDescription>
            Piece #{searchPiece} not found in {selectedPuzzle.name}. Make sure the piece is registered first.
          </AlertDescription>
        </Alert>
      )}

      {currentPiece && (
        <Card>
          <CardHeader>
            <CardTitle>Piece #{currentPiece.number} Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge variant="secondary">{currentPiece.edgeType}</Badge>
                    {currentPiece.color && <Badge variant="outline">{currentPiece.color}</Badge>}
                  </div>
                  {currentPiece.pattern && (
                    <p>
                      <strong>Pattern:</strong> {currentPiece.pattern}
                    </p>
                  )}
                  {currentPiece.material && (
                    <p>
                      <strong>Material:</strong> {currentPiece.material}
                    </p>
                  )}
                  {currentPiece.dents.length > 0 && (
                    <p>
                      <strong>Dents:</strong> {currentPiece.dents.join(", ")}
                    </p>
                  )}
                  {currentPiece.holes.length > 0 && (
                    <p>
                      <strong>Holes:</strong> {currentPiece.holes.join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Connections:</h4>
                {currentPiece.connections.length > 0 ? (
                  <div className="space-y-1">
                    {currentPiece.connections.map((conn, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span>{getConnectionDirection(conn.direction)}</span>
                        <span>Piece #{conn.neighborNumber}</span>
                        <Badge variant="outline" className="text-xs">
                          {conn.connectionType}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No connections registered</p>
                )}
              </div>
            </div>
            {currentPiece.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p className="text-sm">
                  <strong>Notes:</strong> {currentPiece.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {solvingSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Solving Steps for Piece #{currentPiece?.number}
            </CardTitle>
            <CardDescription>Follow these steps to efficiently place this piece in your puzzle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {solvingSteps.map((step) => (
                <Card key={step.step} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                        {step.step}
                      </span>
                      {step.description}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <strong>Pieces involved:</strong>
                        {step.pieces.map((pieceNum) => (
                          <Badge key={pieceNum} variant="secondary">
                            #{pieceNum}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-gray-700">{step.reasoning}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
