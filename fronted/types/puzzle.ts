export interface PuzzleConnection {
  neighborNumber: number
  direction: "top" | "right" | "bottom" | "left"
  connectionType: "tab" | "slot" | "flat"
}

export interface PuzzlePiece {
  number: number
  connections: PuzzleConnection[]
  dents: string[]
  holes: string[]
  material: string
  color: string
  pattern: string
  edgeType: "corner" | "edge" | "center"
  notes: string
}

export interface Puzzle {
  id: string
  name: string
  totalPieces: number
  difficulty: "easy" | "medium" | "hard" | "expert"
  theme: string
  manufacturer: string
  pieces: PuzzlePiece[]
  createdAt: Date
}
