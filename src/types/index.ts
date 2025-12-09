// Custom Color Settings
export interface CustomColors {
  primary: string
  secondary: string
}

export const DEFAULT_COLORS: CustomColors = {
  primary: '#e94560',
  secondary: '#4ecdc4',
}

// Helper to generate color variants from a base color
export function generateColorVariants(hex: string) {
  // Lighten color
  const lighten = (hex: string, percent: number) => {
    const num = parseInt(hex.slice(1), 16)
    const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * percent))
    const g = Math.min(255, Math.floor(((num >> 8) & 0x00ff) + (255 - ((num >> 8) & 0x00ff)) * percent))
    const b = Math.min(255, Math.floor((num & 0x0000ff) + (255 - (num & 0x0000ff)) * percent))
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }

  // Darken color
  const darken = (hex: string, percent: number) => {
    const num = parseInt(hex.slice(1), 16)
    const r = Math.floor((num >> 16) * (1 - percent))
    const g = Math.floor(((num >> 8) & 0x00ff) * (1 - percent))
    const b = Math.floor((num & 0x0000ff) * (1 - percent))
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }

  return {
    base: hex,
    light: lighten(hex, 0.2),
    dark: darken(hex, 0.15),
  }
}

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
  color_primary: string | null
  color_secondary: string | null
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
