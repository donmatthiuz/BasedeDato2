"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function RestaurantFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState([0, 4])
  const [cuisines, setCuisines] = useState<string[]>([])
  const [deliveryTime, setDeliveryTime] = useState<number>(60)

  const handleCuisineChange = (cuisine: string, checked: boolean) => {
    if (checked) {
      setCuisines([...cuisines, cuisine])
    } else {
      setCuisines(cuisines.filter((c) => c !== cuisine))
    }
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)

    // Set price range
    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())

    // Set cuisines
    if (cuisines.length > 0) {
      params.set("cuisines", cuisines.join(","))
    } else {
      params.delete("cuisines")
    }

    // Set max delivery time
    params.set("maxDeliveryTime", deliveryTime.toString())

    router.push(`/restaurants?${params.toString()}`)
  }

  const resetFilters = () => {
    setPriceRange([0, 4])
    setCuisines([])
    setDeliveryTime(60)
    router.push("/restaurants")
  }

  return (
    <div className="bg-card rounded-lg border p-4">
      <h2 className="font-semibold text-lg mb-4">Filters</h2>

      <Accordion type="multiple" defaultValue={["price", "cuisine", "delivery"]}>
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="py-2">
              <Slider defaultValue={[0, 4]} max={4} step={1} value={priceRange} onValueChange={setPriceRange} />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>$</span>
                <span>$$</span>
                <span>$$$</span>
                <span>$$$$</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cuisine">
          <AccordionTrigger>Cuisine</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["Italian", "Japanese", "Mexican", "Indian", "Chinese", "American", "Thai"].map((cuisine) => (
                <div key={cuisine} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cuisine-${cuisine}`}
                    checked={cuisines.includes(cuisine)}
                    onCheckedChange={(checked) => handleCuisineChange(cuisine, checked as boolean)}
                  />
                  <label
                    htmlFor={`cuisine-${cuisine}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {cuisine}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="delivery">
          <AccordionTrigger>Delivery Time</AccordionTrigger>
          <AccordionContent>
            <div className="py-2">
              <Slider
                defaultValue={[60]}
                max={90}
                step={5}
                value={[deliveryTime]}
                onValueChange={([value]) => setDeliveryTime(value)}
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-muted-foreground">Max {deliveryTime} min</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex gap-2 mt-6">
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>
    </div>
  )
}
