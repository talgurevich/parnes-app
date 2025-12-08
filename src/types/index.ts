export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  file_path: string
  original_filename: string | null
  status: 'processing' | 'ready' | 'error'
  created_at: string
  updated_at: string
}

export interface ProjectData {
  id: string
  project_id: string
  sheet_name: string | null
  data_type: string
  data: Record<string, unknown>
  created_at: string
}

// Parsed Excel Data Types
export interface BusinessInfo {
  name: string
  location: string
  concept: string
  openingDate: string | null
  legalEntity: string
  spaceGross: number
  spaceNet: number
}

export interface PricingPlan {
  name: string
  sessionsPerMonth: number
  price: number
  pricePerSession: number
  customerPercentage: number
}

export interface Expense {
  name: string
  amount: number
  unit?: string
}

export interface YearProjection {
  year: number
  revenue: number
  expenses: number
  customers: {
    start: number
    end: number
  }
  operatingProfit: number
  closingBalance: number
}

export interface Investment {
  category: string
  items: {
    name: string
    amount: number
  }[]
  total: number
  percentage: number
}

export interface SignificantParameter {
  name: string
  value: string | number
  note?: string
  color: 'green' | 'orange' | 'red'
}

export interface KPI {
  name: string
  value: string | number
  status?: 'success' | 'warning' | 'neutral'
}

export interface ParsedProjectData {
  businessInfo: BusinessInfo
  pricing: PricingPlan[]
  expenses: Expense[]
  yearProjections: YearProjection[]
  investments: Investment[]
  significantParameters: SignificantParameter[]
  kpis: KPI[]
  additionalServices: {
    personalTraining: number
    clinicTreatment: number
  }
  financing: {
    ownerInvestment: number
    loan: number
    monthlyLoanPayment: number
    totalFinancing: number
  }
  monthlyData: {
    month: number
    customers: number
    revenueSubscription: number
    revenuePersonal: number
  }[]
}
