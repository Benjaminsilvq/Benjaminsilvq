"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, Eye, Calendar, FileText } from "lucide-react"

interface StatementsProps {
  onBack: () => void
}

const statements = [
  {
    id: "2024-01",
    period: "January 2024",
    startDate: "01/01/2024",
    endDate: "01/31/2024",
    balance: 36000.0,
    transactions: 45,
    size: "2.3 MB",
  },
  {
    id: "2023-12",
    period: "December 2023",
    startDate: "12/01/2023",
    endDate: "12/31/2023",
    balance: 32450.75,
    transactions: 52,
    size: "2.8 MB",
  },
  {
    id: "2023-11",
    period: "November 2023",
    startDate: "11/01/2023",
    endDate: "11/30/2023",
    balance: 28900.25,
    transactions: 38,
    size: "2.1 MB",
  },
  {
    id: "2023-10",
    period: "October 2023",
    startDate: "10/01/2023",
    endDate: "10/31/2023",
    balance: 31200.0,
    transactions: 41,
    size: "2.4 MB",
  },
  {
    id: "2023-09",
    period: "September 2023",
    startDate: "09/01/2023",
    endDate: "09/30/2023",
    balance: 29750.5,
    transactions: 36,
    size: "2.0 MB",
  },
  {
    id: "2023-08",
    period: "August 2023",
    startDate: "08/01/2023",
    endDate: "08/31/2023",
    balance: 27300.25,
    transactions: 44,
    size: "2.6 MB",
  },
]

export function Statements({ onBack }: StatementsProps) {
  const [selectedYear, setSelectedYear] = useState("2024")
  const [viewType, setViewType] = useState<"monthly" | "quarterly" | "annual">("monthly")

  const filteredStatements = statements.filter((statement) => statement.period.includes(selectedYear))

  const handleDownload = (statement: any) => {
    alert(`Downloading ${statement.period} statement...`)
  }

  const handleView = (statement: any) => {
    alert(`Opening ${statement.period} statement for viewing...`)
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Statements</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Filters */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <Select value={viewType} onValueChange={(value: any) => setViewType(value)}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Statement Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Statement Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{filteredStatements.length}</p>
                <p className="text-sm text-gray-600">Available Statements</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  ${filteredStatements[0]?.balance.toLocaleString() || "0"}
                </p>
                <p className="text-sm text-gray-600">Latest Balance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statements List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Available Statements</h3>

          {filteredStatements.map((statement) => (
            <Card key={statement.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{statement.period}</h4>
                        <p className="text-sm text-gray-600">
                          {statement.startDate} - {statement.endDate}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">{statement.size}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-600">Ending Balance:</span>
                        <p className="font-semibold text-green-600">${statement.balance.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Transactions:</span>
                        <p className="font-semibold text-gray-900">{statement.transactions}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleView(statement)}
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        onClick={() => handleDownload(statement)}
                        size="sm"
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statement Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Statement Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Email statements</span>
                <input type="checkbox" defaultChecked className="text-red-600 focus:ring-red-600" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Paper statements</span>
                <input type="checkbox" className="text-red-600 focus:ring-red-600" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Monthly notifications</span>
                <input type="checkbox" defaultChecked className="text-red-600 focus:ring-red-600" />
              </label>
            </div>

            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Statement Delivery
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
