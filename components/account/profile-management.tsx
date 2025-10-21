"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Fingerprint,
} from "lucide-react"
import { useAuth } from "@/components/auth/auth-manager"

interface ProfileManagementProps {
  onBack: () => void
}

export function ProfileManagement({ onBack }: ProfileManagementProps) {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    password: "", // New password field
    phone: user?.phone || "(555) 123-4567",
    address: "123 Main Street",
    city: "Blacksburg",
    state: "VA",
    zipCode: "24060",
    currency: "USD",
    language: "English",
    timezone: "EST",
    dateFormat: "MM/DD/YYYY",
    notifications: {
      email: true,
      sms: true,
      push: true,
      marketing: false,
      security: true,
      transactions: true,
      statements: true,
    },
    security: {
      twoFactor: true,
      biometric: false,
      loginAlerts: true,
      deviceTracking: true,
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      personalization: true,
    },
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setProfileImage(imageData)
        updateUser({ profileImage: imageData })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSave = () => {
    const updates: any = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      profileImage: profileImage,
    }

    if (formData.password) {
      updates.password = formData.password
    }

    updateUser(updates)
    setIsEditing(false)
    alert("Profile updated successfully! New credentials are now active for login.")
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Profile & Settings</h1>
        <div className="ml-auto">
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(false)} className="text-gray-600 hover:text-gray-800">
                <X className="h-5 w-5" />
              </button>
              <button onClick={handleSave} className="text-red-600 hover:text-red-700">
                <Save className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="text-red-600 hover:text-red-700">
              <Edit className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-red-100">
                  {profileImage ? (
                    <img
                      src={profileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 shadow-lg ring-2 ring-white">
                    <Camera className="w-4 h-4 text-white" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-sm text-gray-600">Account Holder</p>
                <p className="text-xs text-red-600">Customer since 2019</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  disabled={!isEditing}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  disabled={!isEditing}
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                  className="pl-10 h-10"
                />
              </div>
              {isEditing && <p className="text-xs text-red-600">This will become your new login email</p>}
            </div>

            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter new password (optional)"
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Leave blank to keep current password</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!isEditing}
                  className="pl-10 h-10"
                />
              </div>
              {isEditing && <p className="text-xs text-red-600">Updated phone number will be saved</p>}
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  disabled={!isEditing}
                  className="pl-10 h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                disabled={!isEditing}
                className="h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => handleInputChange("state", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AL">Alabama</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="VA">Virginia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  disabled={!isEditing}
                  className="h-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Preferences & Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleInputChange("currency", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                    <SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => handleInputChange("timezone", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EST">EST - Eastern</SelectItem>
                    <SelectItem value="CST">CST - Central</SelectItem>
                    <SelectItem value="MST">MST - Mountain</SelectItem>
                    <SelectItem value="PST">PST - Pacific</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => handleInputChange("language", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Español</SelectItem>
                    <SelectItem value="French">Français</SelectItem>
                    <SelectItem value="German">Deutsch</SelectItem>
                    <SelectItem value="Chinese">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select
                  value={formData.dateFormat}
                  onValueChange={(value) => handleInputChange("dateFormat", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <Switch
                  checked={formData.notifications.email}
                  onCheckedChange={(checked) => handleInputChange("notifications.email", checked)}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-600">Text message alerts</p>
                </div>
                <Switch
                  checked={formData.notifications.sms}
                  onCheckedChange={(checked) => handleInputChange("notifications.sms", checked)}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-600">Mobile app notifications</p>
                </div>
                <Switch
                  checked={formData.notifications.push}
                  onCheckedChange={(checked) => handleInputChange("notifications.push", checked)}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Transaction Alerts</p>
                  <p className="text-sm text-gray-600">Instant transaction notifications</p>
                </div>
                <Switch
                  checked={formData.notifications.transactions}
                  onCheckedChange={(checked) => handleInputChange("notifications.transactions", checked)}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Statement Notifications</p>
                  <p className="text-sm text-gray-600">Monthly statement alerts</p>
                </div>
                <Switch
                  checked={formData.notifications.statements}
                  onCheckedChange={(checked) => handleInputChange("notifications.statements", checked)}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Security Alerts</p>
                  <p className="text-sm text-gray-600">Login and security notifications</p>
                </div>
                <Switch
                  checked={formData.notifications.security}
                  onCheckedChange={(checked) => handleInputChange("notifications.security", checked)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Extra security for your account</p>
                </div>
                <Switch
                  checked={formData.security.twoFactor}
                  onCheckedChange={(checked) => handleInputChange("security.twoFactor", checked)}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Biometric Login</p>
                    <p className="text-sm text-gray-600">Use fingerprint or face ID</p>
                  </div>
                </div>
                <Switch
                  checked={formData.security.biometric}
                  onCheckedChange={(checked) => handleInputChange("security.biometric", checked)}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Login Alerts</p>
                  <p className="text-sm text-gray-600">Notify on new device login</p>
                </div>
                <Switch
                  checked={formData.security.loginAlerts}
                  onCheckedChange={(checked) => handleInputChange("security.loginAlerts", checked)}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Device Tracking</p>
                  <p className="text-sm text-gray-600">Monitor trusted devices</p>
                </div>
                <Switch
                  checked={formData.security.deviceTracking}
                  onCheckedChange={(checked) => handleInputChange("security.deviceTracking", checked)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Data Sharing</p>
                  <p className="text-sm text-gray-600">Share data with partners</p>
                </div>
                <Switch
                  checked={formData.privacy.dataSharing}
                  onCheckedChange={(checked) => handleInputChange("privacy.dataSharing", checked)}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Analytics</p>
                  <p className="text-sm text-gray-600">Help improve our services</p>
                </div>
                <Switch
                  checked={formData.privacy.analytics}
                  onCheckedChange={(checked) => handleInputChange("privacy.analytics", checked)}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Personalization</p>
                  <p className="text-sm text-gray-600">Personalized recommendations</p>
                </div>
                <Switch
                  checked={formData.privacy.personalization}
                  onCheckedChange={(checked) => handleInputChange("privacy.personalization", checked)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
