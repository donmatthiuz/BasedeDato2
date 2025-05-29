"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  PlusIcon, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  PuzzleIcon,
  Trash2Icon,
  RotateCw
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import useApi from "@/hooks/useApi"
import source_link from "@/repositori/source_repo"

interface PuzzlePiece {
  id_pieza: number
  coordenada_x: number
  coordenada_y: number
  cantidad_picos: number
  cantidad_hendiduras: number
  bordes: string[]
  estado: 'libre' | 'ensamblada' | 'omitida'
  vecinos: Record<string, number>
}

export function PuzzleManager() {
  const [currentPuzzleId, setCurrentPuzzleId] = useState<string | null>(null)
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [loading, setLoading] = useState({
    puzzle: false,
    pieces: false,
    actions: false
  })
  const [error, setError] = useState<string | null>(null)
  
  const { llamado, llamadowithoutbody } = useApi(`${source_link}/api`)

  // Obtener piezas cuando cambia el puzzle activo
  useEffect(() => {
    if (currentPuzzleId) {
      fetchPieces()
    }
  }, [currentPuzzleId])

  const fetchPieces = async () => {
    setLoading(prev => ({...prev, pieces: true}))
    try {
      const response = await llamadowithoutbody("GET", "/ensamblado")
      setPieces(response || [])
    } catch (err) {
      setError("Error al cargar piezas")
      console.error(err)
    } finally {
      setLoading(prev => ({...prev, pieces: false}))
    }
  }

  const startNewPuzzle = async () => {
    setLoading(prev => ({...prev, actions: true}))
    setError(null)
    
    try {
      // 1. Resetear la base de datos
      await llamadowithoutbody("DELETE", "/reset-db")
      
      // 2. Crear nuevo rompecabezas
      const response = await llamadowithoutbody("POST", "/nuevo-rompecabezas")
      
      setCurrentPuzzleId(response.rompecabezas_id)
      setPieces([])
      
      toast({
        title: "Nuevo rompecabezas iniciado",
        description: `ID: ${response.rompecabezas_id}`,
        action: <CheckCircle2 className="text-green-500" />
      })
      
    } catch (err) {
      setError("Error al iniciar nuevo rompecabezas")
      console.error(err)
    } finally {
      setLoading(prev => ({...prev, actions: false}))
    }
  }

  const addPiece = async () => {
    if (!currentPuzzleId) return
    
    setLoading(prev => ({...prev, actions: true}))
    try {
      // Generar ID autoincremental
      const newId = pieces.length > 0 ? Math.max(...pieces.map(p => p.id_pieza)) + 1 : 1
      
      const newPiece: Omit<PuzzlePiece, 'id_pieza'> = {
        coordenada_x: 0,
        coordenada_y: 0,
        cantidad_picos: 0,
        cantidad_hendiduras: 0,
        bordes: [],
        estado: 'libre',
        vecinos: {}
      }

      const response = await llamado(
        { id_pieza: newId, ...newPiece },
        "POST",
        "/pieza"
      )
      
      setPieces(prev => [...prev, { id_pieza: newId, ...newPiece }])
      
      toast({
        title: "Pieza añadida",
        description: `Pieza #${newId} registrada`,
        action: <CheckCircle2 className="text-green-500" />
      })
      
    } catch (err) {
      setError("Error al añadir pieza")
      console.error(err)
    } finally {
      setLoading(prev => ({...prev, actions: false}))
    }
  }

  const updatePieceStatus = async (idPieza: number, newStatus: string) => {
    setLoading(prev => ({...prev, actions: true}))
    try {
      await llamado(
        { estado: newStatus },
        "PATCH",
        `/pieza/${idPieza}`
      )
      
      setPieces(prev => prev.map(p => 
        p.id_pieza === idPieza ? { ...p, estado: newStatus } : p
      ))
      
      toast({
        title: "Estado actualizado",
        description: `Pieza #${idPieza} ahora está ${newStatus}`,
        action: <CheckCircle2 className="text-green-500" />
      })
      
    } catch (err) {
      setError("Error al actualizar estado")
      console.error(err)
    } finally {
      setLoading(prev => ({...prev, actions: false}))
    }
  }

  const assemblePieces = async () => {
    setLoading(prev => ({...prev, actions: true}))
    try {
      await llamadowithoutbody("POST", "/ensamblar")
      await fetchPieces() // Refrescar datos
      
      toast({
        title: "Ensamblaje completado",
        description: "Se han generado las conexiones entre piezas",
        action: <CheckCircle2 className="text-green-500" />
      })
      
    } catch (err) {
      setError("Error al ensamblar piezas")
      console.error(err)
    } finally {
      setLoading(prev => ({...prev, actions: false}))
    }
  }

  return (
    <div className="space-y-6">
      {/* Panel de control principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PuzzleIcon className="h-5 w-5" />
            Gestión de Rompecabezas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!currentPuzzleId ? (
            <div className="text-center py-8">
              <Button 
                onClick={startNewPuzzle}
                disabled={loading.actions}
                className="gap-2"
              >
                {loading.actions ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlusIcon className="h-4 w-4" />
                )}
                Crear Nuevo Rompecabezas
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-sm">
                  Rompecabezas ID: {currentPuzzleId}
                </Badge>
                <div className="flex gap-2">
                  <Button 
                    onClick={assemblePieces}
                    disabled={loading.actions}
                    variant="outline"
                    className="gap-2"
                  >
                    {loading.actions ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RotateCw className="h-4 w-4" />
                    )}
                    Ensamblar Piezas
                  </Button>
                  <Button 
                    onClick={startNewPuzzle}
                    disabled={loading.actions}
                    variant="destructive"
                    className="gap-2"
                  >
                    <Trash2Icon className="h-4 w-4" />
                    Reiniciar Todo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Piezas Registradas</CardTitle>
                    <div className="text-2xl font-bold">
                      {pieces.length}
                    </div>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ensambladas</CardTitle>
                    <div className="text-2xl font-bold text-green-500">
                      {pieces.filter(p => p.estado === 'ensamblada').length}
                    </div>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Libres</CardTitle>
                    <div className="text-2xl font-bold text-blue-500">
                      {pieces.filter(p => p.estado === 'libre').length}
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Listado de piezas */}
      {currentPuzzleId && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Piezas del Rompecabezas</CardTitle>
              <Button 
                onClick={addPiece}
                disabled={loading.actions}
                className="gap-2"
              >
                {loading.actions ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlusIcon className="h-4 w-4" />
                )}
                Añadir Pieza
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {pieces.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay piezas registradas aún
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pieces.map(piece => (
                  <Card key={piece.id_pieza}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          Pieza #{piece.id_pieza}
                        </CardTitle>
                        <Badge variant={
                          piece.estado === 'ensamblada' ? 'default' : 
                          piece.estado === 'libre' ? 'secondary' : 'destructive'
                        }>
                          {piece.estado}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <Label>Posición:</Label>
                        <p>({piece.coordenada_x}, {piece.coordenada_y})</p>
                      </div>
                      <div>
                        <Label>Picos/Hendiduras:</Label>
                        <p>{piece.cantidad_picos} / {piece.cantidad_hendiduras}</p>
                      </div>
                      {piece.bordes.length > 0 && (
                        <div>
                          <Label>Bordes:</Label>
                          <div className="flex flex-wrap gap-1">
                            {piece.bordes.map(borde => (
                              <Badge key={borde} variant="outline">
                                {borde}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant={piece.estado === 'ensamblada' ? 'default' : 'outline'}
                          onClick={() => updatePieceStatus(piece.id_pieza, 'ensamblada')}
                        >
                          Ensamblar
                        </Button>
                        <Button
                          size="sm"
                          variant={piece.estado === 'libre' ? 'default' : 'outline'}
                          onClick={() => updatePieceStatus(piece.id_pieza, 'libre')}
                        >
                          Liberar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Manejo de errores */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}