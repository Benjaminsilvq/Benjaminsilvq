import { type NextRequest, NextResponse } from "next/server"

export interface MortgageCalculation {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  principalAmount: number
  amortizationSchedule: {
    month: number
    payment: number
    principal: number
    interest: number
    balance: number
  }[]
}

export interface LoanCalculation {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  apr: number
}

export async function POST(request: NextRequest) {
  try {
    const { type, ...params } = await request.json()

    switch (type) {
      case "mortgage":
        return calculateMortgage(params)
      case "auto-loan":
        return calculateAutoLoan(params)
      case "personal-loan":
        return calculatePersonalLoan(params)
      case "savings":
        return calculateSavings(params)
      default:
        return NextResponse.json({ error: "Invalid calculator type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Calculator error:", error)
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 })
  }
}

function calculateMortgage(params: {
  homePrice: number
  downPayment: number
  interestRate: number
  loanTerm: number
  propertyTax?: number
  homeInsurance?: number
  pmi?: number
}) {
  const { homePrice, downPayment, interestRate, loanTerm, propertyTax = 0, homeInsurance = 0, pmi = 0 } = params

  const principal = homePrice - downPayment
  const monthlyRate = interestRate / 100 / 12
  const numberOfPayments = loanTerm * 12

  // Calculate monthly payment (P&I)
  const monthlyPayment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

  const totalPayment = monthlyPayment * numberOfPayments
  const totalInterest = totalPayment - principal

  // Generate amortization schedule (first 12 months + yearly summary)
  const amortizationSchedule = []
  let balance = principal

  for (let month = 1; month <= Math.min(numberOfPayments, 360); month++) {
    const interestPayment = balance * monthlyRate
    const principalPayment = monthlyPayment - interestPayment
    balance -= principalPayment

    // Include first 12 months and then every 12th month
    if (month <= 12 || month % 12 === 0) {
      amortizationSchedule.push({
        month,
        payment: Math.round(monthlyPayment * 100) / 100,
        principal: Math.round(principalPayment * 100) / 100,
        interest: Math.round(interestPayment * 100) / 100,
        balance: Math.round(balance * 100) / 100,
      })
    }
  }

  const result: MortgageCalculation = {
    monthlyPayment: Math.round((monthlyPayment + propertyTax + homeInsurance + pmi) * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    principalAmount: principal,
    amortizationSchedule,
  }

  return NextResponse.json({ calculation: result })
}

function calculateAutoLoan(params: {
  vehiclePrice: number
  downPayment: number
  interestRate: number
  loanTerm: number
}) {
  const { vehiclePrice, downPayment, interestRate, loanTerm } = params

  const principal = vehiclePrice - downPayment
  const monthlyRate = interestRate / 100 / 12
  const numberOfPayments = loanTerm

  const monthlyPayment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

  const totalPayment = monthlyPayment * numberOfPayments
  const totalInterest = totalPayment - principal

  const result: LoanCalculation = {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    apr: interestRate,
  }

  return NextResponse.json({ calculation: result })
}

function calculatePersonalLoan(params: { loanAmount: number; interestRate: number; loanTerm: number }) {
  const { loanAmount, interestRate, loanTerm } = params

  const monthlyRate = interestRate / 100 / 12
  const numberOfPayments = loanTerm

  const monthlyPayment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

  const totalPayment = monthlyPayment * numberOfPayments
  const totalInterest = totalPayment - loanAmount

  const result: LoanCalculation = {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    apr: interestRate,
  }

  return NextResponse.json({ calculation: result })
}

function calculateSavings(params: {
  initialDeposit: number
  monthlyContribution: number
  interestRate: number
  years: number
}) {
  const { initialDeposit, monthlyContribution, interestRate, years } = params

  const monthlyRate = interestRate / 100 / 12
  const months = years * 12

  let balance = initialDeposit
  let totalContributions = initialDeposit
  let totalInterest = 0

  for (let month = 1; month <= months; month++) {
    const interest = balance * monthlyRate
    balance += interest + monthlyContribution
    totalContributions += monthlyContribution
    totalInterest += interest
  }

  return NextResponse.json({
    calculation: {
      finalBalance: Math.round(balance * 100) / 100,
      totalContributions: Math.round(totalContributions * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      years,
    },
  })
}
