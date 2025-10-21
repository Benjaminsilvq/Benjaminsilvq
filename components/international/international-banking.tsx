"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Globe, ArrowUpDown, TrendingUp, MapPin, Clock, Building2, Calculator } from "lucide-react"

interface ExchangeRate {
  currency: string
  rate: number
  change: number
  flag: string
  name: string
}

interface InternationalTransfer {
  id: string
  recipient: string
  country: string
  amount: number
  currency: string
  fee: number
  exchangeRate: number
  status: "pending" | "processing" | "completed"
  estimatedArrival: string
}

interface GlobalAccount {
  id: string
  country: string
  currency: string
  balance: number
  accountNumber: string
  routingCode: string
  type: "checking" | "savings"
  status: "active" | "pending" | "closed"
}

const exchangeRates: ExchangeRate[] = [
  { currency: "EUR", rate: 0.85, change: -0.02, flag: "🇪🇺", name: "Euro" },
  { currency: "GBP", rate: 0.73, change: 0.01, flag: "🇬🇧", name: "British Pound" },
  { currency: "JPY", rate: 110.25, change: -1.15, flag: "🇯🇵", name: "Japanese Yen" },
  { currency: "CAD", rate: 1.25, change: 0.03, flag: "🇨🇦", name: "Canadian Dollar" },
  { currency: "AUD", rate: 1.35, change: -0.01, flag: "🇦🇺", name: "Australian Dollar" },
  { currency: "CHF", rate: 0.92, change: 0.02, flag: "🇨🇭", name: "Swiss Franc" },
  { currency: "CNY", rate: 6.45, change: -0.08, flag: "🇨🇳", name: "Chinese Yuan" },
  { currency: "INR", rate: 74.5, change: 0.25, flag: "🇮🇳", name: "Indian Rupee" },
]

const globalAccounts: GlobalAccount[] = [
  {
    id: "1",
    country: "United Kingdom",
    currency: "GBP",
    balance: 15420.5,
    accountNumber: "GB29NWBK60161331926819",
    routingCode: "NWBKGB2L",
    type: "checking",
    status: "active",
  },
  {
    id: "2",
    country: "Germany",
    currency: "EUR",
    balance: 8750.25,
    accountNumber: "DE89370400440532013000",
    routingCode: "COBADEFFXXX",
    type: "savings",
    status: "active",
  },
  {
    id: "3",
    country: "Japan",
    currency: "JPY",
    balance: 1250000,
    accountNumber: "JP1234567890123456",
    routingCode: "BOTKJPJT",
    type: "checking",
    status: "pending",
  },
]

interface InternationalBankingProps {
  onBack: () => void
}

export function InternationalBanking({ onBack }: InternationalBankingProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "exchange" | "transfer" | "accounts">("overview")
  const [selectedCurrency, setSelectedCurrency] = useState<ExchangeRate | null>(null)
  const [transferAmount, setTransferAmount] = useState("")
  const [transferCurrency, setTransferCurrency] = useState("USD")
  const [recipientCountry, setRecipientCountry] = useState("")
  const [transfers, setTransfers] = useState<InternationalTransfer[]>([])
  const [showCalculator, setShowCalculator] = useState(false)

  useEffect(() => {
    // Simulate real-time exchange rate updates
    const interval = setInterval(() => {
      // Update rates with small random changes
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const calculateTransferFee = (amount: number, currency: string) => {
    const baseFee = 15
    const percentageFee = amount * 0.005 // 0.5%
    return Math.max(baseFee, percentageFee)
  }

  const handleTransfer = () => {
    if (!transferAmount || !recipientCountry) return

    const amount = Number.parseFloat(transferAmount)
    const rate = exchangeRates.find((r) => r.currency === transferCurrency)?.rate || 1
    const fee = calculateTransferFee(amount, transferCurrency)

    const newTransfer: InternationalTransfer = {
      id: Date.now().toString(),
      recipient: "International Recipient",
      country: recipientCountry,
      amount,
      currency: transferCurrency,
      fee,
      exchangeRate: rate,
      status: "pending",
      estimatedArrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    }

    setTransfers((prev) => [newTransfer, ...prev])
    setTransferAmount("")
    setRecipientCountry("")
    alert("International transfer initiated successfully!")
  }

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <button onClick={onBack} className="text-foreground hover:text-primary">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-card-foreground">International Banking</h1>
        <Globe className="w-6 h-6 text-primary" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border bg-card">
        {[
          { id: "overview", label: "Overview", icon: Globe },
          { id: "exchange", label: "Exchange", icon: TrendingUp },
          { id: "transfer", label: "Transfer", icon: ArrowUpDown },
          { id: "accounts", label: "Accounts", icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-2 flex flex-col items-center gap-1 text-xs ${
                activeTab === tab.id ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="p-4 space-y-4">
        {activeTab === "overview" && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-card-foreground">Global Accounts</span>
                </div>
                <div className="text-2xl font-bold text-card-foreground">{globalAccounts.length}</div>
                <div className="text-xs text-muted-foreground">Active worldwide</div>
              </Card>

              <Card className="p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpDown className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-card-foreground">Transfers</span>
                </div>
                <div className="text-2xl font-bold text-card-foreground">{transfers.length}</div>
                <div className="text-xs text-muted-foreground">This month</div>
              </Card>
            </div>

            {/* Recent Exchange Rates */}
            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-card-foreground">Live Exchange Rates</h3>
                <button
                  onClick={() => setShowCalculator(!showCalculator)}
                  className="text-primary hover:text-primary/80"
                >
                  <Calculator className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {exchangeRates.slice(0, 4).map((rate) => (
                  <div key={rate.currency} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{rate.flag}</span>
                      <div>
                        <div className="font-medium text-card-foreground">{rate.currency}</div>
                        <div className="text-xs text-muted-foreground">{rate.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-card-foreground">{rate.rate.toFixed(4)}</div>
                      <div className={`text-xs ${rate.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {rate.change >= 0 ? "+" : ""}
                        {rate.change.toFixed(3)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Transfers */}
            {transfers.length > 0 && (
              <Card className="p-4 border border-border">
                <h3 className="font-semibold text-card-foreground mb-3">Recent Transfers</h3>
                <div className="space-y-3">
                  {transfers.slice(0, 3).map((transfer) => (
                    <div
                      key={transfer.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            transfer.status === "completed"
                              ? "bg-green-500"
                              : transfer.status === "processing"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                          }`}
                        />
                        <div>
                          <div className="font-medium text-card-foreground">{transfer.country}</div>
                          <div className="text-xs text-muted-foreground">{transfer.status}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-card-foreground">
                          {transfer.amount.toFixed(2)} {transfer.currency}
                        </div>
                        <div className="text-xs text-muted-foreground">Fee: ${transfer.fee.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}

        {activeTab === "exchange" && (
          <>
            <Card className="p-4 border border-border">
              <h3 className="font-semibold text-card-foreground mb-3">Currency Exchange Rates</h3>
              <div className="space-y-3">
                {exchangeRates.map((rate) => (
                  <div
                    key={rate.currency}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => setSelectedCurrency(rate)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{rate.flag}</span>
                      <div>
                        <div className="font-medium text-card-foreground">{rate.currency}</div>
                        <div className="text-sm text-muted-foreground">{rate.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-card-foreground">
                        1 USD = {rate.rate.toFixed(4)} {rate.currency}
                      </div>
                      <div
                        className={`text-sm flex items-center gap-1 ${rate.change >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        <TrendingUp className={`w-3 h-3 ${rate.change < 0 ? "rotate-180" : ""}`} />
                        {rate.change >= 0 ? "+" : ""}
                        {rate.change.toFixed(3)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {showCalculator && (
              <Card className="p-4 border border-border">
                <h3 className="font-semibold text-card-foreground mb-3">Currency Calculator</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-card-foreground">Amount (USD)</label>
                    <input
                      type="number"
                      className="w-full mt-1 p-2 border border-border rounded-lg bg-background text-foreground"
                      placeholder="Enter amount"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground">Convert to</label>
                    <select
                      className="w-full mt-1 p-2 border border-border rounded-lg bg-background text-foreground"
                      value={transferCurrency}
                      onChange={(e) => setTransferCurrency(e.target.value)}
                    >
                      {exchangeRates.map((rate) => (
                        <option key={rate.currency} value={rate.currency}>
                          {rate.flag} {rate.currency} - {rate.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {transferAmount && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-lg font-bold text-card-foreground">
                        ${transferAmount} USD ={" "}
                        {(
                          Number.parseFloat(transferAmount) *
                          (exchangeRates.find((r) => r.currency === transferCurrency)?.rate || 1)
                        ).toFixed(2)}{" "}
                        {transferCurrency}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Exchange rate: 1 USD ={" "}
                        {exchangeRates.find((r) => r.currency === transferCurrency)?.rate.toFixed(4)} {transferCurrency}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </>
        )}

        {activeTab === "transfer" && (
          <>
            <Card className="p-4 border border-border">
              <h3 className="font-semibold text-card-foreground mb-3">International Wire Transfer</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-card-foreground">Transfer Amount</label>
                  <input
                    type="number"
                    className="w-full mt-1 p-3 border border-border rounded-lg bg-background text-foreground"
                    placeholder="Enter amount"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-card-foreground">Currency</label>
                  <select
                    className="w-full mt-1 p-3 border border-border rounded-lg bg-background text-foreground"
                    value={transferCurrency}
                    onChange={(e) => setTransferCurrency(e.target.value)}
                  >
                    <option value="USD">🇺🇸 USD - US Dollar</option>
                    {exchangeRates.map((rate) => (
                      <option key={rate.currency} value={rate.currency}>
                        {rate.flag} {rate.currency} - {rate.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-card-foreground">Recipient Country</label>
                  <select
                    className="w-full mt-1 p-3 border border-border rounded-lg bg-background text-foreground"
                    value={recipientCountry}
                    onChange={(e) => setRecipientCountry(e.target.value)}
                  >
                    <option value="">Select country</option>
                    <option value="United Kingdom">🇬🇧 United Kingdom</option>
                    <option value="Germany">🇩🇪 Germany</option>
                    <option value="France">🇫🇷 France</option>
                    <option value="Japan">🇯🇵 Japan</option>
                    <option value="Canada">🇨🇦 Canada</option>
                    <option value="Australia">🇦🇺 Australia</option>
                    <option value="Switzerland">🇨🇭 Switzerland</option>
                    <option value="China">🇨🇳 China</option>
                    <option value="India">🇮🇳 India</option>
                  </select>
                </div>

                {transferAmount && recipientCountry && (
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Transfer Amount:</span>
                      <span className="font-medium text-card-foreground">
                        {transferAmount} {transferCurrency}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Transfer Fee:</span>
                      <span className="font-medium text-card-foreground">
                        ${calculateTransferFee(Number.parseFloat(transferAmount), transferCurrency).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Exchange Rate:</span>
                      <span className="font-medium text-card-foreground">
                        1 USD ={" "}
                        {exchangeRates.find((r) => r.currency === transferCurrency)?.rate.toFixed(4) || "1.0000"}{" "}
                        {transferCurrency}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-border">
                      <span className="font-medium text-card-foreground">Total Cost:</span>
                      <span className="font-bold text-card-foreground">
                        $
                        {(
                          Number.parseFloat(transferAmount) +
                          calculateTransferFee(Number.parseFloat(transferAmount), transferCurrency)
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <Clock className="w-4 h-4" />
                      <span>Estimated arrival: 1-2 business days</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleTransfer}
                  disabled={!transferAmount || !recipientCountry}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                >
                  Send International Transfer
                </button>
              </div>
            </Card>

            {/* Transfer History */}
            {transfers.length > 0 && (
              <Card className="p-4 border border-border">
                <h3 className="font-semibold text-card-foreground mb-3">Transfer History</h3>
                <div className="space-y-3">
                  {transfers.map((transfer) => (
                    <div key={transfer.id} className="p-3 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              transfer.status === "completed"
                                ? "bg-green-500"
                                : transfer.status === "processing"
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                            }`}
                          />
                          <span className="font-medium text-card-foreground">{transfer.country}</span>
                        </div>
                        <span className="text-sm text-muted-foreground capitalize">{transfer.status}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium text-card-foreground">
                          {transfer.amount.toFixed(2)} {transfer.currency}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fee:</span>
                        <span className="font-medium text-card-foreground">${transfer.fee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Est. Arrival:</span>
                        <span className="font-medium text-card-foreground">{transfer.estimatedArrival}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}

        {activeTab === "accounts" && (
          <>
            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-card-foreground">Global Accounts</h3>
                <button className="text-primary hover:text-primary/80 text-sm font-medium">+ Open New Account</button>
              </div>
              <div className="space-y-4">
                {globalAccounts.map((account) => (
                  <div key={account.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium text-card-foreground">{account.country}</div>
                          <div className="text-sm text-muted-foreground capitalize">{account.type} account</div>
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          account.status === "active"
                            ? "bg-green-100 text-green-800"
                            : account.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {account.status}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Balance:</span>
                        <span className="font-bold text-card-foreground">
                          {account.balance.toLocaleString()} {account.currency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account Number:</span>
                        <span className="font-mono text-card-foreground">{account.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Routing/SWIFT:</span>
                        <span className="font-mono text-card-foreground">{account.routingCode}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 py-2 px-3 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors">
                        Transfer
                      </button>
                      <button className="flex-1 py-2 px-3 border border-border rounded text-sm font-medium text-card-foreground hover:bg-muted transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Account Opening */}
            <Card className="p-4 border border-border">
              <h3 className="font-semibold text-card-foreground mb-3">Open New Global Account</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { country: "Singapore", currency: "SGD", flag: "🇸🇬" },
                  { country: "Hong Kong", currency: "HKD", flag: "🇭🇰" },
                  { country: "Mexico", currency: "MXN", flag: "🇲🇽" },
                  { country: "Brazil", currency: "BRL", flag: "🇧🇷" },
                ].map((option) => (
                  <button
                    key={option.country}
                    className="p-3 border border-border rounded-lg text-left hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{option.flag}</span>
                      <span className="font-medium text-card-foreground">{option.country}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{option.currency} Account</div>
                  </button>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

export default InternationalBanking
