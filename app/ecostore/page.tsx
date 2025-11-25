"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Leaf, ShoppingBag } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  points_cost: number
  category: string
  stock: number
}

interface EcoPointsData {
  availablePoints: number
}

export default function EcoStorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [ecoPoints, setEcoPoints] = useState<EcoPointsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, pointsRes] = await Promise.all([fetch("/api/ecostore"), fetch("/api/ecopoints")])

        const productsData = await productsRes.json()
        const pointsData = await pointsRes.json()

        setProducts(productsData.products || [])
        setEcoPoints(pointsData)
      } catch (error) {
        console.error("[v0] Error fetching eco store data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const categories = Array.from(new Set(products.map((p) => p.category)))
  const filteredProducts = selectedCategory ? products.filter((p) => p.category === selectedCategory) : products

  const handlePurchase = async (productId: string, pointsCost: number) => {
    try {
      const response = await fetch("/api/ecostore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          pointsToSpend: pointsCost,
        }),
      })

      if (response.ok) {
        alert("Product purchased successfully! Check your email for details.")
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to purchase product")
      }
    } catch (error) {
      console.error("[v0] Error purchasing product:", error)
      alert("Failed to complete purchase")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">Eco-Friendly Store</h1>
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full font-bold text-lg">
              <Leaf className="h-5 w-5 inline mr-2" />
              {ecoPoints?.availablePoints || 0} Points Available
            </div>
          </div>
          <p className="text-lg text-muted-foreground">Redeem your eco-points for sustainable products</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-20">
                <h3 className="font-bold text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === null ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="p-6 flex flex-col hover:shadow-lg transition-shadow">
                    <div className="mb-4 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-green-600" />
                    </div>

                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-grow">{product.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Stock: {product.stock}</span>
                        <span className="text-xs text-muted-foreground">{product.category}</span>
                      </div>

                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg flex items-center justify-center font-bold text-lg">
                        <Leaf className="h-5 w-5 mr-2" />
                        {product.points_cost} Points
                      </div>

                      <Button
                        onClick={() => handlePurchase(product.id, product.points_cost)}
                        disabled={!ecoPoints || ecoPoints.availablePoints < product.points_cost || product.stock === 0}
                        className="w-full"
                      >
                        {!ecoPoints || ecoPoints.availablePoints < product.points_cost
                          ? "Not Enough Points"
                          : product.stock === 0
                            ? "Out of Stock"
                            : "Redeem"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products available in this category</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
