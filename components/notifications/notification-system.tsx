"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { Card } from "@/components/ui/card"
import {
  Bell,
  X,
  Check,
  AlertTriangle,
  Info,
  DollarSign,
  Shield,
  CreditCard,
  TrendingUp,
  Settings,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface Notification {
  id: string
  type: "transaction" | "security" | "account" | "promotion" | "system" | "international"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high" | "urgent"
  actionRequired?: boolean
  actionUrl?: string
  category: string
  amount?: number
  currency?: string
}

interface NotificationPreferences {
  pushEnabled: boolean
  emailEnabled: boolean
  smsEnabled: boolean
  categories: {
    transactions: boolean
    security: boolean
    account: boolean
    promotions: boolean
    system: boolean
    international: boolean
  }
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
  minimumAmount: number
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  preferences: NotificationPreferences
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider")
  }
  return context
}

const defaultPreferences: NotificationPreferences = {
  pushEnabled: true,
  emailEnabled: true,
  smsEnabled: false,
  categories: {
    transactions: true,
    security: true,
    account: true,
    promotions: false,
    system: true,
    international: true,
  },
  quietHours: {
    enabled: false,
    start: "22:00",
    end: "08:00",
  },
  minimumAmount: 0,
}

const sampleNotifications: Notification[] = [
  {
    id: "1",
    type: "transaction",
    title: "Transaction Alert",
    message: "Payment of $1,250.00 processed to Amazon.com",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    priority: "medium",
    category: "Debit Card",
    amount: 1250.0,
    currency: "USD",
  },
  {
    id: "2",
    type: "security",
    title: "Security Alert",
    message: "New device login detected from iPhone 15 Pro",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
    priority: "high",
    actionRequired: true,
    category: "Account Security",
  },
  {
    id: "3",
    type: "account",
    title: "Low Balance Warning",
    message: "Your checking account balance is below $500",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: true,
    priority: "medium",
    category: "Account Management",
  },
  {
    id: "4",
    type: "international",
    title: "International Transfer",
    message: "Wire transfer to UK completed successfully",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    priority: "low",
    category: "International Banking",
    amount: 5000.0,
    currency: "GBP",
  },
  {
    id: "5",
    type: "promotion",
    title: "Special Offer",
    message: "Earn 2% cashback on all purchases this month",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: true,
    priority: "low",
    category: "Promotions",
  },
]

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences)

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("notifications")
    const savedPrefs = localStorage.getItem("notificationPreferences")

    if (saved) {
      setNotifications(JSON.parse(saved))
    } else {
      setNotifications(sampleNotifications)
    }

    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs))
    }
  }, [])

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("notifications", JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    localStorage.setItem("notificationPreferences", JSON.stringify(preferences))
  }, [preferences])

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    // Check if category is enabled
    if (!preferences.categories[notification.type]) return

    // Check minimum amount for transaction notifications
    if (notification.type === "transaction" && notification.amount && notification.amount < preferences.minimumAmount) {
      return
    }

    // Check quiet hours
    if (preferences.quietHours.enabled) {
      const now = new Date()
      const currentTime = now.getHours() * 100 + now.getMinutes()
      const startTime = Number.parseInt(preferences.quietHours.start.replace(":", ""))
      const endTime = Number.parseInt(preferences.quietHours.end.replace(":", ""))

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

    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Simulate push notification
    if (preferences.pushEnabled && "Notification" in window) {
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

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const updatePreferences = (newPreferences: Partial<NotificationPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        preferences,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        updatePreferences,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

interface NotificationCenterProps {
  onClose: () => void
}

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications()
  const [filter, setFilter] = useState<"all" | "unread" | "transactions" | "security">("all")
  const [searchTerm, setSearchTerm] = useState("")

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "transaction":
        return DollarSign
      case "security":
        return Shield
      case "account":
        return CreditCard
      case "international":
        return TrendingUp
      case "promotion":
        return Info
      case "system":
        return Settings
      default:
        return Bell
    }
  }

  const getPriorityColor = (priority: Notification["priority"]) => {
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
    if (filter === "transactions" && notification.type !== "transaction") return false
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] bg-card border border-border overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-card-foreground">Notifications</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search notifications..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {[
                { id: "all", label: "All" },
                { id: "unread", label: "Unread" },
                { id: "transactions", label: "Transactions" },
                { id: "security", label: "Security" },
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id as any)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === filterOption.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Mark all read
              </button>
              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-96">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No notifications found</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-muted transition-colors ${!notification.read ? "bg-blue-50/50" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${getPriorityColor(
                          notification.priority,
                        )}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4
                                className={`font-medium ${
                                  !notification.read ? "text-card-foreground" : "text-muted-foreground"
                                }`}
                              >
                                {notification.title}
                              </h4>
                              {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                              {notification.actionRequired && <AlertCircle className="w-4 h-4 text-orange-500" />}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(notification.timestamp).toLocaleString()}
                              </div>
                              <span className="px-2 py-1 bg-muted rounded text-xs">{notification.category}</span>
                              {notification.amount && (
                                <span className="font-medium">
                                  {notification.amount.toLocaleString()} {notification.currency || "USD"}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {notification.actionRequired && (
                          <button className="mt-2 px-3 py-1 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors">
                            Take Action
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

interface NotificationPreferencesProps {
  onClose: () => void
}

export function NotificationPreferences({ onClose }: NotificationPreferencesProps) {
  const { preferences, updatePreferences } = useNotifications()

  const handleCategoryToggle = (category: keyof NotificationPreferences["categories"]) => {
    updatePreferences({
      categories: {
        ...preferences.categories,
        [category]: !preferences.categories[category],
      },
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-card border border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-card-foreground">Notification Settings</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Delivery Methods */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-3">Delivery Methods</h3>
            <div className="space-y-3">
              {[
                { key: "pushEnabled", label: "Push Notifications", icon: Bell },
                { key: "emailEnabled", label: "Email Notifications", icon: Info },
                { key: "smsEnabled", label: "SMS Notifications", icon: AlertTriangle },
              ].map((method) => {
                const Icon = method.icon
                return (
                  <div key={method.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-card-foreground">{method.label}</span>
                    </div>
                    <button
                      onClick={() =>
                        updatePreferences({ [method.key]: !preferences[method.key as keyof NotificationPreferences] })
                      }
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences[method.key as keyof NotificationPreferences] ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          preferences[method.key as keyof NotificationPreferences] ? "translate-x-6" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-3">Categories</h3>
            <div className="space-y-3">
              {Object.entries(preferences.categories).map(([category, enabled]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-card-foreground capitalize">{category}</span>
                  <button
                    onClick={() => handleCategoryToggle(category as keyof NotificationPreferences["categories"])}
                    className={`w-12 h-6 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-muted"}`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        enabled ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Minimum Amount */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-3">Transaction Threshold</h3>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Only notify for transactions above:</label>
              <input
                type="number"
                value={preferences.minimumAmount}
                onChange={(e) => updatePreferences({ minimumAmount: Number.parseFloat(e.target.value) || 0 })}
                className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Quiet Hours */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-3">Quiet Hours</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-card-foreground">Enable quiet hours</span>
                <button
                  onClick={() =>
                    updatePreferences({
                      quietHours: { ...preferences.quietHours, enabled: !preferences.quietHours.enabled },
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors ${
                    preferences.quietHours.enabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      preferences.quietHours.enabled ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {preferences.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Start time</label>
                    <input
                      type="time"
                      value={preferences.quietHours.start}
                      onChange={(e) =>
                        updatePreferences({
                          quietHours: { ...preferences.quietHours, start: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">End time</label>
                    <input
                      type="time"
                      value={preferences.quietHours.end}
                      onChange={(e) =>
                        updatePreferences({
                          quietHours: { ...preferences.quietHours, end: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </Card>
    </div>
  )
}
