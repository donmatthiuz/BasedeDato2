// hooks/useOrdenUpdater.ts
import { useEffect } from "react"

let listeners: (() => void)[] = []

export const triggerOrdenUpdate = () => {
  listeners.forEach((listener) => listener())
}

export const useOrdenUpdater = (callback: () => void) => {
  useEffect(() => {
    listeners.push(callback)
    return () => {
      listeners = listeners.filter((l) => l !== callback)
    }
  }, [callback])
}
