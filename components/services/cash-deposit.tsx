"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  DollarSign,
  MapPin,
  Navigation,
  Phone,
  Clock,
  CheckCircle,
  CreditCard,
  Building,
  Banknote,
} from "lucide-react"
import { getLocation, type LocationData } from "@/lib/camera-utils"
import { findNearbyATMsBranches, type ATMBranch } from "@/lib/atm-branch-data"

interface CashDepositProps {
  onBack: () => void
  onDepositComplete: (deposit: any) => void
}

export function CashDeposit({ onBack, onDepositComplete }: CashDepositProps) {
  const [amount, setAmount] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<ATMBranch | null>(null)
  const [depositMethod, setDepositMethod] = useState<"atm" | "teller">("atm")
  const [nearbyLocations, setNearbyLocations] = useState<ATMBranch[]>([])
  const [userLocation, setUserLocation] = useState<LocationData | null>(null)
  const [loadingLocations, setLoadingLocations] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  const findNearbyLocations = async () => {
    setLoadingLocations(true)
    try {
      const location = await getLocation()
      setUserLocation(location)

      const locations = findNearbyATMsBranches(location.latitude, location.longitude)
      setNearbyLocations(locations)
    } catch (error) {
      console.error("Location error:", error)
      alert("Location access denied. Please enable location services to find nearby ATMs and branches.")
    } finally {
      setLoadingLocations(false)
    }
  }

  const handleSubmitDeposit = async () => {
    if (!amount || !selectedLocation) {
      alert("Please enter amount and select a location")
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch("/api/cash-deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          locationId: selectedLocation.id,
          accountId: "acc_12345", // Would come from user context
          depositMethod,
        }),
      })

      const result = await response.json()

      if (result.success) {
        const deposit = {
          id: result.deposit.id,
          type: "completed" as const,
          description: `Cash deposit at ${selectedLocation.name}`,
          amount: Number.parseFloat(amount),
          date: new Date().toLocaleDateString(),
          category: "deposit" as const,
          confirmationNumber: result.deposit.confirmationNumber,
        }

        onDepositComplete(deposit)
        alert(`Cash deposit of $${amount} completed! Confirmation: ${result.deposit.confirmationNumber}`)
      } else {
        throw new Error(result.error || "Deposit failed")
      }
    } catch (error) {
      console.error("Deposit error:", error)
      alert("Failed to process deposit. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    findNearbyLocations()
  }, [])

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Cash Deposit</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Deposit Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10 h-12 text-lg"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        {/* Deposit Method Selection */}
        <div className="space-y-3">
          <Label>Deposit Method</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDepositMethod("atm")}
              className={`p-4 rounded-lg border-2 text-center transition-colors ${
                depositMethod === "atm"
                  ? "border-red-600 bg-red-50 text-red-600"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <CreditCard className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium">ATM Deposit</p>
              <p className="text-xs text-gray-500 mt-1">24/7 Available</p>
            </button>
            <button
              onClick={() => setDepositMethod("teller")}
              className={`p-4 rounded-lg border-2 text-center transition-colors ${
                depositMethod === "teller"
                  ? "border-red-600 bg-red-50 text-red-600"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Building className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium">Teller Deposit</p>
              <p className="text-xs text-gray-500 mt-1">Business Hours</p>
            </button>
          </div>
        </div>

        {/* Instructions Card */}
        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Banknote className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">
                  {depositMethod === "atm" ? "ATM Deposit Instructions:" : "Teller Deposit Instructions:"}
                </p>
                {depositMethod === "atm" ? (
                  <ul className="space-y-1 text-xs">
                    <li>• Insert your Wells Fargo debit card</li>
                    <li>• Enter your PIN</li>
                    <li>• Select "Deposit" and choose your account</li>
                    <li>• Insert cash bills (no coins)</li>
                    <li>• Confirm the amount and complete transaction</li>
                  </ul>
                ) : (
                  <ul className="space-y-1 text-xs">
                    <li>• Bring valid ID and account information</li>
                    <li>• Fill out a deposit slip</li>
                    <li>• Hand cash and slip to teller</li>
                    <li>• Receive receipt for your records</li>
                    <li>• Funds available immediately</li>
                  </ul>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Select Location</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={findNearbyLocations}
              disabled={loadingLocations}
              className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
            >
              <MapPin className="w-4 h-4 mr-1" />
              {loadingLocations ? "Finding..." : "Refresh"}
            </Button>
          </div>

          {nearbyLocations.length > 0 ? (
            <div className="space-y-3">
              {nearbyLocations
                .filter((location) => (depositMethod === "atm" ? true : location.type === "branch"))
                .slice(0, 5)
                .map((location) => (
                  <Card
                    key={location.id}
                    className={`border cursor-pointer transition-colors ${
                      selectedLocation?.id === location.id
                        ? "border-red-600 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedLocation(location)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="secondary"
                              className={`${
                                location.type === "atm" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                              }`}
                            >
                              {location.type.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-500">{location.distance?.toFixed(1)} mi</span>
                            {selectedLocation?.id === location.id && <CheckCircle className="w-4 h-4 text-red-600" />}
                          </div>
                          <h5 className="font-medium text-gray-900">{location.name}</h5>
                          <p className="text-sm text-gray-600">
                            {location.address}, {location.city}, {location.state}
                          </p>

                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            {location.type === "branch" && location.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {location.phone}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {location.hours["Monday-Friday"] || location.hours["Monday-Sunday"]}
                            </span>
                          </div>

                          {/* Features */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {location.features.slice(0, 3).map((feature) => (
                              <span key={feature} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-50 ml-2 bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            const url = `https://maps.google.com/?q=${location.coordinates.lat},${location.coordinates.lng}`
                            window.open(url, "_blank")
                          }}
                        >
                          <Navigation className="w-3 h-3 mr-1" />
                          Directions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card className="border-dashed border-gray-300">
              <CardContent className="p-8 text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No locations found nearby</p>
                <Button
                  onClick={findNearbyLocations}
                  disabled={loadingLocations}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {loadingLocations ? "Searching..." : "Search Again"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Deposit Limits */}
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Cash Deposit Information</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Daily ATM limit:</span>
                <span className="font-medium">$10,000</span>
              </div>
              <div className="flex justify-between">
                <span>Teller limit:</span>
                <span className="font-medium">No limit</span>
              </div>
              <div className="flex justify-between">
                <span>Availability:</span>
                <span className="font-medium">Immediate</span>
              </div>
              <div className="flex justify-between">
                <span>Fee:</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmitDeposit}
          disabled={isProcessing || !amount || !selectedLocation}
          className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
        >
          {isProcessing ? "Processing..." : `Confirm $${amount || "0.00"} Cash Deposit`}
        </Button>
      </div>
    </div>
  )
}
