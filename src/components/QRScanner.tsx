'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Scan, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QRScannerProps {
  onScan: (tableNumber: number) => void
  onClose: () => void
  isOpen: boolean
}

export function QRScanner({ onScan, onClose, isOpen }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null)
  const [hasCamera, setHasCamera] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (isOpen) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen])

  const startCamera = async () => {
    try {
      setError(null)
      // setIsScanning(true)

      // Check if camera is available
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      
      if (videoDevices.length === 0) {
        setHasCamera(false)
        setError('No camera found on this device')
        return
      }

      // Try to get back camera first, then front camera
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

    } catch (err) {
      console.error('Camera access error:', err)
      setError('Camera access denied. Please allow camera permission.')
      setHasCamera(false)
    } finally {
      // setIsScanning(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  // Simulate QR code detection (dalam implementasi nyata, gunakan library seperti jsQR)
  const simulateQRDetection = () => {
    // Simulasi scan berhasil dengan nomor meja random
    const tableNumber = Math.floor(Math.random() * 20) + 1
    onScan(tableNumber)
  }

  // Manual input sebagai fallback
  const handleManualInput = () => {
    const tableNumber = prompt('Masukkan nomor meja:')
    if (tableNumber && !isNaN(Number(tableNumber))) {
      onScan(Number(tableNumber))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Scan QR Code Meja</h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Camera View */}
        <div className="p-4">
          {hasCamera && !error ? (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-64 bg-black rounded-lg object-cover"
                autoPlay
                playsInline
                muted
              />
              
              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-amber-500 rounded-lg relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-amber-500 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-amber-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-amber-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-amber-500 rounded-br-lg"></div>
                  
                  {/* Scanning animation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Scan className="h-8 w-8 text-amber-500 animate-pulse" />
                  </div>
                </div>
              </div>

              <p className="text-center text-sm text-gray-600 mt-4">
                Arahkan kamera ke QR code pada meja
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Kamera Tidak Tersedia
              </h4>
              <p className="text-gray-600 mb-4">
                {error || 'Tidak dapat mengakses kamera pada perangkat ini'}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 mt-6">
            {hasCamera && !error && (
              <Button
                onClick={simulateQRDetection}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Scan className="h-4 w-4 mr-2" />
                Simulasi Scan (Demo)
              </Button>
            )}
            
            <Button
              onClick={handleManualInput}
              variant="outline"
            >
              Input Manual Nomor Meja
            </Button>
            
            <Button
              onClick={onClose}
              variant="ghost"
            >
              Batal
            </Button>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-2">Cara menggunakan:</h5>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Cari QR code pada meja Anda</li>
              <li>2. Arahkan kamera ke QR code</li>
              <li>3. Tunggu hingga terdeteksi otomatis</li>
              <li>4. Mulai memesan menu favorit Anda</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
