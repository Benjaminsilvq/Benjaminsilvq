"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Eye,
  FileText,
  CreditCard,
  Building,
  User,
  DollarSign,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PendingProcessManagerProps {
  onBack: () => void
}

interface PendingProcess {
  id: string
  type: "check_deposit" | "wire_transfer" | "account_verification" | "loan_application" | "card_request" | "dispute"
  description: string
  amount: number
  status: "processing" | "pending_approval" | "awaiting_confirmation" | "under_review" | "completed" | "failed"
  submitted_date: string
  expected_completion: string
  reference_number: string
  details: Record<string, any>
}

export function PendingProcessManager({ onBack }: PendingProcessManagerProps) {
  const [processes, setProcesses] = useState<PendingProcess[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedProcess, setSelectedProcess] = useState<PendingProcess | null>(null)
  const [filter, setFilter] = useState<"all" | "processing" | "pending" | "completed">("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchPendingProcesses()
  }, [])

  const fetchPendingProcesses = async () => {
    try {
      const response = await fetch("/api/pending-processes?userId=current")
      const data = await response.json()
      setProcesses(data.pending_processes)
    } catch (error) {
      console.error("Failed to fetch pending processes:", error)
      toast({
        title: "Error",
        description: "Failed to load pending processes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshProcesses = async () => {
    setRefreshing(true)
    await fetchPendingProcesses()
    setRefreshing(false)
    toast({
      title: "Refreshed",
      description: "Pending processes updated successfully",
    })
  }

  const approveProcess = async (processId: string) => {
    try {
      const response = await fetch("/api/pending-processes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ processId, action: "approve", status: "completed" }),
      })

      if (response.ok) {
        setProcesses((prev) => prev.map((p) => (p.id === processId ? { ...p, status: "completed" as const } : p)))
        toast({
          title: "Process Approved",
          description: "The process has been completed successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve process",
        variant: "destructive",
      })
    }
  }

  const cancelProcess = async (processId: string) => {
    try {
      const response = await fetch("/api/pending-processes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ processId, action: "cancel", status: "failed" }),
      })

      if (response.ok) {
        setProcesses((prev) => prev.map((p) => (p.id === processId ? { ...p, status: "failed" as const } : p)))
        toast({
          title: "Process Cancelled",
          description: "The process has been cancelled",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel process",
        variant: "destructive",
      })
    }
  }

  const getProcessIcon = (type: PendingProcess["type"]) => {
    switch (type) {
      case "check_deposit":
        return CreditCard
      case "wire_transfer":
        return Building
      case "account_verification":
        return User
      case "loan_application":
        return DollarSign
      case "card_request":
        return CreditCard
      case "dispute":
        return AlertCircle
      default:
        return FileText
    }
  }

  const getStatusColor = (status: PendingProcess["status"]) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "pending_approval":
        return "bg-yellow-100 text-yellow-800"
      case "awaiting_confirmation":
        return "bg-orange-100 text-orange-800"
      case "under_review":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: PendingProcess["status"]) => {
    switch (status) {
      case "processing":
        return <Clock className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "failed":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const filteredProcesses = processes.filter((process) => {
    if (filter === "all") return true
    if (filter === "processing") return process.status === "processing" || process.status === "pending_approval"
    if (filter === "pending") return process.status === "awaiting_confirmation" || process.status === "under_review"
    if (filter === "completed") return process.status === "completed" || process.status === "failed"
    return true
  })

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending processes...</p>
        </div>
      </div>
    )
  }

  if (selectedProcess) {
    const Icon = getProcessIcon(selectedProcess.type)
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 bg-red-600 text-white">
          <button onClick={() => setSelectedProcess(null)} className="text-white hover:text-gray-200">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold">Process Details</h1>
        </div>

        <div className="p-4 space-y-4">
          {/* Process Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{selectedProcess.description}</h3>
                  <p className="text-sm text-gray-600">{selectedProcess.reference_number}</p>
                </div>
                <Badge className={getStatusColor(selectedProcess.status)}>
                  {getStatusIcon(selectedProcess.status)}
                  <span className="ml-1 capitalize">{selectedProcess.status.replace("_", " ")}</span>
                </Badge>
              </div>

              {selectedProcess.amount > 0 && (
                <div className="text-center py-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-2xl font-bold text-gray-900">${selectedProcess.amount.toLocaleString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Submitted</p>
                  <p className="text-sm text-gray-600">{new Date(selectedProcess.submitted_date).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedProcess.status === "completed" ? "bg-green-100" : "bg-blue-100"
                  }`}
                >
                  {selectedProcess.status === "completed" ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedProcess.status === "completed" ? "Completed" : "Expected Completion"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedProcess.expected_completion).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(selectedProcess.details).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-gray-600 capitalize">{key.replace("_", " ")}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          {selectedProcess.status !== "completed" && selectedProcess.status !== "failed" && (
            <div className="space-y-3">
              <Button
                onClick={() => approveProcess(selectedProcess.id)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve & Complete
              </Button>
              <Button
                onClick={() => cancelProcess(selectedProcess.id)}
                variant="outline"
                className="w-full border-red-600 text-red-600 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel Process
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 bg-red-600 text-white">
        <button onClick={onBack} className="text-white hover:text-gray-200">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Pending Processes</h1>
          <p className="text-sm text-red-100">{processes.length} total processes</p>
        </div>
        <button onClick={refreshProcesses} disabled={refreshing} className="text-white hover:text-gray-200">
          <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: "all", label: "All" },
            { id: "processing", label: "Processing" },
            { id: "pending", label: "Pending" },
            { id: "completed", label: "Completed" },
          ].map((filterOption) => (
            <Button
              key={filterOption.id}
              variant={filter === filterOption.id ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterOption.id as any)}
              className={`whitespace-nowrap ${filter === filterOption.id ? "bg-red-600 hover:bg-red-700" : ""}`}
            >
              {filterOption.label}
            </Button>
          ))}
        </div>

        {/* Processes List */}
        <div className="space-y-3">
          {filteredProcesses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No pending processes found</p>
              </CardContent>
            </Card>
          ) : (
            filteredProcesses.map((process) => {
              const Icon = getProcessIcon(process.type)
              return (
                <Card key={process.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-red-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900 truncate">{process.description}</h4>
                          <Badge className={`${getStatusColor(process.status)} text-xs`}>
                            {getStatusIcon(process.status)}
                            <span className="ml-1">{process.status.replace("_", " ")}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{process.reference_number}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Submitted: {new Date(process.submitted_date).toLocaleDateString()}</span>
                          {process.amount > 0 && (
                            <span className="font-medium">${process.amount.toLocaleString()}</span>
                          )}
                        </div>
                      </div>

                      <Button variant="ghost" size="sm" onClick={() => setSelectedProcess(process)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Quick Actions */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-800">Process Management</h4>
                <p className="text-sm text-green-700">Review and approve pending processes to complete transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
