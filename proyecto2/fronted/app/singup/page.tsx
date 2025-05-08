"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import useID from "@/hooks/useID"
import useApi from "@/hooks/useApi"
import source_link from "@/repositori/source_repo"

// Define a type for the form data to help TypeScript
interface FormData {
  nombre: string;
  email: string;
  direccion: string;
  telefono: string;
  contra: string;
  tipo: string;
}

export default function SignupPage() {
  const router = useRouter()
  const { setUserID } = useID()

  const {llamado: crear_cuenta} = useApi(`${source_link}/api/usuario`)

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    direccion: "",
    telefono: "",
    contra: "",
    tipo: "cliente", // Set a default value
  })

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Make sure TypeScript knows this is a valid key of FormData
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    console.log(`Changed ${name} to ${value}`); // Add debug log
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización.")
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        const body = {
          ...formData,
          coordenadas: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          fecha_registro: new Date().toISOString(),
        }

        try {


          
          // const res = await fetch("http://localhost:3000/api/usuario", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify(body),
          // })

          // if (!res.ok) {
          //   throw new Error("Error al registrar el usuario")
          // }

          // const data = await res.json()
          // setUserID(data._id)

          const respuesta = await  crear_cuenta(body, "POST");
          
          if(respuesta.nombre == formData.nombre){

            setUserID(respuesta._id)
            if (formData.tipo == 'restaurante'){
              const query = new URLSearchParams({
                nombre: formData.nombre,
                email: formData.email,
                direccion: formData.direccion,
                telefono: formData.telefono,
                contra: formData.contra,
                tipo: formData.tipo,
                lat: latitude.toString(),
                lng: longitude.toString(),
                fecha_registro: new Date().toISOString(),
              }).toString()
              
              router.push(`/restaurant_log?${query}`)
    
            }else{
              window.location.href = "/"
            }
          }else{
            setError("Error al crear cuenta")
          }
 

         
        } catch (err) {
          setError("Error al registrar. Intenta más tarde.")
        } finally {
          setIsLoading(false)
        }
      },
      () => {
        setError("Permiso de ubicación denegado.")
        setIsLoading(false)
      }
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Crear Cuenta</CardTitle>
          <CardDescription className="text-center">Llena tus datos para registrarte</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Nombre", name: "nombre", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Dirección", name: "direccion", type: "text" },
              { label: "Teléfono", name: "telefono", type: "tel" },
              { label: "Contraseña", name: "contra", type: "password" },
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  required
                  value={formData[field.name as keyof FormData]}
                  onChange={handleChange}
                />
              </div>
            ))}

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de usuario</Label>
            <select
              id="tipo"
              name="tipo"
              className="w-full border rounded-md p-2"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione tipo</option>
              <option value="cliente">Cliente</option>
              <option value="restaurante">Restaurante</option>
            </select>
          </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Crear Cuenta"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}