"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PuzzleManager } from "@/components/puzzle-manager"
import { PieceManager } from "@/components/piece-manager"
import { PuzzleSolver } from "@/components/puzzle-solver"
import type { Puzzle, PuzzlePiece } from "@/types/puzzle"

export default function PuzzleApp() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([])
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null)

  const addPuzzle = (puzzle: Puzzle) => {
    setPuzzles((prev) => [...prev, puzzle])
  }

  const addPiece = (puzzleId: string, piece: PuzzlePiece) => {
    setPuzzles((prev) =>
      prev.map((puzzle) => (puzzle.id === puzzleId ? { ...puzzle, pieces: [...puzzle.pieces, piece] } : puzzle)),
    )
  }

  const updatePiece = (puzzleId: string, pieceNumber: number, updatedPiece: PuzzlePiece) => {
    setPuzzles((prev) =>
      prev.map((puzzle) =>
        puzzle.id === puzzleId
          ? {
              ...puzzle,
              pieces: puzzle.pieces.map((piece) => (piece.number === pieceNumber ? updatedPiece : piece)),
            }
          : puzzle,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Puzzle Master</h1>
          <p className="text-lg text-gray-600">Register puzzles, manage pieces, and solve with AI guidance</p>
        </div>

        <Tabs defaultValue="puzzles" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="puzzles">Puzzle Management</TabsTrigger>
            <TabsTrigger value="pieces">Piece Management</TabsTrigger>
            <TabsTrigger value="solver">Puzzle Solver</TabsTrigger>
          </TabsList>

          <TabsContent value="puzzles" className="space-y-4">
            <PuzzleManager
              puzzles={puzzles}
              onAddPuzzle={addPuzzle}
              onSelectPuzzle={setSelectedPuzzle}
              selectedPuzzle={selectedPuzzle}
            />
          </TabsContent>

          <TabsContent value="pieces" className="space-y-4">
            <PieceManager selectedPuzzle={selectedPuzzle} onAddPiece={addPiece} onUpdatePiece={updatePiece} />
          </TabsContent>

          <TabsContent value="solver" className="space-y-4">
            <PuzzleSolver selectedPuzzle={selectedPuzzle} puzzles={puzzles} onSelectPuzzle={setSelectedPuzzle} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
