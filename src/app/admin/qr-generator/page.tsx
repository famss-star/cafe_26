'use client'

import { useState } from 'react'
import { QRCodeDisplay } from '@/components/QRCodeDisplay'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Plus, Printer } from 'lucide-react'

// Sample table configuration
const defaultTables = Array.from({ length: 20 }, (_, i) => i + 1)

export default function QRGeneratorPage() {
  const [tables, setTables] = useState<number[]>(defaultTables)
  const [newTableNumber, setNewTableNumber] = useState('')

  const addTable = () => {
    const tableNum = parseInt(newTableNumber)
    if (tableNum && !tables.includes(tableNum)) {
      setTables([...tables, tableNum].sort((a, b) => a - b))
      setNewTableNumber('')
    }
  }

  const removeTable = (tableNumber: number) => {
    setTables(tables.filter(t => t !== tableNumber))
  }

  const downloadAllQRs = () => {
    // In real implementation, this would generate a PDF with all QR codes
    alert('Feature download akan diimplementasi dengan library PDF generator')
  }

  const printQR = (tableNumber: number) => {
    // Open print dialog for specific QR code
    const qrData = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/table/${tableNumber}`
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrData)}`
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - Meja ${tableNumber}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px;
                margin: 0;
              }
              .qr-container { 
                display: inline-block; 
                border: 2px solid #000; 
                padding: 20px; 
                margin: 20px;
              }
              img { 
                display: block; 
                margin: 0 auto 10px; 
              }
              h2 { 
                margin: 10px 0; 
                font-size: 24px;
              }
              p { 
                margin: 5px 0; 
                font-size: 16px;
              }
              @media print {
                body { margin: 0; }
                .qr-container { 
                  page-break-inside: avoid; 
                  border: 2px solid #000;
                }
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h2>Kawa Leaves Coffee</h2>
              <img src="${qrCodeUrl}" alt="QR Code Meja ${tableNumber}" />
              <h2>MEJA ${tableNumber}</h2>
              <p>Scan untuk memesan</p>
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">QR Code Generator</h1>
              <p className="text-gray-600 mt-1">Generate QR codes untuk meja-meja cafe</p>
            </div>
            <Button
              onClick={downloadAllQRs}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Table Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tambah Meja Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Meja
                </label>
                <Input
                  type="number"
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(e.target.value)}
                  placeholder="Masukkan nomor meja"
                  className="w-full"
                />
              </div>
              <Button onClick={addTable} disabled={!newTableNumber}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* QR Codes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tables.map((tableNumber) => (
            <Card key={tableNumber} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center">
                  <QRCodeDisplay tableNumber={tableNumber} size={150} />
                  
                  <div className="mt-4 space-y-2">
                    <Button
                      onClick={() => printQR(tableNumber)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                    
                    <Button
                      onClick={() => removeTable(tableNumber)}
                      variant="destructive"
                      size="sm"
                      className="w-full"
                    >
                      Hapus Meja
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tables.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Belum ada meja yang ditambahkan</p>
            <p className="text-gray-400">Gunakan form di atas untuk menambah meja baru</p>
          </div>
        )}
      </div>
    </div>
  )
}
