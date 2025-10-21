"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Bell,
  X,
  Check,
  DollarSign,
  Shield,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Settings,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Volume2,
  Smartphone,
  Mail,
  MessageSquare,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EnhancedNotification {
  id: string
  type: "credit" | "debit" | "security" | "balance" | "transfer" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  amount?: number
  currency?: string
  account?: string
  merchant?: string
  actionRequired?: boolean
  actionUrl?: string
}

interface NotificationSettings {
  creditAlerts: boolean
  debitAlerts: boolean
  balanceAlerts: boolean
  securityAlerts: boolean
  transferAlerts: boolean
  minimumAmount: number
  pushEnabled: boolean
  emailEnabled: boolean
  smsEnabled: boolean
  soundEnabled: boolean
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

interface EnhancedNotificationContextType {
  notifications: EnhancedNotification[]
  unreadCount: number
  settings: NotificationSettings
  addNotification: (notification: Omit<EnhancedNotification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  updateSettings: (settings: Partial<NotificationSettings>) => void
  clearAll: () => void
  createTransactionAlert: (type: "credit" | "debit", amount: number, merchant: string, account: string) => void
}

const EnhancedNotificationContext = createContext<EnhancedNotificationContextType | undefined>(undefined)

export function useEnhancedNotifications() {
  const context = useContext(EnhancedNotificationContext)
  if (!context) {
    throw new Error("useEnhancedNotifications must be used within EnhancedNotificationProvider")
  }
  return context
}

const defaultSettings: NotificationSettings = {
  creditAlerts: true,
  debitAlerts: true,
  balanceAlerts: true,
  securityAlerts: true,
  transferAlerts: true,
  minimumAmount: 0,
  pushEnabled: true,
  emailEnabled: true,
  smsEnabled: false,
  soundEnabled: true,
  quietHours: {
    enabled: false,
    start: "22:00",
    end: "08:00",
  },
}

interface EnhancedNotificationProviderProps {
  children: ReactNode
}

export function EnhancedNotificationProvider({ children }: EnhancedNotificationProviderProps) {
  const [notifications, setNotifications] = useState<EnhancedNotification[]>([])
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings)
  const { toast } = useToast()

  useEffect(() => {
    // Load from localStorage
    const savedNotifications = localStorage.getItem("enhancedNotifications")
    const savedSettings = localStorage.getItem("notificationSettings")

    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    // Fetch notifications from API
    fetchNotifications()

    addInitialNotifications()
  }, [])

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("enhancedNotifications", JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    localStorage.setItem("notificationSettings", JSON.stringify(settings))
  }, [settings])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications?userId=current")
      const data = await response.json()
      setNotifications(data.notifications)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  const playNotificationSound = () => {
    if (settings.soundEnabled) {
      // Create a simple notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    }
  }

  const addNotification = async (notification: Omit<EnhancedNotification, "id" | "timestamp" | "read">) => {
    // Check if notification type is enabled
    const typeEnabled = {
      credit: settings.creditAlerts,
      debit: settings.debitAlerts,
      balance: settings.balanceAlerts,
      security: settings.securityAlerts,
      transfer: settings.transferAlerts,
      system: true,
    }

    if (!typeEnabled[notification.type]) return

    // Check minimum amount for transaction notifications
    if (
      (notification.type === "credit" || notification.type === "debit") &&
      notification.amount &&
      notification.amount < settings.minimumAmount
    ) {
      return
    }

    // Check quiet hours
    if (settings.quietHours.enabled) {
      const now = new Date()
      const currentTime = now.getHours() * 100 + now.getMinutes()
      const startTime = Number.parseInt(settings.quietHours.start.replace(":", ""))
      const endTime = Number.parseInt(settings.quietHours.end.replace(":", ""))

      if (startTime > endTime) {
        // Overnight quiet hours
        if (currentTime >= startTime || currentTime <= endTime) {
          return
        }
      } else {
        // Same day quiet hours
        if (currentTime >= startTime && currentTime <= endTime) {
          return
        }
      }
    }

    const newNotification: EnhancedNotification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Play notification sound
    playNotificationSound()

    // Show toast notification
    toast({
      title: newNotification.title,
      description: newNotification.message,
    })

    // Send to API
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNotification),
      })
    } catch (error) {
      console.error("Failed to save notification:", error)
    }

    // Browser push notification
    if (settings.pushEnabled && "Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(newNotification.title, {
            body: newNotification.message,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
          })
        }
      })
    }
  }

  const createTransactionAlert = (type: "credit" | "debit", amount: number, merchant: string, account: string) => {
    const isCredit = type === "credit"
    addNotification({
      type,
      title: `${isCredit ? "Credit" : "Debit"} Alert`,
      message: `$${amount.toFixed(2)} ${isCredit ? "deposited to" : "withdrawn from"} your ${account}`,
      priority: amount > 1000 ? "high" : "medium",
      category: "Transaction Alert",
      amount,
      currency: "USD",
      account,
      merchant,
    })
  }

  const markAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))

    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id, action: "read" }),
      })
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "read_all" }),
      })
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  const deleteNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))

    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id, action: "delete" }),
      })
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const addInitialNotifications = () => {
    const hasExistingNotifications = localStorage.getItem("enhancedNotifications")
    if (!hasExistingNotifications) {
      // Add FICO score notification
      setTimeout(() => {
        addNotification({
          type: "system",
          title: "Your FICO® Score went up 10 points",
          message: "Great news! Your FICO® Score increased from 692 to 702. Keep up the good work!",
          priority: "medium",
          category: "Credit Score Update",
          actionRequired: false,
        })
      }, 2000)

      // Add bonus points notification
      setTimeout(() => {
        addNotification({
          type: "system",
          title: "Earn 20k bonus points",
          message:
            "You're eligible for 20,000 bonus points with the Wells Fargo Autograph Card. Apply now to start earning!",
          priority: "medium",
          category: "Rewards Offer",
          actionRequired: true,
          actionUrl: "/credit-cards",
        })
      }, 4000)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <EnhancedNotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        settings,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        updateSettings,
        clearAll,
        createTransactionAlert,
      }}
    >
      {children}
    </EnhancedNotificationContext.Provider>
  )
}

interface EnhancedNotificationCenterProps {
  onBack: () => void
}

export function EnhancedNotificationCenter({ onBack }: EnhancedNotificationCenterProps) {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useEnhancedNotifications()
  const [filter, setFilter] = useState<"all" | "unread" | "credit" | "debit" | "security">("all")
  const [searchTerm, setSearchTerm] = useState("")

  const getNotificationIcon = (type: EnhancedNotification["type"]) => {
    switch (type) {
      case "credit":
        return TrendingUp
      case "debit":
        return TrendingDown
      case "security":
        return Shield
      case "balance":
        return DollarSign
      case "transfer":
        return CreditCard
      case "system":
        return Settings
      default:
        return Bell
    }
  }

  const getPriorityColor = (priority: EnhancedNotification["priority"]) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-50 border-red-200"
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "medium":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "low":
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread" && notification.read) return false
    if (filter === "credit" && notification.type !== "credit") return false
    if (filter === "debit" && notification.type !== "debit") return false
    if (filter === "security" && notification.type !== "security") return false
    if (
      searchTerm &&
      !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false
    return true
  })

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 bg-red-600 text-white">
        <button onClick={onBack} className="text-white hover:text-gray-200">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Notifications</h1>
          <p className="text-sm text-red-100">{notifications.filter((n) => !n.read).length} unread</p>
        </div>
        <Bell className="w-6 h-6" />
      </div>

      <div className="p-4 space-y-4">
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search notifications..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {[
              { id: "all", label: "All" },
              { id: "unread", label: "Unread" },
              { id: "credit", label: "Credits" },
              { id: "debit", label: "Debits" },
              { id: "security", label: "Security" },
            ].map((filterOption) => (
              <Button
                key={filterOption.id}
                variant={filter === filterOption.id ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterOption.id as any)}
                className={filter === filterOption.id ? "bg-red-600 hover:bg-red-700" : ""}
              >
                {filterOption.label}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
            <Button variant="outline" size="sm" onClick={clearAll}>
              <X className="w-4 h-4 mr-2" />
              Clear all
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No notifications found</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type)
              return (
                <Card key={notification.id} className={`${!notification.read ? "border-red-200 bg-red-50" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${getPriorityColor(notification.priority)}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-medium ${!notification.read ? "text-gray-900" : "text-gray-600"}`}>
                                {notification.title}
                              </h4>
                              {!notification.read && <div className="w-2 h-2 bg-red-600 rounded-full" />}
                              {notification.actionRequired && <AlertCircle className="w-4 h-4 text-orange-500" />}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(notification.timestamp).toLocaleString()}
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {notification.category}
                              </Badge>
                              {notification.amount && (
                                <span className="font-medium text-gray-700">
                                  ${notification.amount.toLocaleString()} {notification.currency || "USD"}
                                </span>
                              )}
                            </div>
                            {notification.merchant && (
                              <p className="text-xs text-gray-500 mt-1">{notification.merchant}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {notification.actionRequired && (
                          <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700">
                            Take Action
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

interface NotificationSettingsProps {
  onBack: () => void
}

export function NotificationSettingsPanel({ onBack }: NotificationSettingsProps) {
  const { settings, updateSettings } = useEnhancedNotifications()

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 bg-red-600 text-white">
        <button onClick={onBack} className="text-white hover:text-gray-200">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold">Notification Settings</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Alert Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-600" />
              Alert Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                key: "creditAlerts",
                label: "Credit Alerts",
                desc: "When money is added to your account",
                icon: TrendingUp,
              },
              {
                key: "debitAlerts",
                label: "Debit Alerts",
                desc: "When money is withdrawn from your account",
                icon: TrendingDown,
              },
              {
                key: "balanceAlerts",
                label: "Balance Alerts",
                desc: "Low balance and account status updates",
                icon: DollarSign,
              },
              {
                key: "securityAlerts",
                label: "Security Alerts",
                desc: "Login attempts and security events",
                icon: Shield,
              },
              {
                key: "transferAlerts",
                label: "Transfer Alerts",
                desc: "Money transfers and payments",
                icon: CreditCard,
              },
            ].map(({ key, label, desc, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-500" />
                  <div>
                    <Label className="font-medium">{label}</Label>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                </div>
                <Switch
                  checked={settings[key as keyof NotificationSettings] as boolean}
                  onCheckedChange={(checked) => updateSettings({ [key]: checked })}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Delivery Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                key: "pushEnabled",
                label: "Push Notifications",
                desc: "Browser and mobile notifications",
                icon: Smartphone,
              },
              { key: "emailEnabled", label: "Email Notifications", desc: "Email alerts and summaries", icon: Mail },
              { key: "smsEnabled", label: "SMS Notifications", desc: "Text message alerts", icon: MessageSquare },
              { key: "soundEnabled", label: "Sound Alerts", desc: "Audio notification sounds", icon: Volume2 },
            ].map(({ key, label, desc, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-500" />
                  <div>
                    <Label className="font-medium">{label}</Label>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                </div>
                <Switch
                  checked={settings[key as keyof NotificationSettings] as boolean}
                  onCheckedChange={(checked) => updateSettings({ [key]: checked })}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Transaction Threshold */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Threshold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Only notify for transactions above:</Label>
              <Input
                type="number"
                value={settings.minimumAmount}
                onChange={(e) => updateSettings({ minimumAmount: Number.parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
              <p className="text-sm text-gray-600">Set to 0 to receive all transaction alerts</p>
            </div>
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Quiet Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Enable quiet hours</Label>
                <p className="text-sm text-gray-600">Pause notifications during specified hours</p>
              </div>
              <Switch
                checked={settings.quietHours.enabled}
                onCheckedChange={(checked) =>
                  updateSettings({ quietHours: { ...settings.quietHours, enabled: checked } })
                }
              />
            </div>

            {settings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Start time</Label>
                  <Input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => updateSettings({ quietHours: { ...settings.quietHours, start: e.target.value } })}
                  />
                </div>
                <div>
                  <Label>End time</Label>
                  <Input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => updateSettings({ quietHours: { ...settings.quietHours, end: e.target.value } })}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
