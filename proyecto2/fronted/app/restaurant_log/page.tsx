"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import useApi from "@/hooks/useApi"
import source_link from "@/repositori/source_repo"

export default function Restaurant_Log() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [categorias, setCategorias] = useState("")
  const {llamado: restaurante} = useApi(`${source_link}/api/restaurante`)

  const onSelect = (categoria: string) => {
    const categoriaArray = categorias.split(",").filter(Boolean)
    if (!categoriaArray.includes(categoria)) {
      const nuevaCadena = [...categoriaArray, categoria].join(",")
      setCategorias(nuevaCadena)
    }
  }

  const usuario = {
    nombre: searchParams.get("nombre"),
    direccion: searchParams.get("direccion"),
    telefono: searchParams.get("telefono"),
    coordenadas: {
      type: "Point",
      coordinates: [
        parseFloat(searchParams.get("lng") || "0"),
        parseFloat(searchParams.get("lat") || "0"),
      ],
    },
  }

  const handleContinuar = async() => {
    console.log("Usuario:", usuario)
    console.log("Categorías seleccionadas:", categorias)

    const body = {
      nombre: searchParams.get("nombre"),
      direccion: searchParams.get("direccion"),
      telefono: searchParams.get("telefono"),
      categoria: categorias,
      coordenadas: {
        type: "Point",
        coordinates: [
          parseFloat(searchParams.get("lng") || "0"),
          parseFloat(searchParams.get("lat") || "0"),
        ],
      },
    }

    const respuesta = await restaurante(body, "POST");

    if (respuesta.nombre == body.nombre){
      router.push("/restaurante_dash")

    }


    // router.push("/siguiente-paso") o enviar al backend
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <section className="w-full max-w-xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Hola, {usuario.nombre}</h2>
          <p className="text-muted-foreground">Selecciona las categorías que describen tu restaurante:</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {["Italiana", "Japonesa", "Mexicana", "India", "Cervecería", "Parrillada", "Mariscos", "Rápida"].map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => onSelect(cuisine)}
              className={`rounded-lg p-4 text-center border transition-colors ${
                categorias.split(",").includes(cuisine)
                  ? "bg-primary text-white"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <h3 className="font-medium text-lg">{cuisine}</h3>
            </button>
          ))}
        </div>

        {categorias && (
          <div className="mb-4 text-center">
            <p className="text-sm font-medium">Seleccionadas: {categorias}</p>
          </div>
        )}

        <div className="text-center">
          


          <Button type="submit" className="w-full" onClick={handleContinuar}>
              Continuar
            </Button>
        </div>
      </section>
    </div>
  )
}
