"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, Building2, DollarSign, CheckCircle, AlertCircle, Copy, Zap } from "lucide-react"

interface TransferDepositProps {
  onBack: () => void
  onDepositComplete: (deposit: any) => void
}

interface ExternalBank {
  bankName: string
  routingNumber: string
  accountNumber: string
  accountType: "checking" | "savings"
  expedited: boolean
}

interface DirectDeposit {
  employerName: string
  percentage: number
  fixedAmount?: number
  startDate: string
  frequency: "weekly" | "bi-weekly" | "monthly"
}

export function TransferDeposit({ onBack, onDepositComplete }: TransferDepositProps) {
  const [activeTab, setActiveTab] = useState<"external" | "direct_deposit">("external")
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // External Transfer State
  const [externalBank, setExternalBank] = useState<ExternalBank>({
    bankName: "",
    routingNumber: "",
    accountNumber: "",
    accountType: "checking",
    expedited: false,
  })

  // Direct Deposit State
  const [directDeposit, setDirectDeposit] = useState<DirectDeposit>({
    employerName: "",
    percentage: 100,
    fixedAmount: undefined,
    startDate: "",
    frequency: "bi-weekly",
  })

  const [depositMethod, setDepositMethod] = useState<"percentage" | "fixed">("percentage")

  const handleExternalTransfer = async () => {
    if (!amount || !externalBank.bankName || !externalBank.routingNumber || !externalBank.accountNumber) {
      alert("Please fill in all required fields")
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch("/api/transfer-deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transferType: "external",
          amount: Number.parseFloat(amount),
          accountId: "acc_12345", // Would come from user context
          externalBank,
        }),
      })

      const result = await response.json()

      if (result.success) {
        const deposit = {
          id: result.transfer.id,
          type: "pending" as const,
          description: `Transfer from ${externalBank.bankName}`,
          amount: Number.parseFloat(amount),
          date: new Date().toLocaleDateString(),
          category: "transfer" as const,
          confirmationNumber: result.transfer.confirmationNumber,
        }

        onDepositComplete(deposit)
        alert(`Transfer of $${amount} initiated! Confirmation: ${result.transfer.confirmationNumber}`)
      } else {
        throw new Error(result.error || "Transfer failed")
      }
    } catch (error) {
      console.error("Transfer error:", error)
      alert("Failed to initiate transfer. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDirectDepositSetup = async () => {
    if (!directDeposit.employerName || !directDeposit.startDate) {
      alert("Please fill in all required fields")
      return
    }

    if (depositMethod === "fixed" && !directDeposit.fixedAmount) {
      alert("Please enter a fixed amount")
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch("/api/transfer-deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transferType: "direct_deposit",
          accountId: "acc_12345", // Would come from user context
          directDeposit: {
            ...directDeposit,
            fixedAmount: depositMethod === "fixed" ? directDeposit.fixedAmount : undefined,
          },
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert(
          `Direct deposit setup complete! Routing: ${result.transfer.routingNumber}, Account: ${result.transfer.accountNumber}`,
        )
      } else {
        throw new Error(result.error || "Setup failed")
      }
    } catch (error) {
      console.error("Direct deposit error:", error)
      alert("Failed to setup direct deposit. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Transfer Deposit</h1>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="external" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              External Transfer
            </TabsTrigger>
            <TabsTrigger value="direct_deposit" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Direct Deposit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="external" className="space-y-6 mt-6">
            {/* External Bank Transfer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Transfer from External Bank
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">External Transfer Information:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Standard transfers take 3-5 business days</li>
                        <li>• Expedited transfers available for $15 fee</li>
                        <li>• Daily limit: $25,000</li>
                        <li>• Verify account information carefully</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank-name">Bank Name</Label>
                    <Input
                      id="bank-name"
                      value={externalBank.bankName}
                      onChange={(e) => setExternalBank({ ...externalBank, bankName: e.target.value })}
                      placeholder="Enter bank name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="routing-number">Routing Number</Label>
                    <Input
                      id="routing-number"
                      value={externalBank.routingNumber}
                      onChange={(e) => setExternalBank({ ...externalBank, routingNumber: e.target.value })}
                      placeholder="9-digit routing number"
                      maxLength={9}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input
                      id="account-number"
                      value={externalBank.accountNumber}
                      onChange={(e) => setExternalBank({ ...externalBank, accountNumber: e.target.value })}
                      placeholder="Enter account number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-type">Account Type</Label>
                    <Select
                      value={externalBank.accountType}
                      onValueChange={(value: any) => setExternalBank({ ...externalBank, accountType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transfer-amount">Transfer Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="transfer-amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-10 h-12 text-lg"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="expedited"
                      checked={externalBank.expedited}
                      onCheckedChange={(checked) => setExternalBank({ ...externalBank, expedited: !!checked })}
                    />
                    <Label htmlFor="expedited" className="text-sm">
                      Expedited transfer (1-2 business days) - $15.00 fee
                    </Label>
                  </div>
                </div>

                <Button
                  onClick={handleExternalTransfer}
                  disabled={isProcessing}
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  {isProcessing ? "Processing..." : `Transfer $${amount || "0.00"}`}
                  {externalBank.expedited && <Zap className="w-4 h-4 ml-2" />}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="direct_deposit" className="space-y-6 mt-6">
            {/* Direct Deposit Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Setup Direct Deposit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium mb-1">Direct Deposit Benefits:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Funds available immediately on payday</li>
                        <li>• No fees or limits</li>
                        <li>• Automatic and secure</li>
                        <li>• Split deposits between accounts</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employer-name">Employer Name</Label>
                    <Input
                      id="employer-name"
                      value={directDeposit.employerName}
                      onChange={(e) => setDirectDeposit({ ...directDeposit, employerName: e.target.value })}
                      placeholder="Enter employer name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pay-frequency">Pay Frequency</Label>
                    <Select
                      value={directDeposit.frequency}
                      onValueChange={(value: any) => setDirectDeposit({ ...directDeposit, frequency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Deposit Method</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setDepositMethod("percentage")}
                        className={`p-3 rounded-lg border-2 text-center transition-colors ${
                          depositMethod === "percentage"
                            ? "border-red-600 bg-red-50 text-red-600"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-lg font-semibold">%</div>
                        <p className="text-sm font-medium">Percentage</p>
                      </button>
                      <button
                        onClick={() => setDepositMethod("fixed")}
                        className={`p-3 rounded-lg border-2 text-center transition-colors ${
                          depositMethod === "fixed"
                            ? "border-red-600 bg-red-50 text-red-600"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <DollarSign className="w-5 h-5 mx-auto" />
                        <p className="text-sm font-medium">Fixed Amount</p>
                      </button>
                    </div>
                  </div>

                  {depositMethod === "percentage" ? (
                    <div className="space-y-2">
                      <Label htmlFor="percentage">Percentage of Paycheck</Label>
                      <div className="relative">
                        <Input
                          id="percentage"
                          type="number"
                          min="1"
                          max="100"
                          value={directDeposit.percentage}
                          onChange={(e) =>
                            setDirectDeposit({ ...directDeposit, percentage: Number.parseInt(e.target.value) || 0 })
                          }
                          className="pr-8"
                          required
                        />
                        <span className="absolute right-3 top-3 text-gray-400">%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="fixed-amount">Fixed Amount per Paycheck</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="fixed-amount"
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={directDeposit.fixedAmount || ""}
                          onChange={(e) =>
                            setDirectDeposit({
                              ...directDeposit,
                              fixedAmount: Number.parseFloat(e.target.value) || undefined,
                            })
                          }
                          className="pl-10"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={directDeposit.startDate}
                      onChange={(e) => setDirectDeposit({ ...directDeposit, startDate: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                <Button
                  onClick={handleDirectDepositSetup}
                  disabled={isProcessing}
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  {isProcessing ? "Setting up..." : "Setup Direct Deposit"}
                </Button>
              </CardContent>
            </Card>

            {/* Account Information for Employer */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-base">Account Information for Employer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Account Holder:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Johnny Mercer</span>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard("Johnny Mercer")}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Bank Name:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Wells Fargo Bank</span>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard("Wells Fargo Bank")}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Routing Number:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">121000248</span>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard("121000248")}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Account Number:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">****6224</span>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard("1234567890")}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Account Type:</span>
                  <span className="text-sm">Checking</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
