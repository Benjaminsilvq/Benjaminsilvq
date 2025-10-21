export interface CameraCapture {
  startCamera: () => Promise<MediaStream>
  stopCamera: (stream: MediaStream) => void
  capturePhoto: (video: HTMLVideoElement) => string
  requestCameraPermission: () => Promise<boolean>
}

export const cameraUtils: CameraCapture = {
  async startCamera(): Promise<MediaStream> {
    try {
      const hasPermission = await this.requestCameraPermission()
      if (!hasPermission) {
        throw new Error("Camera permission denied")
      }

      const stream = await Promise.race([
        navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment", // Use back camera for check photos
            width: { ideal: 1920, min: 640 },
            height: { ideal: 1080, min: 480 },
          },
        }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout starting video source")), 10000)),
      ])

      if (!stream || stream.getTracks().length === 0) {
        throw new Error("No video tracks available")
      }

      return stream
    } catch (error) {
      console.error("Camera access denied:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Camera access is required for mobile deposit")
    }
  },

  stopCamera(stream: MediaStream): void {
    stream.getTracks().forEach((track) => track.stop())
  },

  capturePhoto(video: HTMLVideoElement): string {
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(video, 0, 0)
      return canvas.toDataURL("image/jpeg", 0.8)
    }
    throw new Error("Failed to capture photo")
  },

  async requestCameraPermission(): Promise<boolean> {
    try {
      const testStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1, height: 1 },
      })
      testStream.getTracks().forEach((track) => track.stop())
      return true
    } catch (error) {
      console.error("Camera permission check failed:", error)
      return false
    }
  },
}

export interface LocationData {
  latitude: number
  longitude: number
}

export const getLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported in this browser"))
      return
    }

    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, timeoutReject) => {
      setTimeout(() => {
        timeoutReject(new Error("Location request timed out. Please check your location settings and try again."))
      }, 15000) // Increased timeout to 15 seconds
    })

    // Create the geolocation promise
    const locationPromise = new Promise<LocationData>((locationResolve, locationReject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          locationResolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          let errorMessage = "Location access denied. "
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Please enable location services in your browser settings."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable. Please try again."
              break
            case error.TIMEOUT:
              errorMessage += "Location request timed out. Please try again."
              break
            default:
              errorMessage += "An unknown error occurred while retrieving location."
              break
          }
          locationReject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: false, // Use less accurate but faster location
          timeout: 12000, // 12 second timeout for geolocation API
          maximumAge: 600000, // Accept cached location up to 10 minutes old
        },
      )
    })

    // Race between location and timeout
    Promise.race([locationPromise, timeoutPromise]).then(resolve).catch(reject)
  })
}
