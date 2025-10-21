"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Wifi, Battery, Bluetooth, Fingerprint, Eye, Camera, Mic } from "lucide-react"

interface MobileAppSimulatorProps {
  children: React.ReactNode
  deviceType?: "iphone" | "android"
  showStatusBar?: boolean
  showHomeIndicator?: boolean
}

export function MobileAppSimulator({
  children,
  deviceType = "iphone",
  showStatusBar = true,
  showHomeIndicator = true,
}: MobileAppSimulatorProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [batteryLevel, setBatteryLevel] = useState(87)
  const [signalStrength, setSignalStrength] = useState(4)
  const [wifiConnected, setWifiConnected] = useState(true)
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true)
  const [biometricEnabled, setBiometricEnabled] = useState(true)
  const [faceIdActive, setFaceIdActive] = useState(false)
  const [touchIdActive, setTouchIdActive] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    })
  }

  const handleBiometricAuth = (type: "face" | "touch") => {
    if (type === "face") {
      setFaceIdActive(true)
      setTimeout(() => {
        setFaceIdActive(false)
        // Simulate successful authentication
      }, 2000)
    } else {
      setTouchIdActive(true)
      setTimeout(() => {
        setTouchIdActive(false)
        // Simulate successful authentication
      }, 1500)
    }
  }

  return (
    <div className="relative mx-auto bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
      {/* Device Frame */}
      <div
        className={`relative bg-black rounded-[2rem] overflow-hidden ${
          deviceType === "iphone" ? "w-[375px] h-[812px]" : "w-[360px] h-[800px]"
        }`}
      >
        {/* Status Bar */}
        {showStatusBar && (
          <div className="absolute top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm">
            <div className="flex items-center justify-between px-6 py-2 text-white text-sm">
              {/* Left side - Time */}
              <div className="flex items-center gap-1">
                <span className="font-semibold">{formatTime(currentTime)}</span>
              </div>

              {/* Right side - Status icons */}
              <div className="flex items-center gap-1">
                {/* Signal strength */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4].map((bar) => (
                    <div
                      key={bar}
                      className={`w-1 rounded-full ${bar <= signalStrength ? "bg-white" : "bg-gray-600"}`}
                      style={{ height: `${bar * 3 + 2}px` }}
                    />
                  ))}
                </div>

                {/* WiFi */}
                {wifiConnected && <Wifi className="w-4 h-4" />}

                {/* Bluetooth */}
                {bluetoothEnabled && <Bluetooth className="w-3 h-3" />}

                {/* Battery */}
                <div className="flex items-center gap-1">
                  <div className="relative">
                    <Battery className="w-6 h-4" />
                    <div
                      className="absolute top-0.5 left-0.5 bg-white rounded-sm"
                      style={{
                        width: `${(batteryLevel / 100) * 20}px`,
                        height: "10px",
                      }}
                    />
                  </div>
                  <span className="text-xs">{batteryLevel}%</span>
                </div>
              </div>
            </div>

            {/* Dynamic Island (iPhone) or Notch */}
            {deviceType === "iphone" && (
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full flex items-center justify-center gap-2">
                <Camera className="w-3 h-3 text-gray-400" />
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                <Mic className="w-3 h-3 text-gray-400" />
              </div>
            )}
          </div>
        )}

        {/* App Content */}
        <div
          className={`relative h-full bg-background ${showStatusBar ? "pt-12" : ""} ${showHomeIndicator ? "pb-8" : ""}`}
        >
          {children}
        </div>

        {/* Home Indicator */}
        {showHomeIndicator && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="w-32 h-1 bg-white/30 rounded-full" />
          </div>
        )}

        {/* Biometric Authentication Overlays */}
        {faceIdActive && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="text-center text-white">
              <div className="w-24 h-24 border-2 border-white rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                <Eye className="w-12 h-12" />
              </div>
              <p className="text-lg font-semibold">Face ID</p>
              <p className="text-sm text-gray-300">Look at your device</p>
            </div>
          </div>
        )}

        {touchIdActive && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="text-center text-white">
              <div className="w-24 h-24 border-2 border-white rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                <Fingerprint className="w-12 h-12" />
              </div>
              <p className="text-lg font-semibold">Touch ID</p>
              <p className="text-sm text-gray-300">Place your finger on the sensor</p>
            </div>
          </div>
        )}

        {/* Mobile Controls */}
        <div className="absolute bottom-20 right-4 flex flex-col gap-2 z-40">
          {biometricEnabled && (
            <>
              <button
                onClick={() => handleBiometricAuth("face")}
                className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                title="Face ID"
              >
                <Eye className="w-6 h-6" />
              </button>
              <button
                onClick={() => handleBiometricAuth("touch")}
                className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                title="Touch ID"
              >
                <Fingerprint className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Device Controls */}
      <div className="absolute -right-2 top-20 flex flex-col gap-2">
        {/* Volume buttons */}
        <button className="w-1 h-12 bg-gray-700 rounded-l-lg" title="Volume Up" />
        <button className="w-1 h-12 bg-gray-700 rounded-l-lg" title="Volume Down" />
      </div>

      {/* Power button */}
      <div className="absolute -right-2 top-40">
        <button className="w-1 h-16 bg-gray-700 rounded-l-lg" title="Power" />
      </div>
    </div>
  )
}

export default MobileAppSimulator
