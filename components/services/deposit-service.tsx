"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Camera,
  Upload,
  DollarSign,
  CheckCircle,
  AlertCircle,
  MapPin,
  Navigation,
  Phone,
} from "lucide-react"
import { cameraUtils, getLocation, type LocationData } from "@/lib/camera-utils"
import { findNearbyATMsBranches, type ATMBranch } from "@/lib/atm-branch-data"
import { useEnhancedNotifications } from "@/components/notifications/enhanced-notification-system"

interface DepositServiceProps {
  onBack: () => void
  onDepositComplete: (deposit: any) => void
}

export function DepositService({ onBack, onDepositComplete }: DepositServiceProps) {
  const [depositType, setDepositType] = useState<"check" | "cash" | "transfer">("check")
  const [amount, setAmount] = useState("")
  const [checkFront, setCheckFront] = useState<string | null>(null)
  const [checkBack, setCheckBack] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [showCamera, setShowCamera] = useState<"front" | "back" | null>(null)
  const [nearbyLocations, setNearbyLocations] = useState<ATMBranch[]>([])
  const [userLocation, setUserLocation] = useState<LocationData | null>(null)
  const [loadingLocations, setLoadingLocations] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { createTransactionAlert, addNotification } = useEnhancedNotifications()

  const startCamera = async (side: "front" | "back") => {
    try {
      console.log("[v0] Starting camera for", side)

      // Check if browser supports camera
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser")
      }

      const stream = await cameraUtils.startCamera()
      console.log("[v0] Camera stream obtained:", stream.getTracks().length, "tracks")

      setCameraStream(stream)
      setShowCamera(side)

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        videoRef.current.onloadedmetadata = () => {
          console.log("[v0] Video metadata loaded")
          videoRef.current?.play().catch(console.error)
        }

        videoRef.current.onerror = (error) => {
          console.error("[v0] Video error:", error)
        }
      }
    } catch (error) {
      console.error("[v0] Camera error:", error)

      let errorMessage = "Camera access denied. "
      if (error instanceof Error) {
        if (error.message.includes("Permission denied")) {
          errorMessage += "Please allow camera access in your browser settings and try again."
        } else if (error.message.includes("Timeout")) {
          errorMessage += "Camera took too long to start. Please try again."
        } else if (error.message.includes("not supported")) {
          errorMessage += "Your browser doesn't support camera access."
        } else {
          errorMessage += "Please check your camera permissions and try again."
        }
      }

      alert(errorMessage)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && showCamera) {
      try {
        const photoData = cameraUtils.capturePhoto(videoRef.current)

        if (showCamera === "front") {
          setCheckFront(photoData)
        } else {
          setCheckBack(photoData)
        }

        stopCamera()
      } catch (error) {
        console.error("Capture error:", error)
        alert("Failed to capture photo. Please try again.")
      }
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraUtils.stopCamera(cameraStream)
      setCameraStream(null)
      setShowCamera(null)
    }
  }

  const findNearbyLocations = async () => {
    setLoadingLocations(true)
    try {
      console.log("[v0] Starting location request")
      const location = await getLocation()
      console.log("[v0] Location obtained:", location)
      setUserLocation(location)

      const locations = findNearbyATMsBranches(location.latitude, location.longitude)
      console.log("[v0] Found locations:", locations.length)
      setNearbyLocations(locations)
    } catch (error) {
      console.error("[v0] Location error:", error)

      let errorMessage = "Unable to find nearby locations. "
      if (error instanceof Error) {
        if (error.message.includes("denied") || error.message.includes("PERMISSION_DENIED")) {
          errorMessage += "Please enable location services in your browser settings and try again."
        } else if (error.message.includes("timeout") || error.message.includes("timed out")) {
          errorMessage += "Location request took too long. Please check your connection and try again."
        } else if (error.message.includes("not supported")) {
          errorMessage += "Your browser doesn't support location services."
        } else {
          errorMessage += "Please try again or search manually."
        }
      }

      alert(errorMessage)

      // Provide fallback locations if geolocation fails
      const fallbackLocations = findNearbyATMsBranches(37.7749, -122.4194) // San Francisco as fallback
      setNearbyLocations(fallbackLocations.slice(0, 5))
    } finally {
      setLoadingLocations(false)
    }
  }

  const handleFileUpload = (side: "front" | "back", event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (side === "front") {
          setCheckFront(result)
        } else {
          setCheckBack(result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitDeposit = async () => {
    if (!amount || (depositType === "check" && (!checkFront || !checkBack))) {
      alert("Please complete all required fields")
      return
    }

    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append("amount", amount)
      formData.append("accountId", "acc_12345") // Would come from user context

      if (checkFront && checkBack) {
        // Convert base64 to blob for API
        const frontBlob = await fetch(checkFront).then((r) => r.blob())
        const backBlob = await fetch(checkBack).then((r) => r.blob())

        formData.append("checkFront", frontBlob, "check_front.jpg")
        formData.append("checkBack", backBlob, "check_back.jpg")
      }

      const response = await fetch("/api/mobile-deposit", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        const deposit = {
          id: result.deposit.id,
          type: "pending" as const,
          description: `Mobile ${depositType} deposit`,
          amount: Number.parseFloat(amount),
          date: new Date().toLocaleDateString(),
          category: "deposit" as const,
          confirmationNumber: result.deposit.confirmationNumber,
        }

        addNotification({
          type: "credit",
          title: "Deposit Received",
          message: `Mobile ${depositType} deposit of $${amount} is being processed`,
          priority: "medium",
          category: "Transaction Alert",
          amount: Number.parseFloat(amount),
          currency: "USD",
          account: "EVERYDAY CHECKING ...6224",
          merchant: `Mobile ${depositType} Deposit`,
        })

        onDepositComplete(deposit)
        alert(
          `${depositType} deposit of $${amount} submitted successfully! Confirmation: ${result.deposit.confirmationNumber}`,
        )
      } else {
        throw new Error(result.error || "Deposit failed")
      }
    } catch (error) {
      console.error("Deposit error:", error)
      alert("Failed to submit deposit. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraUtils.stopCamera(cameraStream)
      }
    }
  }, [cameraStream])

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Mobile Deposit</h1>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 text-white">
            <button onClick={stopCamera} className="text-white">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-semibold">Capture {showCamera === "front" ? "Front" : "Back"} of Check</h2>
            <div></div>
          </div>

          <div className="flex-1 relative">
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-2 border-white border-dashed rounded-lg w-80 h-48 flex items-center justify-center">
                <span className="text-white text-sm">Position check within frame</span>
              </div>
            </div>
          </div>

          <div className="p-4 flex justify-center">
            <Button onClick={capturePhoto} className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16">
              <Camera className="h-8 w-8" />
            </Button>
          </div>
        </div>
      )}

      {/* Deposit Type Selection */}
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setDepositType("check")}
            className={`p-3 rounded-lg border-2 text-center transition-colors ${
              depositType === "check"
                ? "border-red-600 bg-red-50 text-red-600"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <CheckCircle className="w-5 h-5 mx-auto mb-2" />
            <p className="text-sm font-medium">Check</p>
          </button>
          <button
            onClick={() => setDepositType("cash")}
            className={`p-3 rounded-lg border-2 text-center transition-colors ${
              depositType === "cash" ? "border-red-600 bg-red-50 text-red-600" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <DollarSign className="w-5 h-5 mx-auto mb-2" />
            <p className="text-sm font-medium">Cash</p>
          </button>
          <button
            onClick={() => setDepositType("transfer")}
            className={`p-3 rounded-lg border-2 text-center transition-colors ${
              depositType === "transfer"
                ? "border-red-600 bg-red-50 text-red-600"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Upload className="w-5 h-5 mx-auto mb-2" />
            <p className="text-sm font-medium">Transfer</p>
          </button>
        </div>
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

        {/* Check Deposit Interface */}
        {depositType === "check" && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Mobile Check Deposit Tips:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Ensure check is endorsed on the back</li>
                    <li>• Place check on a dark surface</li>
                    <li>• Make sure all corners are visible</li>
                    <li>• Avoid shadows and glare</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Front of Check */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Front of Check</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {checkFront ? (
                  <div className="relative">
                    <img
                      src={checkFront || "/placeholder.svg"}
                      alt="Check Front"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => setCheckFront(null)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Capture the front of your check</p>
                    <div className="space-y-2">
                      <Button onClick={() => startCamera("front")} className="w-full bg-red-600 hover:bg-red-700">
                        <Camera className="w-4 h-4 mr-2" />
                        Take Photo
                      </Button>
                      <div className="relative">
                        <Button
                          variant="outline"
                          className="w-full border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                          onClick={() => document.getElementById("front-upload")?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </Button>
                        <input
                          id="front-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload("front", e)}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Back of Check */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Back of Check</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {checkBack ? (
                  <div className="relative">
                    <img
                      src={checkBack || "/placeholder.svg"}
                      alt="Check Back"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => setCheckBack(null)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Capture the back of your check</p>
                    <div className="space-y-2">
                      <Button onClick={() => startCamera("back")} className="w-full bg-red-600 hover:bg-red-700">
                        <Camera className="w-4 h-4 mr-2" />
                        Take Photo
                      </Button>
                      <div className="relative">
                        <Button
                          variant="outline"
                          className="w-full border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                          onClick={() => document.getElementById("back-upload")?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </Button>
                        <input
                          id="back-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload("back", e)}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Cash Deposit Interface */}
        {depositType === "cash" && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cash Deposit</h3>
                <p className="text-gray-600 mb-4">
                  Visit any Wells Fargo ATM or branch to make a cash deposit. Use your debit card and PIN at the ATM.
                </p>
                <Button
                  onClick={findNearbyLocations}
                  disabled={loadingLocations}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {loadingLocations ? "Finding Locations..." : "Find Nearest ATM/Branch"}
                </Button>
              </CardContent>
            </Card>

            {nearbyLocations.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Nearby Locations</h4>
                {nearbyLocations.slice(0, 3).map((location) => (
                  <Card key={location.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                location.type === "atm" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                              }`}
                            >
                              {location.type.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-500">{location.distance?.toFixed(1)} mi</span>
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
                            <span>{location.hours["Monday-Friday"] || location.hours["Monday-Sunday"]}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                          onClick={() => {
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
            )}
          </div>
        )}

        {/* Transfer Deposit Interface */}
        {depositType === "transfer" && (
          <Card>
            <CardContent className="p-6 text-center">
              <Upload className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transfer Deposit</h3>
              <p className="text-gray-600 mb-4">
                Transfer funds from another bank account or receive direct deposits from employers.
              </p>
              <div className="space-y-2">
                <Button className="w-full bg-red-600 hover:bg-red-700">Setup Direct Deposit</Button>
                <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50 bg-transparent">
                  Transfer from External Bank
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        {depositType === "check" && (
          <Button
            onClick={handleSubmitDeposit}
            disabled={isProcessing || !amount || !checkFront || !checkBack}
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            {isProcessing ? "Processing..." : `Submit $${amount || "0.00"} Deposit`}
          </Button>
        )}

        {/* Deposit Limits */}
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Deposit Limits</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Daily limit:</span>
                <span className="font-medium">$5,000</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly limit:</span>
                <span className="font-medium">$25,000</span>
              </div>
              <div className="flex justify-between">
                <span>Funds available:</span>
                <span className="font-medium">Next business day</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
