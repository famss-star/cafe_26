interface QRCodeDisplayProps {
  tableNumber: number
  size?: number
}

export function QRCodeDisplay({ tableNumber, size = 200 }: QRCodeDisplayProps) {
  // URL yang akan di-encode dalam QR code
  const qrData = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/table/${tableNumber}`
  
  // Menggunakan qr-server.com untuk generate QR code (untuk demo)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrData)}`

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <img
          src={qrCodeUrl}
          alt={`QR Code untuk Meja ${tableNumber}`}
          width={size}
          height={size}
          className="rounded"
        />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">Meja {tableNumber}</h3>
        <p className="text-sm text-gray-600">Scan QR code untuk memesan</p>
      </div>
    </div>
  )
}
