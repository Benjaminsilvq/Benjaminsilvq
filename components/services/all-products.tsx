"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  CreditCard,
  TrendingUp,
  Shield,
  GraduationCap,
  Car,
  Building,
  PiggyBank,
  Home,
  Gift,
  Bell,
  Search,
  ChevronRight,
  Star,
} from "lucide-react"

interface AllProductsProps {
  onBack: () => void
}

export function AllProducts({ onBack }: AllProductsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const products = [
    {
      id: "checking",
      category: "accounts",
      title: "Checking Accounts",
      description: "Everyday banking made simple",
      icon: CreditCard,
      features: ["No minimum balance", "Free online banking", "Mobile deposit"],
      popular: true,
    },
    {
      id: "savings",
      category: "accounts",
      title: "Savings Accounts",
      description: "Grow your money with competitive rates",
      icon: PiggyBank,
      features: ["High APY", "FDIC insured", "Automatic transfers"],
      popular: true,
    },
    {
      id: "credit-cards",
      category: "cards",
      title: "Credit Cards",
      description: "Rewards, cash back, and more",
      icon: CreditCard,
      features: ["Rewards points", "Cash back", "Travel benefits"],
      popular: true,
    },
    {
      id: "auto-loans",
      category: "loans",
      title: "Auto Loans",
      description: "Finance your dream vehicle",
      icon: Car,
      features: ["Competitive rates", "Quick approval", "Flexible terms"],
      popular: true,
    },
    {
      id: "home-loans",
      category: "loans",
      title: "Home Loans & Mortgages",
      description: "Make homeownership a reality",
      icon: Home,
      features: ["Fixed & variable rates", "First-time buyer programs", "Refinancing options"],
      popular: true,
    },
    {
      id: "personal-loans",
      category: "loans",
      title: "Personal Loans",
      description: "Funds for any purpose",
      icon: Building,
      features: ["No collateral required", "Fast funding", "Fixed rates"],
      popular: false,
    },
    {
      id: "student-loans",
      category: "loans",
      title: "Student Loans",
      description: "Invest in your education",
      icon: GraduationCap,
      features: ["Competitive rates", "Flexible repayment", "Cosigner release"],
      popular: false,
    },
    {
      id: "investment",
      category: "investments",
      title: "Investment Services",
      description: "Build wealth for the future",
      icon: TrendingUp,
      features: ["Portfolio management", "Retirement planning", "Stock trading"],
      popular: true,
    },
    {
      id: "insurance",
      category: "insurance",
      title: "Credit Insurance Products",
      description: "Protect your financial future",
      icon: Shield,
      features: ["Life insurance", "Auto insurance", "Home insurance"],
      popular: false,
    },
    {
      id: "special-offers",
      category: "offers",
      title: "Special Offers",
      description: "Exclusive deals for you",
      icon: Gift,
      features: ["Bonus rewards", "Limited time offers", "Member benefits"],
      popular: true,
    },
  ]

  const categories = [
    { id: "all", label: "All Products" },
    { id: "accounts", label: "Accounts" },
    { id: "cards", label: "Cards" },
    { id: "loans", label: "Loans" },
    { id: "investments", label: "Investments" },
    { id: "insurance", label: "Insurance" },
    { id: "offers", label: "Special Offers" },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleProductClick = async (productId: string) => {
    switch (productId) {
      case "checking":
      case "savings":
        // Navigate to account opening
        alert("Opening account application...")
        break
      case "credit-cards":
        window.open("https://www.wellsfargo.com/credit-cards/", "_blank")
        break
      case "auto-loans":
      case "home-loans":
      case "personal-loans":
      case "student-loans":
        // Fetch loan details
        const loanType = productId.replace("-loans", "").replace("-", "")
        const response = await fetch(`/api/loans?type=${loanType}`)
        const data = await response.json()
        alert(`${productId} details loaded. Check console for data.`)
        console.log(data)
        break
      case "investment":
        window.open("https://www.wellsfargo.com/investing-wealth/", "_blank")
        break
      case "insurance":
        window.open("https://www.wellsfargo.com/insurance/", "_blank")
        break
      case "special-offers":
        alert("View our latest special offers and promotions!")
        break
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">All Products & Services</h1>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="overflow-x-auto bg-white border-b border-gray-200">
        <div className="flex gap-2 px-4 py-3 min-w-max">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4 space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found matching your search.</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const IconComponent = product.icon
            return (
              <Card
                key={product.id}
                className="border border-gray-200 hover:border-red-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{product.title}</h3>
                            {product.popular && (
                              <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                <Star className="w-3 h-3 fill-current" />
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </div>

                      <div className="space-y-1 mb-3">
                        {product.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-1 h-1 bg-red-600 rounded-full" />
                            {feature}
                          </div>
                        ))}
                      </div>

                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-sm h-9">Learn More</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Notifications Banner */}
      <div className="p-4 bg-blue-50 border-t border-blue-100">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Stay Updated</h3>
            <p className="text-sm text-blue-700 mb-3">
              Get notifications about new products, special offers, and important account updates.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-9">Manage Notifications</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
