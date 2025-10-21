"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Send, CheckCircle, Code, CreditCard, DollarSign, History } from "lucide-react"

interface APIResponse {
  status: number
  data: any
  timestamp: string
}

interface PaymentOrder {
  type: "ach" | "wire" | "check"
  amount: number
  direction: "credit" | "debit"
  currency: string
  originating_account_id: string
  receiving_account_id: string
  description?: string
}

export function APIIntegration() {
  const [apiKey, setApiKey] = useState("mt_test_key_12345")
  const [orgId, setOrgId] = useState("org_wells_fargo_demo")
  const [response, setResponse] = useState<APIResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const [paymentOrder, setPaymentOrder] = useState<PaymentOrder>({
    type: "ach",
    amount: 0,
    direction: "credit",
    currency: "USD",
    originating_account_id: "acc_12345",
    receiving_account_id: "acc_67890",
    description: "",
  })

  const modernTreasuryEndpoints = [
    {
      name: "Create Payment Order",
      method: "POST",
      endpoint: "/api/payment_orders",
      description: "Send ACH, Wire, or Check payments",
      curl: `curl --request POST \\
  -u ${orgId}:${apiKey} \\
  --url https://app.moderntreasury.com/api/payment_orders \\
  -H 'Content-Type: application/json' \\
  -d '{
    "type": "${paymentOrder.type}",
    "amount": ${paymentOrder.amount * 100},
    "direction": "${paymentOrder.direction}",
    "currency": "${paymentOrder.currency}",
    "originating_account_id": "${paymentOrder.originating_account_id}",
    "receiving_account_id": "${paymentOrder.receiving_account_id}",
    "description": "${paymentOrder.description}"
  }'`,
    },
    {
      name: "Get Transactions",
      method: "GET",
      endpoint: "/api/transactions",
      description: "Retrieve transaction history and reconciliation data",
      curl: `curl --request GET \\
  -u ${orgId}:${apiKey} \\
  --url https://app.moderntreasury.com/api/transactions?limit=25`,
    },
    {
      name: "Create Counterparty",
      method: "POST",
      endpoint: "/api/counterparties",
      description: "Create a new counterparty for payments",
      curl: `curl --request POST \\
  -u ${orgId}:${apiKey} \\
  --url https://app.moderntreasury.com/api/counterparties \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "Kenner, Bach & Ledeen",
    "accounts": [{
      "account_type": "checking",
      "routing_details": [{
        "routing_number_type": "aba",
        "routing_number": "026009593"
      }],
      "account_details": [{
        "account_number": "123456789"
      }]
    }]
  }'`,
    },
  ]

  const wellsFargoAPIs = [
    {
      name: "Account Balance",
      endpoint: "/api/accounts/balance",
      description: "Get real-time account balance",
      status: "Active",
    },
    {
      name: "Transaction History",
      endpoint: "/api/transactions",
      description: "Retrieve transaction history",
      status: "Active",
    },
    {
      name: "Bill Pay",
      endpoint: "/api/billpay",
      description: "Process bill payments",
      status: "Active",
    },
    {
      name: "Wire Transfer",
      endpoint: "/api/wire-transfer",
      description: "Initiate wire transfers",
      status: "Active",
    },
    {
      name: "Mobile Deposit",
      endpoint: "/api/mobile-deposit",
      description: "Process mobile check deposits",
      status: "Active",
    },
  ]

  const simulateAPICall = async (endpoint: any) => {
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    let mockData = {}

    if (endpoint.name === "Create Payment Order") {
      mockData = {
        id: `po_${Date.now()}`,
        status: "pending",
        type: paymentOrder.type,
        amount: paymentOrder.amount * 100,
        currency: paymentOrder.currency,
        direction: paymentOrder.direction,
        originating_account_id: paymentOrder.originating_account_id,
        receiving_account_id: paymentOrder.receiving_account_id,
        description: paymentOrder.description,
        created_at: new Date().toISOString(),
        expected_settlement_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      }
    } else if (endpoint.name === "Get Transactions") {
      mockData = {
        transactions: [
          {
            id: "txn_001",
            amount: 50000,
            currency: "USD",
            direction: "credit",
            type: "ach",
            status: "completed",
            description: "Salary Deposit",
            posted_at: "2024-01-15T10:30:00Z",
          },
          {
            id: "txn_002",
            amount: -2500,
            currency: "USD",
            direction: "debit",
            type: "ach",
            status: "completed",
            description: "Rent Payment",
            posted_at: "2024-01-14T14:20:00Z",
          },
        ],
        has_next_page: true,
        has_previous_page: false,
      }
    } else {
      mockData = {
        id: `${endpoint.name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
        message: `${endpoint.name} executed successfully`,
        details: {
          endpoint: endpoint.endpoint,
          method: endpoint.method || "GET",
          timestamp: new Date().toISOString(),
          processing_time: "1.2s",
        },
      }
    }

    const mockResponse: APIResponse = {
      status: 200,
      data: mockData,
      timestamp: new Date().toISOString(),
    }

    setResponse(mockResponse)
    setLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-red-600">Wells Fargo API Integration</h1>
        <p className="text-gray-600">
          Comprehensive banking API integration with Modern Treasury and Wells Fargo services
        </p>
      </div>

      <Tabs defaultValue="payment-orders" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payment-orders">Payment Orders</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="wells-fargo">Wells Fargo APIs</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="payment-orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Create Payment Order
              </CardTitle>
              <CardDescription>Send ACH, Wire, or Check payments using Modern Treasury API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="payment-type">Payment Type</Label>
                  <Select
                    value={paymentOrder.type}
                    onValueChange={(value: "ach" | "wire" | "check") =>
                      setPaymentOrder({ ...paymentOrder, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ach">ACH Transfer</SelectItem>
                      <SelectItem value="wire">Wire Transfer</SelectItem>
                      <SelectItem value="check">Check Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={paymentOrder.amount}
                    onChange={(e) =>
                      setPaymentOrder({ ...paymentOrder, amount: Number.parseFloat(e.target.value) || 0 })
                    }
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direction">Direction</Label>
                  <Select
                    value={paymentOrder.direction}
                    onValueChange={(value: "credit" | "debit") =>
                      setPaymentOrder({ ...paymentOrder, direction: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">Credit (Incoming)</SelectItem>
                      <SelectItem value="debit">Debit (Outgoing)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={paymentOrder.currency}
                    onValueChange={(value) => setPaymentOrder({ ...paymentOrder, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={paymentOrder.description}
                  onChange={(e) => setPaymentOrder({ ...paymentOrder, description: e.target.value })}
                  placeholder="Payment description"
                />
              </div>

              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{modernTreasuryEndpoints[0].curl}</pre>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => simulateAPICall(modernTreasuryEndpoints[0])}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {loading ? "Processing..." : "Create Payment Order"}
                </Button>
                <Button variant="outline" onClick={() => copyToClipboard(modernTreasuryEndpoints[0].curl)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy cURL
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Transaction History
              </CardTitle>
              <CardDescription>Retrieve transaction history and reconciliation data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{modernTreasuryEndpoints[1].curl}</pre>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => simulateAPICall(modernTreasuryEndpoints[1])}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <History className="h-4 w-4 mr-2" />
                  {loading ? "Fetching..." : "Get Transactions"}
                </Button>
                <Button variant="outline" onClick={() => copyToClipboard(modernTreasuryEndpoints[1].curl)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy cURL
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wells-fargo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Wells Fargo Banking APIs
              </CardTitle>
              <CardDescription>Native Wells Fargo API endpoints for banking operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {wellsFargoAPIs.map((api, index) => (
                  <Card key={index} className="border-l-4 border-l-red-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{api.name}</CardTitle>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {api.status}
                        </Badge>
                      </div>
                      <CardDescription>{api.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-100 p-3 rounded font-mono text-sm">{api.endpoint}</div>
                      <Button
                        className="mt-3 w-full bg-red-600 hover:bg-red-700"
                        onClick={() => simulateAPICall(api)}
                        disabled={loading}
                      >
                        <Code className="h-4 w-4 mr-2" />
                        Test Endpoint
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Configure your API credentials and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="org-id">Organization ID</Label>
                  <Input
                    id="org-id"
                    value={orgId}
                    onChange={(e) => setOrgId(e.target.value)}
                    placeholder="Enter your organization ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" placeholder="https://your-app.com/webhooks/modern-treasury" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input
                  id="support-email"
                  type="email"
                  defaultValue="echase_247@zohomail.com"
                  placeholder="Enter support email"
                />
              </div>

              <Button className="w-full bg-red-600 hover:bg-red-700">Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {response && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              API Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-4 rounded border">
              <pre className="text-sm overflow-x-auto">{JSON.stringify(response, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
