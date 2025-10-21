"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Fingerprint, Eye, Mic, Shield, CheckCircle, XCircle, Camera, Loader2, AlertTriangle } from "lucide-react"

interface BiometricAuthProps {
  onSuccess: (method: string) => void
  onCancel: () => void
  availableMethods?: ("fingerprint" | "face" | "voice")[]
}

export function BiometricAuth({
  onSuccess,
  onCancel,
  availableMethods = ["fingerprint", "face", "voice"],
}: BiometricAuthProps) {
  const [activeMethod, setActiveMethod] = useState<"fingerprint" | "face" | "voice" | null>(null)
  const [authStatus, setAuthStatus] = useState<"idle" | "authenticating" | "success" | "failed">("idle")
  const [attempts, setAttempts] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [voiceCommand, setVoiceCommand] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const maxAttempts = 3

  const startFingerprintAuth = () => {
    setActiveMethod("fingerprint")
    setAuthStatus("authenticating")

    // Simulate fingerprint scanning
    setTimeout(() => {
      const success = Math.random() > 0.2 // 80% success rate
      if (success) {
        setAuthStatus("success")
        setTimeout(() => onSuccess("fingerprint"), 1000)
      } else {
        setAuthStatus("failed")
        setAttempts((prev) => prev + 1)
        setTimeout(() => {
          setAuthStatus("idle")
          setActiveMethod(null)
        }, 2000)
      }
    }, 2000)
  }

  const startFaceAuth = async () => {
    setActiveMethod("face")
    setAuthStatus("authenticating")

    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      // Simulate face recognition
      setTimeout(() => {
        const success = Math.random() > 0.15 // 85% success rate
        if (success) {
          setAuthStatus("success")
          setTimeout(() => {
            stream.getTracks().forEach((track) => track.stop())
            onSuccess("face")
          }, 1000)
        } else {
          setAuthStatus("failed")
          setAttempts((prev) => prev + 1)
          setTimeout(() => {
            stream.getTracks().forEach((track) => track.stop())
            setAuthStatus("idle")
            setActiveMethod(null)
          }, 2000)
        }
      }, 3000)
    } catch (error) {
      setAuthStatus("failed")
      setTimeout(() => {
        setAuthStatus("idle")
        setActiveMethod(null)
      }, 2000)
    }
  }

  const startVoiceAuth = () => {
    setActiveMethod("voice")
    setAuthStatus("authenticating")
    setIsListening(true)

    // Simulate voice recognition
    const phrases = ["My voice is my password", "Wells Fargo secure access", "Authenticate my identity"]

    const expectedPhrase = phrases[Math.floor(Math.random() * phrases.length)]
    setVoiceCommand(`Please say: "${expectedPhrase}"`)

    setTimeout(() => {
      const success = Math.random() > 0.25 // 75% success rate
      setIsListening(false)
      if (success) {
        setAuthStatus("success")
        setTimeout(() => onSuccess("voice"), 1000)
      } else {
        setAuthStatus("failed")
        setAttempts((prev) => prev + 1)
        setTimeout(() => {
          setAuthStatus("idle")
          setActiveMethod(null)
          setVoiceCommand("")
        }, 2000)
      }
    }, 4000)
  }

  const renderAuthMethod = (method: "fingerprint" | "face" | "voice") => {
    const isActive = activeMethod === method
    const isDisabled = attempts >= maxAttempts || (activeMethod && activeMethod !== method)

    const methodConfig = {
      fingerprint: {
        icon: Fingerprint,
        title: "Touch ID",
        description: "Place your finger on the sensor",
        action: startFingerprintAuth,
      },
      face: {
        icon: Eye,
        title: "Face ID",
        description: "Look at the camera",
        action: startFaceAuth,
      },
      voice: {
        icon: Mic,
        title: "Voice ID",
        description: "Speak your passphrase",
        action: startVoiceAuth,
      },
    }

    const config = methodConfig[method]
    const Icon = config.icon

    return (
      <Card
        key={method}
        className={`p-6 cursor-pointer transition-all duration-300 ${
          isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={!isDisabled ? config.action : undefined}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {authStatus === "authenticating" && isActive ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : authStatus === "success" && isActive ? (
              <CheckCircle className="w-8 h-8 text-green-500" />
            ) : authStatus === "failed" && isActive ? (
              <XCircle className="w-8 h-8 text-red-500" />
            ) : (
              <Icon className="w-8 h-8" />
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg text-card-foreground">{config.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{config.description}</p>

            {isActive && authStatus === "authenticating" && (
              <div className="mt-3">
                {method === "voice" && (
                  <div className="text-sm text-primary font-medium">
                    {voiceCommand}
                    {isListening && (
                      <div className="flex items-center justify-center mt-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2" />
                        Listening...
                      </div>
                    )}
                  </div>
                )}
                {method === "face" && (
                  <div className="text-sm text-primary font-medium">Position your face in the camera</div>
                )}
                {method === "fingerprint" && (
                  <div className="text-sm text-primary font-medium">Keep your finger on the sensor</div>
                )}
              </div>
            )}

            {isActive && authStatus === "success" && (
              <div className="mt-3 text-sm text-green-600 font-medium">Authentication successful!</div>
            )}

            {isActive && authStatus === "failed" && (
              <div className="mt-3 text-sm text-red-600 font-medium">Authentication failed. Try again.</div>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-card border border-border">
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-2">Biometric Authentication</h2>
            <p className="text-muted-foreground">Choose your preferred authentication method</p>

            {attempts > 0 && attempts < maxAttempts && (
              <div className="mt-3 flex items-center justify-center gap-2 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">
                  Attempt {attempts} of {maxAttempts}
                </span>
              </div>
            )}

            {attempts >= maxAttempts && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <XCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Maximum attempts reached</span>
                </div>
                <p className="text-xs text-red-500 mt-1">Please use alternative authentication</p>
              </div>
            )}
          </div>

          <div className="space-y-4 mb-6">{availableMethods.map((method) => renderAuthMethod(method))}</div>

          {/* Face ID Camera View */}
          {activeMethod === "face" && authStatus === "authenticating" && (
            <div className="mb-6">
              <div className="relative w-full h-48 bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                <canvas ref={canvasRef} className="hidden" />

                {/* Face detection overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-40 border-2 border-primary rounded-lg animate-pulse" />
                </div>

                <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/50 rounded-full px-3 py-1">
                  <Camera className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">Face ID Active</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              disabled={authStatus === "authenticating"}
            >
              Cancel
            </button>

            <button
              onClick={() => onSuccess("fallback")}
              className="flex-1 py-3 px-4 bg-muted text-muted-foreground rounded-lg hover:bg-accent transition-colors"
              disabled={authStatus === "authenticating"}
            >
              Use Password
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default BiometricAuth
