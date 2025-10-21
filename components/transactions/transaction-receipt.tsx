"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Share, Printer, CheckCircle } from "lucide-react"

interface TransactionReceiptProps {
  transaction: {
    id: string
    type: "pending" | "completed"
    description: string
    amount: number
    date: string
    category: string
    confirmationNumber?: string
    fromAccount?: string
    toAccount?: string
    fee?: number
  }
  onBack: () => void
}

export function TransactionReceipt({ transaction, onBack }: TransactionReceiptProps) {
  const handleDownload = () => {
    alert("Receipt downloaded to your device")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Transaction Receipt",
        text: `Transaction Receipt - ${transaction.description}`,
      })
    } else {
      alert("Receipt details copied to clipboard")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Transaction Receipt</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Receipt Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Transaction Complete</h2>
          <p className="text-gray-600">Your transaction has been processed successfully</p>
        </div>

        {/* Transaction Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-medium text-gray-900">{transaction.id}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Date & Time</span>
              <span className="font-medium text-gray-900">{transaction.date}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Description</span>
              <span className="font-medium text-gray-900 text-right">{transaction.description}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Amount</span>
              <span className={`font-bold text-lg ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Status</span>
              <span
                className={`font-medium ${transaction.type === "completed" ? "text-green-600" : "text-yellow-600"}`}
              >
                {transaction.type === "completed" ? "Completed" : "Pending"}
              </span>
            </div>

            {transaction.confirmationNumber && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Confirmation #</span>
                <span className="font-medium text-gray-900">{transaction.confirmationNumber}</span>
              </div>
            )}

            {transaction.fee && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Fee</span>
                <span className="font-medium text-red-600">${transaction.fee.toFixed(2)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Account Holder</span>
              <span className="font-medium text-gray-900">Johnny Mercer</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">From Account</span>
              <span className="font-medium text-gray-900">
                {transaction.fromAccount || "EVERYDAY CHECKING ...6224"}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Routing Number</span>
              <span className="font-medium text-gray-900">121000248</span>
            </div>

            {transaction.toAccount && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">To Account</span>
                <span className="font-medium text-gray-900">{transaction.toAccount}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button onClick={handleDownload} className="w-full bg-red-600 hover:bg-red-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              onClick={handlePrint}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Wells Fargo Bank, N.A.</p>
          <p className="text-xs text-gray-500">Member FDIC | Equal Housing Lender</p>
          <p className="text-xs text-gray-500 mt-2">Questions? Call 1-800-869-3557 or visit wellsfargo.com</p>
        </div>
      </div>
    </div>
  )
}
