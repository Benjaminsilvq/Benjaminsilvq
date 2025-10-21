"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Send,
  Users,
  Building,
  CreditCard,
  DollarSign,
  Calendar,
  Shield,
  CheckCircle,
  Globe,
  Search,
  Clock,
  AlertCircle,
} from "lucide-react"
import { CURRENCY_DATA, getPopularCurrencies } from "@/lib/currency-data"
import { useEnhancedNotifications } from "@/components/notifications/enhanced-notification-system"

interface PayTransferProps {
  onBack: () => void
  onTransactionComplete: (transaction: any) => void
}

const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
]

const USA_BANKS = [
  { name: "Wells Fargo Bank", routingNumber: "121000248", code: "WF" },
  { name: "Bank of America", routingNumber: "026009593", code: "BOA" },
  { name: "JPMorgan Chase Bank", routingNumber: "021000021", code: "CHASE" },
  { name: "Citibank", routingNumber: "021000089", code: "CITI" },
  { name: "U.S. Bank", routingNumber: "091000022", code: "USB" },
  { name: "PNC Bank", routingNumber: "043000096", code: "PNC" },
  { name: "Capital One Bank", routingNumber: "051405515", code: "COF" },
  { name: "TD Bank", routingNumber: "031201360", code: "TD" },
  { name: "BB&T Bank", routingNumber: "053000196", code: "BBT" },
  { name: "SunTrust Bank", routingNumber: "061000104", code: "STB" },
  { name: "Regions Bank", routingNumber: "062000019", code: "RB" },
  { name: "Fifth Third Bank", routingNumber: "042000314", code: "53B" },
  { name: "KeyBank", routingNumber: "041001039", code: "KEY" },
  { name: "Huntington Bank", routingNumber: "044000024", code: "HB" },
  { name: "M&T Bank", routingNumber: "022000046", code: "MT" },
  { name: "Comerica Bank", routingNumber: "072000096", code: "CMA" },
  { name: "Zions Bank", routingNumber: "124000054", code: "ZB" },
  { name: "First National Bank", routingNumber: "043318092", code: "FNB" },
  { name: "American Express Bank", routingNumber: "124085244", code: "AMEX" },
  { name: "Goldman Sachs Bank", routingNumber: "124071889", code: "GS" },
]

const LOCAL_BANKS = [
  { name: "Virginia Community Bank", routingNumber: "251082817", code: "VCB" },
  { name: "First Citizens Bank", routingNumber: "253177049", code: "FCB" },
  { name: "Atlantic Union Bank", routingNumber: "051404260", code: "AUB" },
  { name: "Carter Bank & Trust", routingNumber: "251082817", code: "CBT" },
  { name: "Virginia Partners Bank", routingNumber: "251082817", code: "VPB" },
  { name: "Blue Ridge Bank", routingNumber: "251082817", code: "BRB" },
  { name: "Pinnacle Bank", routingNumber: "064008637", code: "PB" },
  { name: "Community First Bank", routingNumber: "251082817", code: "CFB" },
  { name: "First Bank & Trust", routingNumber: "251082817", code: "FBT" },
  { name: "Skyline National Bank", routingNumber: "251082817", code: "SNB" },
]

export function PayTransfer({ onBack, onTransactionComplete }: PayTransferProps) {
  const [transferType, setTransferType] = useState<"internal" | "external" | "person" | "bill" | "international">(
    "internal",
  )
  const [formData, setFormData] = useState({
    fromAccount: "checking-6224",
    toAccount: "",
    amount: "",
    memo: "",
    recipient: "",
    routingNumber: "",
    accountNumber: "",
    frequency: "once",
    date: "",
  })
  const [verificationStep, setVerificationStep] = useState<"form" | "otp" | "cot" | "tax" | "complete">("form")
  const [otpCode, setOtpCode] = useState("")
  const [cotCode, setCotCode] = useState("")
  const [taxCode, setTaxCode] = useState("")

  const [selectedBank, setSelectedBank] = useState("")
  const [bankSearch, setBankSearch] = useState("")
  const [showBankDropdown, setShowBankDropdown] = useState(false)
  const [accountValidation, setAccountValidation] = useState({
    valid: false,
    message: "",
    accountHolderName: "", // Added account holder name to state
    bankName: "",
    accountType: "",
  })
  const [isValidatingAccount, setIsValidatingAccount] = useState(false)

  const [internationalInfo, setInternationalInfo] = useState({
    swiftCode: "",
    iban: "",
    recipientAddress: "",
    bankAddress: "",
    purposeOfTransfer: "",
    country: "",
    currency: "USD",
    bankName: "",
    recipientName: "",
    recipientPhone: "",
    recipientEmail: "",
    intermediaryBank: "",
    correspondentBank: "",
  })

  const [countrySearch, setCountrySearch] = useState("")
  const [currencySearch, setCurrencySearch] = useState("")
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)

  const { createTransactionAlert, addNotification } = useEnhancedNotifications()

  const allBanks = [...USA_BANKS, ...LOCAL_BANKS]
  const filteredBanks = allBanks.filter(
    (bank) =>
      bank.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
      bank.code.toLowerCase().includes(bankSearch.toLowerCase()),
  )

  const filteredCountries = COUNTRIES.filter((country) => country.toLowerCase().includes(countrySearch.toLowerCase()))

  const filteredCurrencies = CURRENCY_DATA.filter(
    (currency) =>
      currency.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
      currency.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
      currency.country.toLowerCase().includes(currencySearch.toLowerCase()),
  )

  const popularCurrencies = getPopularCurrencies()

  const validateAccount = async (accountNumber: string, routingNumber: string) => {
    if (!accountNumber || !routingNumber) return

    setIsValidatingAccount(true)
    try {
      const response = await fetch("/api/validate-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_number: accountNumber,
          routing_number: routingNumber,
        }),
      })

      const result = await response.json()
      setAccountValidation({
        valid: result.valid,
        message: result.valid ? "Account verified successfully" : result.message || "Invalid account details",
        accountHolderName: result.account_holder_name || "",
        bankName: result.bank_name || "",
        accountType: result.account_type || "",
      })
    } catch (error) {
      setAccountValidation({
        valid: false,
        message: "Unable to verify account at this time",
        accountHolderName: "",
        bankName: "",
        accountType: "",
      })
    } finally {
      setIsValidatingAccount(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === "accountNumber" || field === "routingNumber") {
      const updatedData = { ...formData, [field]: value }
      if (updatedData.accountNumber && updatedData.routingNumber) {
        validateAccount(updatedData.accountNumber, updatedData.routingNumber)
      }
    }
  }

  const handleInternationalInputChange = (field: string, value: string) => {
    setInternationalInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleBankSelect = (bank: (typeof USA_BANKS)[0]) => {
    setSelectedBank(bank.name)
    setBankSearch(bank.name)
    setFormData((prev) => ({ ...prev, routingNumber: bank.routingNumber }))
    setShowBankDropdown(false)

    // Auto-validate if account number exists
    if (formData.accountNumber) {
      validateAccount(formData.accountNumber, bank.routingNumber)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (transferType === "external" && !accountValidation.valid) {
      alert("Please ensure the account details are valid before proceeding.")
      return
    }

    if (transferType === "international") {
      try {
        const response = await fetch("/api/wire-transfer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: formData.amount,
            fromAccount: formData.fromAccount,
            recipientName: internationalInfo.recipientName,
            recipientAddress: internationalInfo.recipientAddress,
            recipientPhone: internationalInfo.recipientPhone,
            recipientEmail: internationalInfo.recipientEmail,
            bankName: internationalInfo.bankName,
            swiftCode: internationalInfo.swiftCode,
            iban: internationalInfo.iban,
            bankAddress: internationalInfo.bankAddress,
            country: internationalInfo.country,
            currency: internationalInfo.currency,
            purposeOfTransfer: internationalInfo.purposeOfTransfer,
            intermediaryBank: internationalInfo.intermediaryBank,
            correspondentBank: internationalInfo.correspondentBank,
            accountNumber: formData.accountNumber,
            memo: formData.memo,
          }),
        })

        const result = await response.json()

        if (result.success) {
          const transaction = {
            id: result.wireTransfer.id,
            type: "completed" as const,
            description: `International Wire Transfer to ${internationalInfo.recipientName}`,
            amount: -Number.parseFloat(formData.amount),
            date: new Date().toLocaleDateString(),
            category: "transfer" as const,
            confirmationNumber: result.wireTransfer.confirmationNumber,
            fromAccount: "EVERYDAY CHECKING ...6224",
            toAccount: internationalInfo.recipientName,
            fee: 45.0,
          }

          createTransactionAlert(
            "debit",
            Number.parseFloat(formData.amount) + 45.0,
            `International Wire to ${internationalInfo.recipientName}`,
            "EVERYDAY CHECKING ...6224",
          )

          onTransactionComplete(transaction)
          alert(
            `International wire transfer of $${formData.amount} initiated successfully!\nConfirmation: ${result.wireTransfer.confirmationNumber}\nReference: ${result.wireTransfer.referenceNumber}\nExpected completion: ${result.wireTransfer.processingTime}`,
          )
          return
        }
      } catch (error) {
        console.error("Wire transfer error:", error)
        alert("Failed to process international wire transfer. Please try again.")
        return
      }
    }

    if (
      (transferType === "external" || transferType === "international") &&
      Number.parseFloat(formData.amount) > 1000
    ) {
      addNotification({
        type: "security",
        title: "Security Verification Required",
        message: `Large transfer of $${formData.amount} requires OTP verification`,
        priority: "high",
        category: "Security Alert",
        actionRequired: true,
      })

      setVerificationStep("otp")
      return
    }

    const transaction = {
      id: `TXN${Date.now()}`,
      type: "completed" as const,
      description: `${transferType === "international" ? "International Wire Transfer" : "Transfer"} to ${formData.recipient || selectedBank || formData.toAccount}`,
      amount: -Number.parseFloat(formData.amount),
      date: new Date().toLocaleDateString(),
      category: "transfer" as const,
      confirmationNumber: `CF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      fromAccount: "EVERYDAY CHECKING ...6224",
      toAccount: formData.toAccount || formData.recipient || selectedBank,
      fee: transferType === "international" ? 45.0 : transferType === "external" ? 3.0 : 0,
    }

    const totalAmount = Number.parseFloat(formData.amount) + transaction.fee
    createTransactionAlert(
      "debit",
      totalAmount,
      formData.recipient || selectedBank || formData.toAccount,
      "EVERYDAY CHECKING ...6224",
    )

    onTransactionComplete(transaction)
    alert(`Transfer of $${formData.amount} completed successfully! Confirmation: ${transaction.confirmationNumber}`)
  }

  const handleOtpSubmit = () => {
    if (otpCode === "0709") {
      addNotification({
        type: "security",
        title: "OTP Verified Successfully",
        message: "Your identity has been verified. Proceeding with transfer.",
        priority: "medium",
        category: "Security Alert",
      })

      setVerificationStep("cot")
    } else {
      addNotification({
        type: "security",
        title: "Invalid OTP Code",
        message: "The OTP code you entered is incorrect. Please contact customer service.",
        priority: "high",
        category: "Security Alert",
        actionRequired: true,
      })

      alert("Invalid OTP code. Please contact customer service.")
    }
  }

  const handleCotSubmit = () => {
    if (cotCode === "ABCD-1234-EFGH-5678") {
      setVerificationStep("tax")
    } else {
      alert("Invalid COT code. Please try again.")
    }
  }

  const handleTaxSubmit = () => {
    if (taxCode.length > 0) {
      setVerificationStep("complete")
      // Complete the transaction
      const transaction = {
        id: `TXN${Date.now()}`,
        type: "completed" as const,
        description: `International Wire Transfer to ${formData.recipient}`,
        amount: -Number.parseFloat(formData.amount),
        date: new Date().toLocaleDateString(),
        category: "transfer" as const,
        confirmationNumber: `WF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        fromAccount: "EVERYDAY CHECKING ...6224",
        toAccount: formData.recipient,
        fee: 45.0,
      }

      createTransactionAlert(
        "debit",
        Number.parseFloat(formData.amount) + 45.0,
        `International Wire to ${formData.recipient}`,
        "EVERYDAY CHECKING ...6224",
      )

      onTransactionComplete(transaction)
    } else {
      alert("Please enter tax clearance information.")
    }
  }

  if (verificationStep === "otp") {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
          <button onClick={() => setVerificationStep("form")} className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Verification Required</h1>
        </div>

        <div className="p-4 space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Security Verification</h3>
              <p className="text-gray-600 mb-4">
                For your security, we need to verify this large transfer. Please contact customer service to receive
                your OTP code.
              </p>

              <div className="bg-red-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-medium text-red-800">Customer Service</p>
                <a href="mailto:fargocustomer_248@zohomail.com" className="text-red-600 underline">
                  fargocustomer_248@zohomail.com
                </a>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="otp">Enter OTP Code</Label>
                  <Input
                    id="otp"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 4-digit code"
                    className="text-center text-lg"
                    maxLength={4}
                  />
                </div>

                <Button
                  onClick={handleOtpSubmit}
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={otpCode.length !== 4}
                >
                  Verify OTP
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (verificationStep === "cot") {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
          <button onClick={() => setVerificationStep("otp")} className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">COT Verification</h1>
        </div>

        <div className="p-4 space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Confirmation of Transfer (COT)</h3>
              <p className="text-gray-600 mb-4">Please enter the COT code to confirm this international transfer.</p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="cot">COT Code</Label>
                  <Input
                    id="cot"
                    value={cotCode}
                    onChange={(e) => setCotCode(e.target.value)}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    className="text-center"
                  />
                </div>

                <Button
                  onClick={handleCotSubmit}
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={cotCode.length === 0}
                >
                  Verify COT Code
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (verificationStep === "tax") {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
          <button onClick={() => setVerificationStep("cot")} className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Tax Clearance</h1>
        </div>

        <div className="p-4 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tax Clearance Information</h3>
              <p className="text-gray-600 mb-4">
                For international transfers, please provide tax clearance information.
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="tax">Tax Clearance Code/Reference</Label>
                  <Input
                    id="tax"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    placeholder="Enter tax clearance information"
                  />
                </div>

                <Button
                  onClick={handleTaxSubmit}
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={taxCode.length === 0}
                >
                  Complete Transfer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (verificationStep === "complete") {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="p-4 space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Transfer Complete!</h3>
              <p className="text-gray-600 mb-4">Your international wire transfer has been successfully processed.</p>

              <Button onClick={onBack} className="w-full bg-red-600 hover:bg-red-700">
                Return to Banking
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Full Desktop Header */}
      <div className="bg-[#721216] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-white hover:text-[#f7ba77] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Overview</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#dc242c] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">WF</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold">
                    {transferType === "international" ? "International Wire Transfer" : "Pay & Transfer"}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-[#f7ba77]">
                    {transferType === "international" ? (
                      <>
                        <Globe className="w-4 h-4" />
                        <span>Send to 200+ Countries & Territories</span>
                      </>
                    ) : (
                      <span>Send money securely</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">Johnny Mercer</div>
              <div className="text-xs text-[#f7ba77]">EVERYDAY CHECKING ...6224</div>
              <div className="text-xs text-[#f7ba77]">Routing: 121000248</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Transfer Type Selection */}
        <Card className="mb-6 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#721216] text-xl">Select Transfer Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <button
                onClick={() => setTransferType("internal")}
                className={`p-4 rounded-lg border-2 text-left transition-all transform hover:scale-105 ${
                  transferType === "internal"
                    ? "border-[#dc242c] bg-[#dc242c] bg-opacity-10 text-[#dc242c]"
                    : "border-gray-200 hover:border-[#dc242c]"
                }`}
              >
                <CreditCard className="w-6 h-6 mb-2" />
                <p className="font-medium">Between My Accounts</p>
              </button>
              <button
                onClick={() => setTransferType("external")}
                className={`p-4 rounded-lg border-2 text-left transition-all transform hover:scale-105 ${
                  transferType === "external"
                    ? "border-[#dc242c] bg-[#dc242c] bg-opacity-10 text-[#dc242c]"
                    : "border-gray-200 hover:border-[#dc242c]"
                }`}
              >
                <Building className="w-6 h-6 mb-2" />
                <p className="font-medium">To External Bank</p>
              </button>
              <button
                onClick={() => setTransferType("international")}
                className={`p-4 rounded-lg border-2 text-left transition-all transform hover:scale-105 ${
                  transferType === "international"
                    ? "border-[#dc242c] bg-[#dc242c] bg-opacity-10 text-[#dc242c]"
                    : "border-gray-200 hover:border-[#dc242c]"
                }`}
              >
                <Globe className="w-6 h-6 mb-2" />
                <p className="font-medium">International Wire</p>
                <p className="text-xs text-gray-500">200+ Countries</p>
              </button>
              <button
                onClick={() => setTransferType("person")}
                className={`p-4 rounded-lg border-2 text-left transition-all transform hover:scale-105 ${
                  transferType === "person"
                    ? "border-[#dc242c] bg-[#dc242c] bg-opacity-10 text-[#dc242c]"
                    : "border-gray-200 hover:border-[#dc242c]"
                }`}
              >
                <Users className="w-6 h-6 mb-2" />
                <p className="font-medium">To Person</p>
              </button>
              <button
                onClick={() => setTransferType("bill")}
                className={`p-4 rounded-lg border-2 text-left transition-all transform hover:scale-105 ${
                  transferType === "bill"
                    ? "border-[#dc242c] bg-[#dc242c] bg-opacity-10 text-[#dc242c]"
                    : "border-gray-200 hover:border-[#dc242c]"
                }`}
              >
                <Send className="w-6 h-6 mb-2" />
                <p className="font-medium">Pay Bills</p>
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transfer Form */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#721216]">
                {transferType === "international" ? "International Wire Transfer" : "Transfer Details"}
              </CardTitle>
              <div className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900 mb-1">Account Holder: Johnny Mercer</div>
                <div className="flex justify-between text-xs">
                  <span>Account: EVERYDAY CHECKING ...6224</span>
                  <span>Routing: 121000248</span>
                </div>
                <div className="text-xs mt-1">Available Balance: $36,000.00</div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* From Account */}
                <div className="space-y-2">
                  <Label htmlFor="fromAccount">From Account</Label>
                  <Select
                    value={formData.fromAccount}
                    onValueChange={(value) => handleInputChange("fromAccount", value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking-6224">EVERYDAY CHECKING ...6224 - $36,000.00</SelectItem>
                      <SelectItem value="savings-1234">WAY2SAVE SAVINGS ...8847 - $25,250.00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* International Transfer Fields */}
                {transferType === "international" && (
                  <>
                    {/* Country Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="country">Destination Country</Label>
                      <div className="relative">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            placeholder="Search countries..."
                            value={countrySearch}
                            onChange={(e) => {
                              setCountrySearch(e.target.value)
                              setShowCountryDropdown(true)
                            }}
                            onFocus={() => setShowCountryDropdown(true)}
                            className="pl-10 h-12"
                          />
                        </div>
                        {showCountryDropdown && (
                          <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                            {filteredCountries.map((country) => (
                              <button
                                key={country}
                                type="button"
                                onClick={() => {
                                  handleInternationalInputChange("country", country)
                                  setCountrySearch(country)
                                  setShowCountryDropdown(false)
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-[#f7ba77] hover:bg-opacity-20 transition-colors"
                              >
                                {country}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Currency Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <div className="relative">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            placeholder="Search currencies..."
                            value={currencySearch}
                            onChange={(e) => {
                              setCurrencySearch(e.target.value)
                              setShowCurrencyDropdown(true)
                            }}
                            onFocus={() => setShowCurrencyDropdown(true)}
                            className="pl-10 h-12"
                          />
                        </div>
                        {showCurrencyDropdown && (
                          <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                            {currencySearch === "" && (
                              <>
                                <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700 border-b">
                                  Popular Currencies
                                </div>
                                {popularCurrencies.map((currency) => (
                                  <button
                                    key={`popular-${currency.code}`}
                                    type="button"
                                    onClick={() => {
                                      handleInternationalInputChange("currency", currency.code)
                                      setCurrencySearch(`${currency.flag} ${currency.code} - ${currency.name}`)
                                      setShowCurrencyDropdown(false)
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-[#f7ba77] hover:bg-opacity-20 transition-colors border-b border-gray-100"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <span className="text-xl">{currency.flag}</span>
                                        <div>
                                          <span className="font-medium">
                                            {currency.code} - {currency.name}
                                          </span>
                                          <div className="text-sm text-gray-500">{currency.country}</div>
                                        </div>
                                      </div>
                                      <span className="text-gray-500 font-mono">{currency.symbol}</span>
                                    </div>
                                  </button>
                                ))}
                                <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700 border-b border-t">
                                  All Currencies
                                </div>
                              </>
                            )}
                            {filteredCurrencies.map((currency) => (
                              <button
                                key={currency.code}
                                type="button"
                                onClick={() => {
                                  handleInternationalInputChange("currency", currency.code)
                                  setCurrencySearch(`${currency.flag} ${currency.code} - ${currency.name}`)
                                  setShowCurrencyDropdown(false)
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-[#f7ba77] hover:bg-opacity-20 transition-colors border-b border-gray-100"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="text-xl">{currency.flag}</span>
                                    <div>
                                      <span className="font-medium">
                                        {currency.code} - {currency.name}
                                      </span>
                                      <div className="text-sm text-gray-500">{currency.country}</div>
                                    </div>
                                  </div>
                                  <span className="text-gray-500 font-mono">{currency.symbol}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recipient Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipientName">Recipient Full Name</Label>
                        <Input
                          id="recipientName"
                          value={internationalInfo.recipientName}
                          onChange={(e) => handleInternationalInputChange("recipientName", e.target.value)}
                          className="h-12"
                          placeholder="Full legal name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="recipientPhone">Recipient Phone</Label>
                        <Input
                          id="recipientPhone"
                          value={internationalInfo.recipientPhone}
                          onChange={(e) => handleInternationalInputChange("recipientPhone", e.target.value)}
                          className="h-12"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recipientAddress">Recipient Address</Label>
                      <Input
                        id="recipientAddress"
                        value={internationalInfo.recipientAddress}
                        onChange={(e) => handleInternationalInputChange("recipientAddress", e.target.value)}
                        className="h-12"
                        placeholder="Full address including postal code"
                        required
                      />
                    </div>

                    {/* Bank Information */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Recipient Bank Name</Label>
                        <Input
                          id="bankName"
                          value={internationalInfo.bankName}
                          onChange={(e) => handleInternationalInputChange("bankName", e.target.value)}
                          className="h-12"
                          placeholder="Full bank name"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="swift">SWIFT/BIC Code</Label>
                          <Input
                            id="swift"
                            value={internationalInfo.swiftCode}
                            onChange={(e) => handleInternationalInputChange("swiftCode", e.target.value)}
                            className="h-12"
                            placeholder="e.g., WFBIUS6S"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="iban">IBAN (if applicable)</Label>
                          <Input
                            id="iban"
                            value={internationalInfo.iban}
                            onChange={(e) => handleInternationalInputChange("iban", e.target.value)}
                            className="h-12"
                            placeholder="e.g., GB29 NWBK 6016 1331 9268 19"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Recipient Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={formData.accountNumber}
                          onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                          className="h-12"
                          placeholder="Account number"
                          required
                        />
                      </div>
                    </div>

                    {/* Purpose of Transfer */}
                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose of Transfer</Label>
                      <Select
                        value={internationalInfo.purposeOfTransfer}
                        onValueChange={(value) => handleInternationalInputChange("purposeOfTransfer", value)}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="family-support">Family Support</SelectItem>
                          <SelectItem value="business">Business Transaction</SelectItem>
                          <SelectItem value="education">Education Expenses</SelectItem>
                          <SelectItem value="investment">Investment</SelectItem>
                          <SelectItem value="property">Property Purchase</SelectItem>
                          <SelectItem value="medical">Medical Expenses</SelectItem>
                          <SelectItem value="travel">Travel Expenses</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* External Transfer Fields */}
                {transferType === "external" && (
                  <div className="space-y-4">
                    {/* Bank Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="bankSelect">Select Bank</Label>
                      <div className="relative">
                        <Input
                          id="bankSelect"
                          value={bankSearch}
                          onChange={(e) => {
                            setBankSearch(e.target.value)
                            setShowBankDropdown(true)
                          }}
                          onFocus={() => setShowBankDropdown(true)}
                          className="h-12"
                          placeholder="Search for a bank..."
                        />
                        {showBankDropdown && (
                          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                            <div className="p-2 border-b border-gray-100 bg-[#721216] text-white">
                              <h4 className="font-medium text-sm">USA Banks & Local Banks</h4>
                            </div>
                            {filteredBanks.map((bank) => (
                              <button
                                key={bank.code}
                                onClick={() => handleBankSelect(bank)}
                                className="w-full text-left p-3 hover:bg-[#f7ba77] hover:bg-opacity-20 border-b border-gray-50 last:border-b-0"
                              >
                                <div className="font-medium text-[#721216]">{bank.name}</div>
                                <div className="text-sm text-[#5b5957]">Routing: {bank.routingNumber}</div>
                              </button>
                            ))}
                            {filteredBanks.length === 0 && (
                              <div className="p-4 text-center text-gray-500">No banks found</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Account Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="routingNumber">Routing Number</Label>
                        <Input
                          id="routingNumber"
                          value={formData.routingNumber}
                          onChange={(e) => handleInputChange("routingNumber", e.target.value)}
                          className="h-12"
                          placeholder="9-digit routing number"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={formData.accountNumber}
                          onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                          className="h-12"
                          placeholder="Account number"
                          required
                        />
                      </div>
                    </div>

                    {/* Account Validation Status */}
                    {formData.accountNumber && formData.routingNumber && (
                      <div
                        className={`p-3 rounded-lg border ${
                          isValidatingAccount
                            ? "border-yellow-200 bg-yellow-50"
                            : accountValidation.valid
                              ? "border-green-200 bg-green-50"
                              : "border-red-200 bg-red-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isValidatingAccount ? (
                            <>
                              <Clock className="w-4 h-4 text-yellow-600" />
                              <span className="text-sm text-yellow-700">Validating account...</span>
                            </>
                          ) : accountValidation.valid ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <div className="text-sm text-green-700">
                                <div className="font-semibold">{accountValidation.message}</div>
                                <div className="mt-1">
                                  <strong>Account Holder:</strong> {accountValidation.accountHolderName}
                                </div>
                                <div>
                                  <strong>Bank:</strong> {accountValidation.bankName}
                                </div>
                                <div>
                                  <strong>Account Type:</strong> {accountValidation.accountType}
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-red-600" />
                              <span className="text-sm text-red-700">{accountValidation.message}</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="recipient">Recipient Name</Label>
                      <Input
                        id="recipient"
                        value={formData.recipient}
                        onChange={(e) => handleInputChange("recipient", e.target.value)}
                        className="h-12"
                        placeholder="Full name of recipient"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      className="pl-10 h-12 text-lg"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  {transferType === "international" && (
                    <p className="text-xs text-gray-500">International wire transfer fee: $45.00</p>
                  )}
                  {transferType === "external" && <p className="text-xs text-gray-500">External transfer fee: $3.00</p>}
                </div>

                {/* Memo */}
                <div className="space-y-2">
                  <Label htmlFor="memo">Memo (Optional)</Label>
                  <Input
                    id="memo"
                    value={formData.memo}
                    onChange={(e) => handleInputChange("memo", e.target.value)}
                    className="h-12"
                    placeholder="What's this for?"
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">Transfer Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      className="pl-10 h-12"
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 bg-[#dc242c] hover:bg-[#721216] text-white font-semibold">
                  <Send className="w-5 h-5 mr-2" />
                  {transferType === "international" ? "Send International Wire" : "Send Transfer"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Transfer Summary */}
          {formData.amount && (
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#721216]">Transfer Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transfer Amount:</span>
                    <span className="font-medium">${formData.amount}</span>
                  </div>
                  {transferType === "international" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Wire Transfer Fee:</span>
                        <span className="font-medium">$45.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Destination:</span>
                        <span className="font-medium">{internationalInfo.country || "Select Country"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Currency:</span>
                        <span className="font-medium">{internationalInfo.currency}</span>
                      </div>
                    </>
                  )}
                  {transferType === "external" && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transfer Fee:</span>
                      <span className="font-medium">$3.00</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold border-t pt-3">
                    <span>Total:</span>
                    <span>
                      $
                      {(
                        Number.parseFloat(formData.amount) +
                        (transferType === "international" ? 45 : transferType === "external" ? 3 : 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                {transferType === "international" && (
                  <div className="bg-[#f7ba77] bg-opacity-10 border border-[#f7ba77] rounded-lg p-4 mt-4">
                    <h4 className="font-semibold text-[#721216] mb-2">International Wire Information</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Processing Time:</strong> 1-5 business days
                      </p>
                      <p>
                        <strong>Cut-off Time:</strong> 3:00 PM ET for same-day processing
                      </p>
                      <p>
                        <strong>Exchange Rate:</strong> Current market rate + margin
                      </p>
                      <p>
                        <strong>Tracking:</strong> Reference number provided upon completion
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
