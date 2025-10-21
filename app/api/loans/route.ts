import { type NextRequest, NextResponse } from "next/server"

export interface Loan {
  id: string
  type: "home" | "auto" | "personal" | "student"
  name: string
  description: string
  interestRate: string
  minAmount: number
  maxAmount: number
  terms: string[]
  features: string[]
  requirements: string[]
}

const loans: Loan[] = [
  {
    id: "home-mortgage",
    type: "home",
    name: "Fixed-Rate Mortgage",
    description: "Predictable monthly payments with a fixed interest rate",
    interestRate: "6.5% - 7.5%",
    minAmount: 50000,
    maxAmount: 2000000,
    terms: ["15 years", "20 years", "30 years"],
    features: [
      "Fixed interest rate for the life of the loan",
      "Predictable monthly payments",
      "No prepayment penalties",
      "Online application and tracking",
    ],
    requirements: ["Credit score 620+", "Down payment 3-20%", "Debt-to-income ratio below 43%", "Proof of income"],
  },
  {
    id: "home-heloc",
    type: "home",
    name: "Home Equity Line of Credit (HELOC)",
    description: "Borrow against your home's equity with flexible access to funds",
    interestRate: "8.0% - 10.5%",
    minAmount: 10000,
    maxAmount: 500000,
    terms: ["10 years draw period", "20 years repayment"],
    features: [
      "Flexible borrowing up to your credit limit",
      "Interest-only payments during draw period",
      "No closing costs on lines up to $250,000",
      "Tax-deductible interest (consult tax advisor)",
    ],
    requirements: ["Credit score 680+", "Home equity 15%+", "Debt-to-income ratio below 43%", "Property appraisal"],
  },
  {
    id: "auto-new",
    type: "auto",
    name: "New Auto Loan",
    description: "Finance your new vehicle purchase",
    interestRate: "5.49% - 9.99%",
    minAmount: 5000,
    maxAmount: 100000,
    terms: ["36 months", "48 months", "60 months", "72 months"],
    features: [
      "Competitive rates for new vehicles",
      "Quick approval process",
      "No application fees",
      "Flexible payment options",
    ],
    requirements: ["Credit score 650+", "Proof of income", "Valid driver's license", "Auto insurance"],
  },
  {
    id: "auto-used",
    type: "auto",
    name: "Used Auto Loan",
    description: "Finance your pre-owned vehicle",
    interestRate: "6.49% - 11.99%",
    minAmount: 5000,
    maxAmount: 75000,
    terms: ["36 months", "48 months", "60 months"],
    features: [
      "Financing for vehicles up to 10 years old",
      "Same-day approval available",
      "No prepayment penalties",
      "Refinancing options",
    ],
    requirements: ["Credit score 620+", "Vehicle inspection", "Proof of income", "Auto insurance"],
  },
  {
    id: "personal-unsecured",
    type: "personal",
    name: "Personal Loan",
    description: "Unsecured loan for any purpose",
    interestRate: "7.49% - 23.99%",
    minAmount: 3000,
    maxAmount: 100000,
    terms: ["12 months", "24 months", "36 months", "48 months", "60 months", "84 months"],
    features: ["No collateral required", "Fixed interest rate", "Fast funding", "Use for any purpose"],
    requirements: ["Credit score 660+", "Stable income", "Debt-to-income ratio below 40%", "U.S. citizenship"],
  },
  {
    id: "student-undergraduate",
    type: "student",
    name: "Undergraduate Student Loan",
    description: "Private student loans for undergraduate education",
    interestRate: "4.99% - 12.99%",
    minAmount: 1000,
    maxAmount: 120000,
    terms: ["In-school deferment", "5-15 year repayment"],
    features: [
      "Covers up to 100% of school-certified costs",
      "No origination fees",
      "Multiple repayment options",
      "Cosigner release after 24 months",
    ],
    requirements: [
      "Enrolled at least half-time",
      "U.S. citizen or permanent resident",
      "Satisfactory academic progress",
      "Cosigner may be required",
    ],
  },
  {
    id: "student-graduate",
    type: "student",
    name: "Graduate Student Loan",
    description: "Private student loans for graduate and professional programs",
    interestRate: "5.49% - 13.49%",
    minAmount: 1000,
    maxAmount: 180000,
    terms: ["In-school deferment", "5-20 year repayment"],
    features: [
      "Higher borrowing limits for graduate students",
      "Competitive rates",
      "Flexible repayment terms",
      "No prepayment penalties",
    ],
    requirements: [
      "Enrolled in graduate program",
      "Good credit history",
      "Proof of enrollment",
      "May require cosigner",
    ],
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const loanId = searchParams.get("id")

  if (loanId) {
    const loan = loans.find((l) => l.id === loanId)
    if (!loan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 })
    }
    return NextResponse.json({ loan })
  }

  const filteredLoans = type ? loans.filter((l) => l.type === type) : loans

  return NextResponse.json({ loans: filteredLoans })
}

export async function POST(request: NextRequest) {
  try {
    const application = await request.json()

    console.log("[v0] Loan application received:", application)

    const applicationId = `app_loan_${Date.now()}`

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2500))

    const approved = Math.random() > 0.4 // 60% approval rate

    return NextResponse.json({
      success: true,
      applicationId,
      status: approved ? "approved" : "pending",
      message: approved
        ? "Your loan application has been approved!"
        : "Your application is being reviewed. We'll contact you within 2-3 business days.",
      approvedAmount: approved ? application.requestedAmount : null,
      interestRate: approved ? (Math.random() * 5 + 5).toFixed(2) + "%" : null,
    })
  } catch (error) {
    console.error("Loan application error:", error)
    return NextResponse.json({ error: "Failed to process application" }, { status: 500 })
  }
}
