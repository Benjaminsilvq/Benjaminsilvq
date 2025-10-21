export interface ATMBranch {
  id: string
  type: "atm" | "branch"
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone?: string
  hours: {
    [key: string]: string
  }
  services: string[]
  distance?: number
  coordinates: {
    lat: number
    lng: number
  }
  features: string[]
}

export const atmBranchData: ATMBranch[] = [
  {
    id: "atm_001",
    type: "atm",
    name: "Wells Fargo ATM - Downtown",
    address: "123 Main Street",
    city: "Richmond",
    state: "VA",
    zipCode: "23219",
    hours: {
      "Monday-Sunday": "24 Hours",
    },
    services: ["Cash Withdrawal", "Deposits", "Balance Inquiry", "Mini Statements"],
    coordinates: { lat: 37.5407, lng: -77.436 },
    features: ["Drive-through", "Wheelchair Accessible", "Envelope-free Deposits"],
  },
  {
    id: "branch_001",
    type: "branch",
    name: "Wells Fargo Bank - Virginia Tech Branch",
    address: "1234 University City Blvd",
    city: "Blacksburg",
    state: "VA",
    zipCode: "24060",
    phone: "(540) 555-0123",
    hours: {
      "Monday-Friday": "9:00 AM - 5:00 PM",
      Saturday: "9:00 AM - 1:00 PM",
      Sunday: "Closed",
    },
    services: ["Full Banking Services", "Loans", "Investment Services", "Safe Deposit Boxes"],
    coordinates: { lat: 37.2284, lng: -80.4234 },
    features: ["Drive-through", "ATM", "Notary Services", "Student Banking"],
  },
  {
    id: "atm_002",
    type: "atm",
    name: "Wells Fargo ATM - Shopping Center",
    address: "456 Commerce Drive",
    city: "Virginia Beach",
    state: "VA",
    zipCode: "23454",
    hours: {
      "Monday-Sunday": "24 Hours",
    },
    services: ["Cash Withdrawal", "Deposits", "Balance Inquiry"],
    coordinates: { lat: 36.8529, lng: -75.978 },
    features: ["Indoor Location", "Well-lit Area", "Security Cameras"],
  },
  {
    id: "branch_002",
    type: "branch",
    name: "Wells Fargo Bank - Norfolk Main",
    address: "789 Granby Street",
    city: "Norfolk",
    state: "VA",
    zipCode: "23510",
    phone: "(757) 555-0456",
    hours: {
      "Monday-Friday": "9:00 AM - 6:00 PM",
      Saturday: "9:00 AM - 2:00 PM",
      Sunday: "Closed",
    },
    services: ["Full Banking Services", "Business Banking", "Mortgage Services", "Financial Planning"],
    coordinates: { lat: 36.8468, lng: -76.2852 },
    features: ["Drive-through", "Multiple ATMs", "Business Center", "Parking Available"],
  },
  {
    id: "atm_003",
    type: "atm",
    name: "Wells Fargo ATM - Airport",
    address: "1 Richard E Byrd Terminal Dr",
    city: "Richmond",
    state: "VA",
    zipCode: "23250",
    hours: {
      "Monday-Sunday": "24 Hours",
    },
    services: ["Cash Withdrawal", "Balance Inquiry"],
    coordinates: { lat: 37.5052, lng: -77.3197 },
    features: ["Airport Location", "International Access", "Security Monitored"],
  },
]

export const findNearbyATMsBranches = (userLat: number, userLng: number, radius = 25): ATMBranch[] => {
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3959 // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  return atmBranchData
    .map((location) => ({
      ...location,
      distance: calculateDistance(userLat, userLng, location.coordinates.lat, location.coordinates.lng),
    }))
    .filter((location) => location.distance! <= radius)
    .sort((a, b) => a.distance! - b.distance!)
}
