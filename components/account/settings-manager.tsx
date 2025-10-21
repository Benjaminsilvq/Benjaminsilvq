"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, User, Bell, Shield, Lock, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-manager"

interface SettingsManagerProps {
  onBack: () => void
}

interface Settings {
  personal: {
    fullName: string
    email: string
    phone: string
    address: string
    dateOfBirth: string
    ssn: string
  }
  notifications: {
    transactionAlerts: boolean
    lowBalanceAlerts: boolean
    securityAlerts: boolean
    marketingEmails: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    emailStatements: boolean
    creditAlerts: boolean
    debitAlerts: boolean
    depositAlerts: boolean
    withdrawalAlerts: boolean
  }
  security: {
    twoFactorAuth: boolean
    biometricLogin: boolean
    sessionTimeout: number
    loginNotifications: boolean
    deviceTrust: boolean
    autoLock: boolean
  }
  privacy: {
    dataSharing: boolean
    marketingOptIn: boolean
    analyticsOptIn: boolean
    locationTracking: boolean
    cookiePreferences: string
    profileVisibility: string
    transactionHistory: string
  }
}

export function SettingsManager({ onBack }: SettingsManagerProps) {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("personal")
  const [showSSN, setShowSSN] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings?userId=current")
      const data = await response.json()

      const populatedSettings = {
        ...data.settings,
        personal: {
          ...data.settings.personal,
          fullName: user ? `${user.firstName} ${user.lastName}` : data.settings.personal.fullName,
          email: user?.email || data.settings.personal.email,
          phone: user?.phone || data.settings.personal.phone,
        },
      }

      setSettings(populatedSettings)
    } catch (error) {
      console.error("Failed to fetch settings:", error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (section: string, newData: any) => {
    setSaving(section)
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data: newData }),
      })

      if (response.ok) {
        setSettings((prev) => (prev ? { ...prev, [section]: newData } : null))
        toast({
          title: "Success",
          description: `${section} settings saved successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(null)
    }
  }

  const handlePersonalChange = (field: string, value: string) => {
    if (!settings) return
    const newPersonal = { ...settings.personal, [field]: value }
    setSettings({ ...settings, personal: newPersonal })
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    if (!settings) return
    const newNotifications = { ...settings.notifications, [field]: value }
    setSettings({ ...settings, notifications: newNotifications })
    updateSettings("notifications", newNotifications)
  }

  const handleSecurityChange = (field: string, value: boolean | number) => {
    if (!settings) return
    const newSecurity = { ...settings.security, [field]: value }
    setSettings({ ...settings, security: newSecurity })
    updateSettings("security", newSecurity)
  }

  const handlePrivacyChange = (field: string, value: boolean | string) => {
    if (!settings) return
    const newPrivacy = { ...settings.privacy, [field]: value }
    setSettings({ ...settings, privacy: newPrivacy })
    updateSettings("privacy", newPrivacy)
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!settings) return null

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 bg-red-600 text-white">
        <button onClick={onBack} className="text-white hover:text-gray-200">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white overflow-x-auto">
        {[
          { id: "personal", label: "Personal", icon: User },
          { id: "notifications", label: "Alerts", icon: Bell },
          { id: "security", label: "Security", icon: Shield },
          { id: "privacy", label: "Privacy", icon: Lock },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === id ? "border-red-600 text-red-600" : "border-transparent text-gray-600"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Personal Information Tab */}
        {activeTab === "personal" && (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={settings.personal.fullName}
                  onChange={(e) => handlePersonalChange("fullName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.personal.email}
                  onChange={(e) => handlePersonalChange("email", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={settings.personal.phone}
                  onChange={(e) => handlePersonalChange("phone", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={settings.personal.address}
                  onChange={(e) => handlePersonalChange("address", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="ssn">Social Security Number</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="ssn"
                    type={showSSN ? "text" : "password"}
                    value={settings.personal.ssn}
                    onChange={(e) => handlePersonalChange("ssn", e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={() => setShowSSN(!showSSN)}>
                    {showSSN ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => updateSettings("personal", settings.personal)}
                disabled={saving === "personal"}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {saving === "personal" ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Personal Information
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "creditAlerts", label: "Credit Alerts", desc: "When money is added to your account" },
                  { key: "debitAlerts", label: "Debit Alerts", desc: "When money is withdrawn from your account" },
                  { key: "depositAlerts", label: "Deposit Alerts", desc: "When deposits are processed" },
                  { key: "withdrawalAlerts", label: "Withdrawal Alerts", desc: "When withdrawals are made" },
                  { key: "lowBalanceAlerts", label: "Low Balance Alerts", desc: "When your balance is low" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">{label}</Label>
                      <p className="text-sm text-gray-600">{desc}</p>
                    </div>
                    <Switch
                      checked={settings.notifications[key as keyof typeof settings.notifications] as boolean}
                      onCheckedChange={(checked) => handleNotificationChange(key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>General Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "securityAlerts", label: "Security Alerts", desc: "Important security notifications" },
                  { key: "smsNotifications", label: "SMS Notifications", desc: "Text message alerts" },
                  { key: "pushNotifications", label: "Push Notifications", desc: "Mobile app notifications" },
                  { key: "emailStatements", label: "Email Statements", desc: "Monthly statements via email" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">{label}</Label>
                      <p className="text-sm text-gray-600">{desc}</p>
                    </div>
                    <Switch
                      checked={settings.notifications[key as keyof typeof settings.notifications] as boolean}
                      onCheckedChange={(checked) => handleNotificationChange(key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "twoFactorAuth", label: "Two-Factor Authentication", desc: "Extra security for your account" },
                { key: "biometricLogin", label: "Biometric Login", desc: "Use fingerprint or face recognition" },
                { key: "loginNotifications", label: "Login Notifications", desc: "Alert when someone logs in" },
                { key: "deviceTrust", label: "Device Trust", desc: "Remember trusted devices" },
                { key: "autoLock", label: "Auto Lock", desc: "Automatically lock after inactivity" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">{label}</Label>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                  <Switch
                    checked={settings.security[key as keyof typeof settings.security] as boolean}
                    onCheckedChange={(checked) => handleSecurityChange(key, checked)}
                  />
                </div>
              ))}

              <div>
                <Label className="font-medium">Session Timeout (minutes)</Label>
                <Select
                  value={settings.security.sessionTimeout.toString()}
                  onValueChange={(value) => handleSecurityChange("sessionTimeout", Number.parseInt(value))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Privacy Tab */}
        {activeTab === "privacy" && (
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "dataSharing", label: "Data Sharing", desc: "Share data with third parties" },
                { key: "marketingOptIn", label: "Marketing Communications", desc: "Receive marketing emails" },
                { key: "analyticsOptIn", label: "Analytics", desc: "Help improve our services" },
                { key: "locationTracking", label: "Location Tracking", desc: "Use location for services" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">{label}</Label>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                  <Switch
                    checked={settings.privacy[key as keyof typeof settings.privacy] as boolean}
                    onCheckedChange={(checked) => handlePrivacyChange(key, checked)}
                  />
                </div>
              ))}

              <div>
                <Label className="font-medium">Cookie Preferences</Label>
                <Select
                  value={settings.privacy.cookiePreferences}
                  onValueChange={(value) => handlePrivacyChange("cookiePreferences", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="essential">Essential Only</SelectItem>
                    <SelectItem value="functional">Functional</SelectItem>
                    <SelectItem value="all">All Cookies</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="font-medium">Profile Visibility</Label>
                <Select
                  value={settings.privacy.profileVisibility}
                  onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="limited">Limited</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
