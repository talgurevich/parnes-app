// Color Palette Types
export type ColorPaletteId = 'rose-teal' | 'ocean-blue' | 'sunset-orange' | 'forest-green' | 'purple-gold' | 'monochrome'

export interface ColorPalette {
  id: ColorPaletteId
  name: string
  nameHe: string
  primary: string
  primaryLight: string
  primaryDark: string
  secondary: string
  secondaryLight: string
  secondaryDark: string
  background: string
  backgroundLight: string
  backgroundDark: string
}

export const COLOR_PALETTES: Record<ColorPaletteId, ColorPalette> = {
  'rose-teal': {
    id: 'rose-teal',
    name: 'Rose & Teal',
    nameHe: 'ורוד וטורקיז',
    primary: '#e94560',
    primaryLight: '#ff6b6b',
    primaryDark: '#c73e54',
    secondary: '#4ecdc4',
    secondaryLight: '#6ee7df',
    secondaryDark: '#44a08d',
    background: '#1a1a2e',
    backgroundLight: '#16213e',
    backgroundDark: '#0f3460',
  },
  'ocean-blue': {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    nameHe: 'כחול אוקיינוס',
    primary: '#0077b6',
    primaryLight: '#00b4d8',
    primaryDark: '#023e8a',
    secondary: '#90e0ef',
    secondaryLight: '#caf0f8',
    secondaryDark: '#48cae4',
    background: '#03045e',
    backgroundLight: '#0a1647',
    backgroundDark: '#020230',
  },
  'sunset-orange': {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    nameHe: 'כתום שקיעה',
    primary: '#ff6b35',
    primaryLight: '#ff8c5a',
    primaryDark: '#e55a2b',
    secondary: '#ffc857',
    secondaryLight: '#ffe066',
    secondaryDark: '#e6b34d',
    background: '#2d1b2e',
    backgroundLight: '#3d2a3e',
    backgroundDark: '#1a0f1a',
  },
  'forest-green': {
    id: 'forest-green',
    name: 'Forest Green',
    nameHe: 'ירוק יער',
    primary: '#2d6a4f',
    primaryLight: '#40916c',
    primaryDark: '#1b4332',
    secondary: '#95d5b2',
    secondaryLight: '#b7e4c7',
    secondaryDark: '#74c69d',
    background: '#081c15',
    backgroundLight: '#1b3a2f',
    backgroundDark: '#040d0a',
  },
  'purple-gold': {
    id: 'purple-gold',
    name: 'Purple & Gold',
    nameHe: 'סגול וזהב',
    primary: '#7b2cbf',
    primaryLight: '#9d4edd',
    primaryDark: '#5a189a',
    secondary: '#ffd700',
    secondaryLight: '#ffe44d',
    secondaryDark: '#ccac00',
    background: '#240046',
    backgroundLight: '#3c096c',
    backgroundDark: '#10002b',
  },
  'monochrome': {
    id: 'monochrome',
    name: 'Monochrome',
    nameHe: 'מונוכרום',
    primary: '#ffffff',
    primaryLight: '#f0f0f0',
    primaryDark: '#d0d0d0',
    secondary: '#808080',
    secondaryLight: '#a0a0a0',
    secondaryDark: '#606060',
    background: '#1a1a1a',
    backgroundLight: '#2a2a2a',
    backgroundDark: '#0a0a0a',
  },
}

export const DEFAULT_PALETTE_ID: ColorPaletteId = 'rose-teal'

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
  color_palette: ColorPaletteId | null
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
