"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Copy, Eye, EyeOff, Edit, Save, X, CreditCard, Shield, Bell, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-manager" // Import useAuth to get user data

interface AccountInfoDisplayProps {
  onBack: () => void
}

interface AccountInfo {
  accountNumber: string
  routingNumber: string
  accountHolderName: string
  accountType: string
  balance: number
  availableBalance: number
  accountStatus: string
  openDate: string
  lastActivity: string
  interestRate: string
  minimumBalance: number
  monthlyFee: number
  overdraftProtection: boolean
  paperlessStatements: boolean
  mobileDeposit: boolean
  onlineBanking: boolean
  debitCard: {
    cardNumber: string
    expiryDate: string
    status: string
  }
}

export function AccountInfoDisplay({ onBack }: AccountInfoDisplayProps) {
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAccountNumber, setShowAccountNumber] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>({})
  const { toast } = useToast()
  const { user } = useAuth() // Get user data for consistent account info

  useEffect(() => {
    fetchAccountInfo()
  }, [])

  const fetchAccountInfo = async () => {
    try {
      const response = await fetch("/api/account-info?userId=current")
      const data = await response.json()

      const updatedAccountInfo = {
        ...data.accountInfo,
        accountHolderName: user ? `${user.firstName} ${user.lastName}` : data.accountInfo.accountHolderName,
        accountType: user?.accountType || data.accountInfo.accountType,
        balance: user?.balance || data.accountInfo.balance,
        availableBalance: user?.balance || data.accountInfo.availableBalance,
        accountNumber: user?.accountNumber ? `123456${user.accountNumber}` : data.accountInfo.accountNumber,
        debitCard: {
          ...data.accountInfo.debitCard,
          cardNumber: user?.accountNumber
            ? `**** **** **** ${user.accountNumber}`
            : data.accountInfo.debitCard.cardNumber,
        },
      }

      setAccountInfo(updatedAccountInfo)
      setFormData(updatedAccountInfo)
    } catch (error) {
      console.error("Failed to fetch account info:", error)
      toast({
        title: "Error",
        description: "Failed to load account information",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleSave = async (section: string) => {
    try {
      const response = await fetch("/api/account-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data: formData }),
      })

      if (response.ok) {
        setAccountInfo(formData)
        setEditingSection(null)
        toast({
          title: "Success",
          description: "Settings saved successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading account information...</p>
        </div>
      </div>
    )
  }

  if (!accountInfo) return null

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 bg-red-600 text-white">
        <button onClick={onBack} className="text-white hover:text-gray-200">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold">Account Information</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Account Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="w-5 h-5 text-red-600" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Account Holder</Label>
                <p className="font-semibold text-gray-900">{accountInfo.accountHolderName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Account Type</Label>
                <p className="font-semibold text-gray-900">{accountInfo.accountType}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-600">Account Number</Label>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-lg">
                      {showAccountNumber ? accountInfo.accountNumber : `••••••${accountInfo.accountNumber.slice(-4)}`}
                    </p>
                    <button
                      onClick={() => setShowAccountNumber(!showAccountNumber)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showAccountNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(accountInfo.accountNumber, "Account number")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Routing Number</Label>
                  <p className="font-mono text-lg">{accountInfo.routingNumber}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(accountInfo.routingNumber, "Routing number")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Debit Card</Label>
                  <p className="font-mono text-lg">{accountInfo.debitCard.cardNumber}</p>
                  <p className="text-xs text-gray-500 mt-1">Expires: {accountInfo.debitCard.expiryDate}</p>
                </div>
                <div className="text-xs font-semibold text-green-600">{accountInfo.debitCard.status}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <Label className="text-sm font-medium text-gray-600">Current Balance</Label>
                <p className="text-2xl font-bold text-green-600">${accountInfo.balance.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Available Balance</Label>
                <p className="text-xl font-semibold text-gray-900">${accountInfo.availableBalance.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-red-600" />
                Personal Information
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingSection(editingSection === "personal" ? null : "personal")}
              >
                {editingSection === "personal" ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editingSection === "personal" ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.accountHolderName || ""}
                    onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSave("personal")} className="flex-1 bg-red-600 hover:bg-red-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setEditingSection(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                  <p className="font-semibold">{accountInfo.accountHolderName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Account Status</Label>
                  <p className="font-semibold text-green-600">{accountInfo.accountStatus}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Account Opened</Label>
                  <p className="font-semibold">{new Date(accountInfo.openDate).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="w-5 h-5 text-red-600" />
                Notification Settings
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingSection(editingSection === "notifications" ? null : "notifications")}
              >
                {editingSection === "notifications" ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Transaction Alerts</Label>
                  <p className="text-sm text-gray-600">Get notified of all transactions</p>
                </div>
                <Switch
                  checked={formData.transactionAlerts !== false}
                  onCheckedChange={(checked) => {
                    setFormData({ ...formData, transactionAlerts: checked })
                    if (editingSection === "notifications") handleSave("notifications")
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Low Balance Alerts</Label>
                  <p className="text-sm text-gray-600">Alert when balance is low</p>
                </div>
                <Switch
                  checked={formData.lowBalanceAlerts !== false}
                  onCheckedChange={(checked) => {
                    setFormData({ ...formData, lowBalanceAlerts: checked })
                    if (editingSection === "notifications") handleSave("notifications")
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Security Alerts</Label>
                  <p className="text-sm text-gray-600">Important security notifications</p>
                </div>
                <Switch
                  checked={formData.securityAlerts !== false}
                  onCheckedChange={(checked) => {
                    setFormData({ ...formData, securityAlerts: checked })
                    if (editingSection === "notifications") handleSave("notifications")
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lock className="w-5 h-5 text-red-600" />
                Security Settings
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingSection(editingSection === "security" ? null : "security")}
              >
                {editingSection === "security" ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600">Extra security for your account</p>
                </div>
                <Switch
                  checked={formData.twoFactorAuth !== false}
                  onCheckedChange={(checked) => {
                    setFormData({ ...formData, twoFactorAuth: checked })
                    if (editingSection === "security") handleSave("security")
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Overdraft Protection</Label>
                  <p className="text-sm text-gray-600">Prevent overdraft fees</p>
                </div>
                <Switch
                  checked={formData.overdraftProtection}
                  onCheckedChange={(checked) => {
                    setFormData({ ...formData, overdraftProtection: checked })
                    if (editingSection === "security") handleSave("security")
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Paperless Statements</Label>
                  <p className="text-sm text-gray-600">Receive statements electronically</p>
                </div>
                <Switch
                  checked={formData.paperlessStatements}
                  onCheckedChange={(checked) => {
                    setFormData({ ...formData, paperlessStatements: checked })
                    if (editingSection === "security") handleSave("security")
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
