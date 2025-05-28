"use client"

import { useEffect } from "react"
import useID from "@/hooks/useID"

export default function LogoutPage() {
  const { setUserID } = useID()

  useEffect(() => {
    setUserID(null) // Elimina el ID del localStorage
    window.location.href = "/" // Redirige y recarga la página
  }, [setUserID])

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg font-semibold">Cerrando sesión...</p>
    </div>
  )
}
