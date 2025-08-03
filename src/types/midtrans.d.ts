// Midtrans Snap TypeScript Declaration
interface MidtransResult {
  order_id: string
  status_code: string
  transaction_status: string
  transaction_id: string
  gross_amount: string
  payment_type: string
  [key: string]: unknown
}

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: MidtransResult) => void
          onPending?: (result: MidtransResult) => void
          onError?: (result: MidtransResult) => void
          onClose?: () => void
        }
      ) => void
    }
  }
}

export {}
