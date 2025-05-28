"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, PuzzleIcon } from "lucide-react"
import type { Puzzle } from "@/types/puzzle"

interface PuzzleManagerProps {
  puzzles: Puzzle[]
  onAddPuzzle: (puzzle: Puzzle) => void
  onSelectPuzzle: (puzzle: Puzzle) => void
  selectedPuzzle: Puzzle | null
}

export function PuzzleManager({ puzzles, onAddPuzzle, onSelectPuzzle, selectedPuzzle }: PuzzleManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    totalPieces: "",
    difficulty: "",
    theme: "",
    manufacturer: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.totalPieces || !formData.difficulty) return

    const newPuzzle: Puzzle = {
      id: Date.now().toString(),
      name: formData.name,
      totalPieces: Number.parseInt(formData.totalPieces),
      difficulty: formData.difficulty as any,
      theme: formData.theme,
      manufacturer: formData.manufacturer,
      pieces: [],
      createdAt: new Date(),
    }

    onAddPuzzle(newPuzzle)
    setFormData({ name: "", totalPieces: "", difficulty: "", theme: "", manufacturer: "" })
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PuzzleIcon className="h-5 w-5" />
            Puzzle Collection
          </CardTitle>
          <CardDescription>Manage your puzzle collection and register new puzzles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              {puzzles.length} puzzle{puzzles.length !== 1 ? "s" : ""} registered
            </p>
            <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Puzzle
            </Button>
          </div>

          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Register New Puzzle</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Puzzle Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter puzzle name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalPieces">Total Pieces</Label>
                      <Input
                        id="totalPieces"
                        type="number"
                        value={formData.totalPieces}
                        onChange={(e) => setFormData((prev) => ({ ...prev, totalPieces: e.target.value }))}
                        placeholder="e.g., 1000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, difficulty: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="manufacturer">Manufacturer</Label>
                      <Input
                        id="manufacturer"
                        value={formData.manufacturer}
                        onChange={(e) => setFormData((prev) => ({ ...prev, manufacturer: e.target.value }))}
                        placeholder="e.g., Ravensburger"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="theme">Theme/Description</Label>
                    <Textarea
                      id="theme"
                      value={formData.theme}
                      onChange={(e) => setFormData((prev) => ({ ...prev, theme: e.target.value }))}
                      placeholder="Describe the puzzle theme or image"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Add Puzzle</Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {puzzles.map((puzzle) => (
              <Card
                key={puzzle.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedPuzzle?.id === puzzle.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => onSelectPuzzle(puzzle)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{puzzle.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{puzzle.totalPieces} pieces</Badge>
                    <Badge
                      variant={
                        puzzle.difficulty === "easy"
                          ? "default"
                          : puzzle.difficulty === "medium"
                            ? "secondary"
                            : puzzle.difficulty === "hard"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {puzzle.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{puzzle.theme}</p>
                  <p className="text-xs text-gray-500">{puzzle.pieces.length} pieces registered</p>
                  {puzzle.manufacturer && <p className="text-xs text-gray-500">by {puzzle.manufacturer}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
