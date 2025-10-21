"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Phone,
  Clock,
  Search,
  Filter,
  CreditCard,
  Car,
  Armchair as Wheelchair,
  Shield,
  Banknote,
  CheckCircle,
} from "lucide-react"
import { getLocation, type LocationData } from "@/lib/camera-utils"
import { findNearbyATMsBranches, atmBranchData, type ATMBranch } from "@/lib/atm-branch-data"

interface ATMBranchLocatorProps {
  onBack: () => void
}

export function ATMBranchLocator({ onBack }: ATMBranchLocatorProps) {
  const [locations, setLocations] = useState<ATMBranch[]>([])
  const [filteredLocations, setFilteredLocations] = useState<ATMBranch[]>([])
  const [userLocation, setUserLocation] = useState<LocationData | null>(null)
  const [loadingLocations, setLoadingLocations] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<"all" | "atm" | "branch">("all")
  const [selectedRadius, setSelectedRadius] = useState("25")
  const [sortBy, setSortBy] = useState<"distance" | "name">("distance")
  const [selectedLocation, setSelectedLocation] = useState<ATMBranch | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const findLocations = async (useCurrentLocation = true) => {
    setLoadingLocations(true)
    try {
      let searchLat = 37.5407 // Default to Richmond, VA
      let searchLng = -77.436

      if (useCurrentLocation) {
        try {
          const location = await getLocation()
          setUserLocation(location)
          searchLat = location.latitude
          searchLng = location.longitude
        } catch (error) {
          console.warn("Using default location due to:", error)
        }
      }

      const nearbyLocations = findNearbyATMsBranches(searchLat, searchLng, Number.parseInt(selectedRadius))
      setLocations(nearbyLocations)
      setFilteredLocations(nearbyLocations)
    } catch (error) {
      console.error("Location search error:", error)
      // Fallback to showing all locations
      const allLocations = atmBranchData.map((location) => ({
        ...location,
        distance: Math.random() * 50, // Mock distance for fallback
      }))
      setLocations(allLocations)
      setFilteredLocations(allLocations)
    } finally {
      setLoadingLocations(false)
    }
  }

  const searchByAddress = async () => {
    if (!searchQuery.trim()) {
      findLocations(true)
      return
    }

    setLoadingLocations(true)
    try {
      // In a real app, this would geocode the address
      // For demo, we'll filter by city/state/address
      const filtered = atmBranchData
        .filter(
          (location) =>
            location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            location.state.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .map((location) => ({
          ...location,
          distance: Math.random() * 50, // Mock distance
        }))

      setLocations(filtered)
      setFilteredLocations(filtered)
    } catch (error) {
      console.error("Address search error:", error)
    } finally {
      setLoadingLocations(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...locations]

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((location) => location.type === selectedType)
    }

    // Sort
    if (sortBy === "distance") {
      filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0))
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    setFilteredLocations(filtered)
  }

  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case "drive-through":
        return <Car className="w-3 h-3" />
      case "wheelchair accessible":
        return <Wheelchair className="w-3 h-3" />
      case "security cameras":
      case "security monitored":
        return <Shield className="w-3 h-3" />
      case "envelope-free deposits":
        return <Banknote className="w-3 h-3" />
      default:
        return <CreditCard className="w-3 h-3" />
    }
  }

  const openDirections = (location: ATMBranch) => {
    const url = `https://maps.google.com/?q=${location.coordinates.lat},${location.coordinates.lng}`
    window.open(url, "_blank")
  }

  const callLocation = (phone: string) => {
    window.open(`tel:${phone}`, "_self")
  }

  useEffect(() => {
    findLocations()
  }, [selectedRadius])

  useEffect(() => {
    applyFilters()
  }, [locations, selectedType, sortBy])

  if (showDetails && selectedLocation) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
          <button onClick={() => setShowDetails(false)} className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Location Details</h1>
        </div>

        <div className="p-4 space-y-6">
          {/* Location Header */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="secondary"
                      className={`${
                        selectedLocation.type === "atm" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedLocation.type.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-gray-500">{selectedLocation.distance?.toFixed(1)} mi away</span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedLocation.name}</h2>
                  <p className="text-gray-600">
                    {selectedLocation.address}
                    <br />
                    {selectedLocation.city}, {selectedLocation.state} {selectedLocation.zipCode}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => openDirections(selectedLocation)} className="flex-1 bg-red-600 hover:bg-red-700">
                  <Navigation className="w-4 h-4 mr-2" />
                  Directions
                </Button>
                {selectedLocation.phone && (
                  <Button
                    onClick={() => callLocation(selectedLocation.phone!)}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(selectedLocation.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between text-sm">
                  <span className="font-medium">{day}:</span>
                  <span className="text-gray-600">{hours}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Available Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {selectedLocation.services.map((service) => (
                  <div key={service} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features & Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {selectedLocation.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    {getFeatureIcon(feature)}
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Find ATM & Branches</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by address, city, or ZIP code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              onKeyPress={(e) => e.key === "Enter" && searchByAddress()}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={searchByAddress}
              disabled={loadingLocations}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <Search className="w-4 h-4 mr-2" />
              {loadingLocations ? "Searching..." : "Search"}
            </Button>
            <Button
              onClick={() => findLocations(true)}
              disabled={loadingLocations}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Near Me
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="w-4 h-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="atm">ATMs Only</SelectItem>
                    <SelectItem value="branch">Branches Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Radius</label>
                <Select value={selectedRadius} onValueChange={setSelectedRadius}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 miles</SelectItem>
                    <SelectItem value="10">10 miles</SelectItem>
                    <SelectItem value="25">25 miles</SelectItem>
                    <SelectItem value="50">50 miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{filteredLocations.length} locations found</h3>
            {userLocation && <span className="text-sm text-gray-500">Near your location</span>}
          </div>

          {loadingLocations ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Finding locations...</p>
              </CardContent>
            </Card>
          ) : filteredLocations.length > 0 ? (
            <div className="space-y-3">
              {filteredLocations.map((location) => (
                <Card
                  key={location.id}
                  className="border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() => {
                    setSelectedLocation(location)
                    setShowDetails(true)
                  }}
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
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{location.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {location.address}, {location.city}, {location.state}
                        </p>

                        <div className="flex items-center gap-4 mb-2 text-xs text-gray-500">
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

                        {/* Top Features */}
                        <div className="flex flex-wrap gap-1">
                          {location.features.slice(0, 2).map((feature) => (
                            <span
                              key={feature}
                              className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                            >
                              {getFeatureIcon(feature)}
                              {feature}
                            </span>
                          ))}
                          {location.features.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              +{location.features.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50 ml-2 bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation()
                          openDirections(location)
                        }}
                      >
                        <Navigation className="w-3 h-3 mr-1" />
                        Go
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
                <p className="text-gray-600 mb-4">No locations found</p>
                <p className="text-sm text-gray-500 mb-4">
                  Try expanding your search radius or searching a different area
                </p>
                <Button onClick={() => findLocations(false)} className="bg-red-600 hover:bg-red-700">
                  Search All Locations
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
