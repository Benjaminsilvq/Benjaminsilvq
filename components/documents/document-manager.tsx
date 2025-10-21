"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import {
  ArrowLeft,
  Upload,
  File,
  FileText,
  ImageIcon,
  Camera,
  Scan,
  Download,
  Eye,
  Trash2,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  Folder,
  X,
} from "lucide-react"

interface Document {
  id: string
  name: string
  type: "pdf" | "image" | "text" | "statement" | "tax" | "identity" | "other"
  category: string
  size: number
  uploadDate: string
  status: "processing" | "completed" | "failed" | "pending_review"
  url?: string
  thumbnail?: string
  extractedText?: string
  metadata?: {
    pages?: number
    resolution?: string
    ocrConfidence?: number
    detectedFields?: Record<string, string>
  }
  tags: string[]
  isSecure: boolean
}

interface DocumentCategory {
  id: string
  name: string
  icon: any
  description: string
  acceptedTypes: string[]
  maxSize: number
  requiresReview: boolean
}

const documentCategories: DocumentCategory[] = [
  {
    id: "statements",
    name: "Bank Statements",
    icon: FileText,
    description: "Monthly account statements and transaction records",
    acceptedTypes: ["pdf", "image"],
    maxSize: 10 * 1024 * 1024, // 10MB
    requiresReview: false,
  },
  {
    id: "tax",
    name: "Tax Documents",
    icon: File,
    description: "W-2s, 1099s, tax returns, and related forms",
    acceptedTypes: ["pdf", "image"],
    maxSize: 25 * 1024 * 1024, // 25MB
    requiresReview: true,
  },
  {
    id: "identity",
    name: "Identity Verification",
    icon: Camera,
    description: "Driver's license, passport, social security card",
    acceptedTypes: ["image", "pdf"],
    maxSize: 5 * 1024 * 1024, // 5MB
    requiresReview: true,
  },
  {
    id: "loan",
    name: "Loan Documents",
    icon: FileText,
    description: "Loan applications, agreements, and supporting documents",
    acceptedTypes: ["pdf", "image"],
    maxSize: 50 * 1024 * 1024, // 50MB
    requiresReview: true,
  },
  {
    id: "receipts",
    name: "Receipts & Invoices",
    icon: ImageIcon,
    description: "Purchase receipts, invoices, and expense documentation",
    acceptedTypes: ["image", "pdf"],
    maxSize: 5 * 1024 * 1024, // 5MB
    requiresReview: false,
  },
  {
    id: "other",
    name: "Other Documents",
    icon: Folder,
    description: "Miscellaneous banking and financial documents",
    acceptedTypes: ["pdf", "image", "text"],
    maxSize: 20 * 1024 * 1024, // 20MB
    requiresReview: false,
  },
]

const sampleDocuments: Document[] = [
  {
    id: "1",
    name: "December_2023_Statement.pdf",
    type: "statement",
    category: "Bank Statements",
    size: 2.5 * 1024 * 1024,
    uploadDate: "2024-01-15T10:30:00Z",
    status: "completed",
    url: "/documents/statement.pdf",
    thumbnail: "/bank-statement-mockup.png",
    extractedText: "Wells Fargo Bank Statement - December 2023...",
    metadata: {
      pages: 8,
      ocrConfidence: 0.95,
      detectedFields: {
        accountNumber: "****6224",
        statementPeriod: "December 1-31, 2023",
        endingBalance: "$109,942.31",
      },
    },
    tags: ["statement", "2023", "december"],
    isSecure: true,
  },
  {
    id: "2",
    name: "W2_2023_VirginaTech.pdf",
    type: "tax",
    category: "Tax Documents",
    size: 1.2 * 1024 * 1024,
    uploadDate: "2024-02-01T14:20:00Z",
    status: "pending_review",
    url: "/documents/w2.pdf",
    thumbnail: "/w2-tax-form.jpg",
    extractedText: "Form W-2 Wage and Tax Statement 2023...",
    metadata: {
      pages: 1,
      ocrConfidence: 0.92,
      detectedFields: {
        employer: "Virginia Tech",
        wages: "$61,073.26",
        federalTax: "$8,245.12",
      },
    },
    tags: ["w2", "2023", "tax", "virginia-tech"],
    isSecure: true,
  },
  {
    id: "3",
    name: "drivers_license_front.jpg",
    type: "identity",
    category: "Identity Verification",
    size: 3.8 * 1024 * 1024,
    uploadDate: "2024-01-20T09:15:00Z",
    status: "completed",
    url: "/documents/license.jpg",
    thumbnail: "/drivers-license-mockup.png",
    extractedText: "Virginia Driver License...",
    metadata: {
      resolution: "2048x1536",
      ocrConfidence: 0.88,
      detectedFields: {
        name: "Johnny Mercer",
        licenseNumber: "V123456789",
        expirationDate: "12/25/2028",
      },
    },
    tags: ["license", "identity", "virginia"],
    isSecure: true,
  },
]

interface DocumentManagerProps {
  onBack: () => void
}

export function DocumentManager({ onBack }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments)
  const [activeTab, setActiveTab] = useState<"upload" | "manage" | "categories">("manage")
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "processing" | "pending_review">("all")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [showViewer, setShowViewer] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      if (selectedCategory) {
        processFile(file, selectedCategory)
      }
    })
  }

  const processFile = (file: File, category: DocumentCategory) => {
    const fileId = Date.now().toString()

    // Validate file type and size
    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    if (!category.acceptedTypes.includes(fileExtension || "")) {
      alert(`File type not supported for ${category.name}`)
      return
    }

    if (file.size > category.maxSize) {
      alert(`File size exceeds limit for ${category.name}`)
      return
    }

    // Create document entry
    const newDocument: Document = {
      id: fileId,
      name: file.name,
      type: fileExtension as any,
      category: category.name,
      size: file.size,
      uploadDate: new Date().toISOString(),
      status: "processing",
      tags: [],
      isSecure: category.requiresReview,
    }

    setDocuments((prev) => [newDocument, ...prev])
    setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }))

    // Simulate file upload and processing
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const currentProgress = prev[fileId] || 0
        const newProgress = Math.min(currentProgress + Math.random() * 20, 100)

        if (newProgress >= 100) {
          clearInterval(uploadInterval)

          // Simulate OCR and processing completion
          setTimeout(() => {
            setDocuments((prevDocs) =>
              prevDocs.map((doc) =>
                doc.id === fileId
                  ? {
                      ...doc,
                      status: category.requiresReview ? "pending_review" : "completed",
                      url: `/documents/${file.name}`,
                      thumbnail: `/placeholder.svg?height=100&width=100&query=${category.name}`,
                      extractedText: `Extracted text from ${file.name}...`,
                      metadata: {
                        pages: Math.floor(Math.random() * 10) + 1,
                        ocrConfidence: 0.85 + Math.random() * 0.15,
                        detectedFields: {
                          documentType: category.name,
                          uploadDate: new Date().toLocaleDateString(),
                        },
                      },
                    }
                  : doc,
              ),
            )
            setUploadProgress((prev) => {
              const { [fileId]: _, ...rest } = prev
              return rest
            })
          }, 1000)
        }

        return { ...prev, [fileId]: newProgress }
      })
    }, 200)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: Document["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "processing":
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />
      case "pending_review":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "failed":
        return <X className="w-4 h-4 text-red-600" />
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    if (filterStatus !== "all" && doc.status !== filterStatus) return false
    if (
      searchTerm &&
      !doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !doc.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false
    return true
  })

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <button onClick={onBack} className="text-foreground hover:text-primary">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-card-foreground">Document Manager</h1>
        <Scan className="w-6 h-6 text-primary" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border bg-card">
        {[
          { id: "manage", label: "Documents", icon: File },
          { id: "upload", label: "Upload", icon: Upload },
          { id: "categories", label: "Categories", icon: Folder },
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
        {activeTab === "manage" && (
          <>
            {/* Search and Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                {[
                  { id: "all", label: "All" },
                  { id: "completed", label: "Completed" },
                  { id: "processing", label: "Processing" },
                  { id: "pending_review", label: "Pending Review" },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setFilterStatus(filter.id as any)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filterStatus === filter.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Documents List */}
            <div className="space-y-3">
              {filteredDocuments.map((document) => (
                <Card key={document.id} className="p-4 border border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      {document.thumbnail ? (
                        <img
                          src={document.thumbnail || "/placeholder.svg"}
                          alt={document.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <FileText className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-card-foreground truncate">{document.name}</h4>
                          <p className="text-sm text-muted-foreground">{document.category}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{formatFileSize(document.size)}</span>
                            <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(document.status)}
                              <span className="capitalize">{document.status.replace("_", " ")}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedDocument(document)
                              setShowViewer(true)
                            }}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                            title="View document"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Progress bar for uploading documents */}
                      {uploadProgress[document.id] !== undefined && (
                        <div className="mt-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress[document.id]}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploading... {Math.round(uploadProgress[document.id])}%
                          </p>
                        </div>
                      )}

                      {/* Tags */}
                      {document.tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {document.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              {filteredDocuments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <File className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No documents found</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "upload" && (
          <>
            {/* Category Selection */}
            {!selectedCategory ? (
              <div className="space-y-4">
                <h3 className="font-semibold text-card-foreground">Select Document Category</h3>
                <div className="grid grid-cols-1 gap-3">
                  {documentCategories.map((category) => {
                    const Icon = category.icon
                    return (
                      <Card
                        key={category.id}
                        className="p-4 border border-border cursor-pointer hover:border-primary transition-colors"
                        onClick={() => setSelectedCategory(category)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-card-foreground">{category.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Max: {formatFileSize(category.maxSize)}</span>
                              <span>Types: {category.acceptedTypes.join(", ")}</span>
                              {category.requiresReview && <span className="text-yellow-600">Requires Review</span>}
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="font-semibold text-card-foreground">{selectedCategory.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedCategory.description}</p>
                  </div>
                </div>

                {/* Upload Area */}
                <Card
                  className={`p-8 border-2 border-dashed transition-colors ${
                    dragActive ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="text-center space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                    <div>
                      <h4 className="font-medium text-card-foreground">Drop files here or click to upload</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Supports {selectedCategory.acceptedTypes.join(", ")} files up to{" "}
                        {formatFileSize(selectedCategory.maxSize)}
                      </p>
                    </div>

                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                      >
                        Choose Files
                      </button>
                      <button
                        onClick={() => cameraInputRef.current?.click()}
                        className="px-4 py-2 border border-border rounded-lg font-medium text-card-foreground hover:bg-muted transition-colors"
                      >
                        <Camera className="w-4 h-4 mr-2 inline" />
                        Take Photo
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={selectedCategory.acceptedTypes.map((type) => `.${type}`).join(",")}
                      onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                      className="hidden"
                    />
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                      className="hidden"
                    />
                  </div>
                </Card>

                {selectedCategory.requiresReview && (
                  <Card className="p-4 border border-yellow-200 bg-yellow-50">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Review Required</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Documents in this category require manual review before processing. This may take 1-2 business
                          days.
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === "categories" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-card-foreground">Document Categories</h3>
            <div className="space-y-3">
              {documentCategories.map((category) => {
                const Icon = category.icon
                const categoryDocs = documents.filter((doc) => doc.category === category.name)

                return (
                  <Card key={category.id} className="p-4 border border-border">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-card-foreground">{category.name}</h4>
                          <span className="text-sm text-muted-foreground">{categoryDocs.length} documents</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Max: {formatFileSize(category.maxSize)}</span>
                          <span>Types: {category.acceptedTypes.join(", ")}</span>
                          {category.requiresReview && <span className="text-yellow-600">Review Required</span>}
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      {showViewer && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] bg-card border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-card-foreground">{selectedDocument.name}</h3>
              <button onClick={() => setShowViewer(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-96">
              {selectedDocument.thumbnail && (
                <img
                  src={selectedDocument.thumbnail || "/placeholder.svg"}
                  alt={selectedDocument.name}
                  className="w-full h-auto rounded-lg mb-4"
                />
              )}

              {selectedDocument.extractedText && (
                <div className="space-y-3">
                  <h4 className="font-medium text-card-foreground">Extracted Text</h4>
                  <div className="p-3 bg-muted rounded-lg text-sm text-card-foreground">
                    {selectedDocument.extractedText}
                  </div>
                </div>
              )}

              {selectedDocument.metadata?.detectedFields && (
                <div className="space-y-3 mt-4">
                  <h4 className="font-medium text-card-foreground">Detected Information</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedDocument.metadata.detectedFields).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                        <span className="font-medium text-card-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default DocumentManager
