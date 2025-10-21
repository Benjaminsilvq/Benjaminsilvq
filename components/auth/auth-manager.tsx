"use client"

import { useState, createContext, useContext, type ReactNode } from "react"
import { LoginForm } from "./login-form"
import { ForgotPassword } from "./forgot-password"
import { AccountCreation } from "./account-creation"

interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  accountType: string
  balance: number
  accountNumber: string
  biometricEnabled: boolean
  preferredBiometric: "fingerprint" | "face" | "voice" | null
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
  updateUser: (updates: Partial<User & { password?: string; phone?: string }>) => void
  debitBalance: (amount: number, description: string) => boolean
  creditBalance: (amount: number, description: string) => boolean
  enableBiometric: (method: "fingerprint" | "face" | "voice") => void
  disableBiometric: () => void
  authenticateWithBiometric: (method: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Demo users database
const demoUsers: Record<string, User & { password: string; phone: string }> = {
  "johnny.mercer": {
    id: "1",
    username: "johnny.mercer",
    firstName: "Johnny",
    lastName: "Mercer",
    email: "echase_247@zohomail.com",
    password: "password",
    phone: "(555) 123-4567",
    accountType: "Everyday Checking",
    balance: 36000.0,
    accountNumber: "6224",
    biometricEnabled: true,
    preferredBiometric: "fingerprint",
  },
  "johnnymercer1122@gmail.com": {
    id: "3",
    username: "johnnymercer1122@gmail.com",
    firstName: "Johnny",
    lastName: "Mercer",
    email: "johnnymercer1122@gmail.com",
    password: "Johnny1122@",
    phone: "(555) 987-6543",
    accountType: "Prime Checking",
    balance: 36000.0,
    accountNumber: "6224",
    biometricEnabled: true,
    preferredBiometric: "face",
  },
  demo: {
    id: "2",
    username: "demo",
    firstName: "Demo",
    lastName: "User",
    email: "demo@example.com",
    password: "demo123",
    phone: "(555) 000-0000",
    accountType: "Everyday Checking",
    balance: 9942.31,
    accountNumber: "6224",
    biometricEnabled: false,
    preferredBiometric: null,
  },
}

interface AuthManagerProps {
  children: ReactNode
}

export function AuthManager({ children }: AuthManagerProps) {
  const [user, setUser] = useState<User | null>(() => {
    // Automatically log in the user on mount
    const autoLoginUser = demoUsers["johnnymercer1122@gmail.com"]
    if (autoLoginUser) {
      const { password: _, ...userWithoutPassword } = autoLoginUser
      return userWithoutPassword
    }
    return null
  })
  const [authState, setAuthState] = useState<"login" | "forgot" | "create" | "biometric">("login")
  const [pendingUser, setPendingUser] = useState<User | null>(null)

  const login = (username: string, password: string): boolean => {
    const foundUser =
      demoUsers[username.toLowerCase()] ||
      Object.values(demoUsers).find((u) => u.email.toLowerCase() === username.toLowerCase())

    if (foundUser && foundUser.password === password) {
      const { password: _, ...userWithoutPassword } = foundUser

      setUser(userWithoutPassword)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setPendingUser(null)
    setAuthState("login")
  }

  const handleLogin = (username: string, password: string) => {
    const success = login(username, password)
    if (!success) {
      alert("Invalid credentials. Try 'johnny.mercer' or 'demo' with password 'password'")
    }
  }

  const handleForgotPassword = () => {
    setAuthState("forgot")
  }

  const handleCreateAccount = () => {
    setAuthState("create")
  }

  const handleForgotPasswordSubmit = (data: { type: string; value: string }) => {
    alert(`Recovery information sent to ${data.value}`)
    setAuthState("login")
  }

  const handleAccountCreation = (accountData: any) => {
    // Create new user account
    const newUser: User & { password: string; phone: string } = {
      id: Date.now().toString(),
      username: accountData.username,
      firstName: accountData.firstName,
      lastName: accountData.lastName,
      email: accountData.email,
      password: accountData.password,
      phone: accountData.phone,
      accountType: accountData.accountType,
      balance: Number.parseFloat(accountData.initialDeposit) || 0,
      accountNumber: Math.random().toString().slice(-4),
      biometricEnabled: false,
      preferredBiometric: null,
    }

    setUser(newUser)
    alert("Account created successfully!")
  }

  const handleBackToLogin = () => {
    setAuthState("login")
    setPendingUser(null)
  }

  const handleBiometricSuccess = (method: string) => {
    if (pendingUser) {
      setUser(pendingUser)
      setPendingUser(null)

      // Create notification for biometric login
      const notification = {
        id: Date.now().toString(),
        type: "security" as const,
        title: "Biometric Login",
        message: `Successfully authenticated using ${method}`,
        timestamp: new Date().toISOString(),
        read: false,
      }

      const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
      notifications.unshift(notification)
      localStorage.setItem("notifications", JSON.stringify(notifications))
    }
  }

  const handleBiometricCancel = () => {
    setAuthState("login")
    setPendingUser(null)
  }

  const updateUser = (updates: Partial<User & { password?: string; phone?: string }>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)

      // Update the demo users database for persistent login
      if (demoUsers[user.username]) {
        demoUsers[user.username] = { ...demoUsers[user.username], ...updates }
      }

      // If email changed, update the key in demoUsers
      if (updates.email && updates.email !== user.email) {
        const oldUser = demoUsers[user.username]
        delete demoUsers[user.username]
        demoUsers[updates.email] = { ...oldUser, ...updates }
        updatedUser.username = updates.email
      }
    }
  }

  const enableBiometric = (method: "fingerprint" | "face" | "voice") => {
    updateUser({ biometricEnabled: true, preferredBiometric: method })
  }

  const disableBiometric = () => {
    updateUser({ biometricEnabled: false, preferredBiometric: null })
  }

  const authenticateWithBiometric = (method: string) => {
    // Simulate biometric authentication success
    return Math.random() > 0.1 // 90% success rate
  }

  const debitBalance = (amount: number, description: string) => {
    if (user && user.balance >= amount) {
      const newBalance = user.balance - amount
      updateUser({ balance: newBalance })

      // Create notification for transaction
      const notification = {
        id: Date.now().toString(),
        type: "transaction" as const,
        title: "Transaction Processed",
        message: `$${amount.toFixed(2)} debited from your account - ${description}`,
        timestamp: new Date().toISOString(),
        read: false,
      }

      // Store notification (in real app, this would be in a proper state management system)
      const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
      notifications.unshift(notification)
      localStorage.setItem("notifications", JSON.stringify(notifications))

      return true
    }
    return false
  }

  const creditBalance = (amount: number, description: string) => {
    if (user) {
      const newBalance = user.balance + amount
      updateUser({ balance: newBalance })

      // Create notification for credit
      const notification = {
        id: Date.now().toString(),
        type: "credit" as const,
        title: "Deposit Received",
        message: `$${amount.toFixed(2)} credited to your account - ${description}`,
        timestamp: new Date().toISOString(),
        read: false,
      }

      const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
      notifications.unshift(notification)
      localStorage.setItem("notifications", JSON.stringify(notifications))

      return true
    }
    return false
  }

  if (!user) {
    switch (authState) {
      case "forgot":
        return <ForgotPassword onBack={handleBackToLogin} onSubmit={handleForgotPasswordSubmit} />
      case "create":
        return <AccountCreation onBack={handleBackToLogin} onCreateAccount={handleAccountCreation} />
      default:
        return (
          <LoginForm
            onLogin={handleLogin}
            onForgotPassword={handleForgotPassword}
            onCreateAccount={handleCreateAccount}
          />
        )
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        updateUser,
        debitBalance,
        creditBalance,
        enableBiometric,
        disableBiometric,
        authenticateWithBiometric,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
