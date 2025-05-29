"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Save, X } from "lucide-react"
import type { Puzzle, PuzzlePiece, PuzzleConnection } from "@/types/puzzle"
import useApi from "@/hooks/useApi"
import source_link from "@/repositori/source_repo"

interface PieceManagerProps {
  selectedPuzzle: Puzzle | null
  onAddPiece: (puzzleId: string, piece: PuzzlePiece) => void
  onUpdatePiece: (puzzleId: string, pieceNumber: number, piece: PuzzlePiece) => void
}

export function PieceManager({ selectedPuzzle, onAddPiece, onUpdatePiece }: PieceManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingPiece, setEditingPiece] = useState<number | null>(null)
  const [connections, setConnections] = useState<PuzzleConnection[]>([])
  const [formData, setFormData] = useState({
    number: "",
    dents: "",
    holes: "",
    material: "",
    color: "",
    pattern: "",
    edgeType: "",
    notes: "",
  })

  const { llamado, llamadowithoutbody } = useApi(`${source_link}/puzzle/${selectedPuzzle?.id}/piece`)

  const resetForm = () => {
    setFormData({
      number: "",
      dents: "",
      holes: "",
      material: "",
      color: "",
      pattern: "",
      edgeType: "",
      notes: "",
    })
    setConnections([])
  }

  const addConnection = () => {
    setConnections((prev) => [
      ...prev,
      {
        neighborNumber: 0,
        direction: "top",
        connectionType: "tab",
      },
    ])
  }

  const updateConnection = (index: number, field: keyof PuzzleConnection, value: any) => {
    setConnections((prev) => prev.map((conn, i) => (i === index ? { ...conn, [field]: value } : conn)))
  }

  const removeConnection = (index: number) => {
    setConnections((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPuzzle || !formData.number) return

    const piece: PuzzlePiece = {
      number: Number.parseInt(formData.number),
      connections: connections.filter((conn) => conn.neighborNumber > 0),
      dents: formData.dents
        .split(",")
        .map((d) => d.trim())
        .filter((d) => d),
      holes: formData.holes
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h),
      material: formData.material,
      color: formData.color,
      pattern: formData.pattern,
      edgeType: formData.edgeType as any,
      notes: formData.notes,
    }

    if (editingPiece !== null) {
      await llamado(piece, "PUT")
      onUpdatePiece(selectedPuzzle.id, editingPiece, piece)
      setEditingPiece(null)
    } else {
      await llamado(piece, "POST")
      onAddPiece(selectedPuzzle.id, piece)
    }

    resetForm()
    setShowForm(false)
  }

  const startEdit = (piece: PuzzlePiece) => {
    setFormData({
      number: piece.number.toString(),
      dents: piece.dents.join(", "),
      holes: piece.holes.join(", "),
      material: piece.material,
      color: piece.color,
      pattern: piece.pattern,
      edgeType: piece.edgeType,
      notes: piece.notes,
    })
    setConnections(piece.connections)
    setEditingPiece(piece.number)
    setShowForm(true)
  }

  useEffect(() => {
    const fetchPieces = async () => {
      if (!selectedPuzzle) return
      const data = await llamadowithoutbody("GET")
      if (data && Array.isArray(data.pieces)) {
        data.pieces.forEach((p: PuzzlePiece) => onAddPiece(selectedPuzzle.id, p))
      }
    }
    fetchPieces()
  }, [selectedPuzzle])

  if (!selectedPuzzle) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Piece Management</CardTitle>
          <CardDescription>Please select a puzzle first to manage its pieces</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pieces for {selectedPuzzle.name}</CardTitle>
          <CardDescription>Register and manage individual puzzle pieces with detailed information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              {selectedPuzzle.pieces.length} of {selectedPuzzle.totalPieces} pieces registered
            </p>
            <Button
              onClick={() => {
                resetForm()
                setEditingPiece(null)
                setShowForm(!showForm)
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Piece
            </Button>
          </div>

          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingPiece !== null ? `Edit Piece #${editingPiece}` : "Add New Piece"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="number">Piece Number</Label>
                      <Input
                        id="number"
                        type="number"
                        value={formData.number}
                        onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))}
                        placeholder="e.g., 1"
                        required
                        disabled={editingPiece !== null}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edgeType">Edge Type</Label>
                      <Select
                        value={formData.edgeType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, edgeType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select edge type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corner">Corner</SelectItem>
                          <SelectItem value="edge">Edge</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="material">Material</Label>
                      <Input
                        id="material"
                        value={formData.material}
                        onChange={(e) => setFormData((prev) => ({ ...prev, material: e.target.value }))}
                        placeholder="e.g., cardboard"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="color">Primary Color</Label>
                      <Input
                        id="color"
                        value={formData.color}
                        onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                        placeholder="e.g., blue, red"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pattern">Pattern/Features</Label>
                      <Input
                        id="pattern"
                        value={formData.pattern}
                        onChange={(e) => setFormData((prev) => ({ ...prev, pattern: e.target.value }))}
                        placeholder="e.g., stripes, text, object"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dents">Dents (comma-separated)</Label>
                      <Input
                        id="dents"
                        value={formData.dents}
                        onChange={(e) => setFormData((prev) => ({ ...prev, dents: e.target.value }))}
                        placeholder="e.g., top-left, bottom-right"
                      />
                    </div>
                    <div>
                      <Label htmlFor="holes">Holes (comma-separated)</Label>
                      <Input
                        id="holes"
                        value={formData.holes}
                        onChange={(e) => setFormData((prev) => ({ ...prev, holes: e.target.value }))}
                        placeholder="e.g., center, top"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Neighbor Connections</Label>
                      <Button type="button" onClick={addConnection} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Connection
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {connections.map((connection, index) => (
                        <div key={index} className="flex gap-2 items-center p-2 border rounded">
                          <Input
                            type="number"
                            placeholder="Neighbor #"
                            value={connection.neighborNumber || ""}
                            onChange={(e) =>
                              updateConnection(index, "neighborNumber", Number.parseInt(e.target.value) || 0)
                            }
                            className="w-24"
                          />
                          <Select
                            value={connection.direction}
                            onValueChange={(value) => updateConnection(index, "direction", value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="top">Top</SelectItem>
                              <SelectItem value="right">Right</SelectItem>
                              <SelectItem value="bottom">Bottom</SelectItem>
                              <SelectItem value="left">Left</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={connection.connectionType}
                            onValueChange={(value) => updateConnection(index, "connectionType", value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tab">Tab</SelectItem>
                              <SelectItem value="slot">Slot</SelectItem>
                              <SelectItem value="flat">Flat</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button type="button" onClick={() => removeConnection(index)} size="sm" variant="destructive">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any additional information about this piece"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {editingPiece !== null ? "Update Piece" : "Add Piece"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false)
                        setEditingPiece(null)
                        resetForm()
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedPuzzle.pieces
              .sort((a, b) => a.number - b.number)
              .map((piece) => (
                <Card key={piece.number} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Piece #{piece.number}</CardTitle>
                      <Button
                        onClick={() => startEdit(piece)}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{piece.edgeType}</Badge>
                      {piece.color && <Badge variant="outline">{piece.color}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {piece.connections.length > 0 && (
                      <div>
                        <p className="text-sm font-medium">Connections:</p>
                        <div className="flex flex-wrap gap-1">
                          {piece.connections.map((conn, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              #{conn.neighborNumber} ({conn.direction})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {piece.pattern && (
                      <p className="text-sm">
                        <strong>Pattern:</strong> {piece.pattern}
                      </p>
                    )}
                    {piece.dents.length > 0 && (
                      <p className="text-sm">
                        <strong>Dents:</strong> {piece.dents.join(", ")}
                      </p>
                    )}
                    {piece.holes.length > 0 && (
                      <p className="text-sm">
                        <strong>Holes:</strong> {piece.holes.join(", ")}
                      </p>
                    )}
                    {piece.notes && <p className="text-sm text-gray-600">{piece.notes}</p>}
                  </CardContent>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
