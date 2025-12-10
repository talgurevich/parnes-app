import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

// Use service role for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { projectId, filePath } = await request.json()

    if (!projectId || !filePath) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('excel-files')
      .download(filePath)

    if (downloadError) {
      console.error('Download error:', downloadError)
      await updateProjectStatus(projectId, 'error')
      return NextResponse.json({ error: 'Failed to download file' }, { status: 500 })
    }

    // Parse Excel
    const buffer = await fileData.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })

    // Extract data from each sheet
    const parsedData = parseBusinessPlan(workbook)

    // Delete existing data for this project before inserting new data
    await supabase.from('project_data').delete().eq('project_id', projectId)

    // Store parsed data
    for (const [dataType, data] of Object.entries(parsedData)) {
      await supabase.from('project_data').insert({
        project_id: projectId,
        data_type: dataType,
        data: data,
      })
    }

    // Update project status
    await updateProjectStatus(projectId, 'ready')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Parse error:', error)
    return NextResponse.json({ error: 'Failed to parse Excel' }, { status: 500 })
  }
}

async function updateProjectStatus(projectId: string, status: string) {
  await supabase
    .from('projects')
    .update({ status })
    .eq('id', projectId)
}

function parseBusinessPlan(workbook: XLSX.WorkBook) {
  const data: Record<string, unknown> = {}

  // Sheet 1: Business Model Analysis
  const modelSheet = workbook.Sheets['ניתוח מודל עסקי ופוטנציאל']
  if (modelSheet) {
    data.businessInfo = extractBusinessInfo(modelSheet)
    data.pricing = extractPricing(modelSheet)
    data.expenses = extractExpenses(modelSheet)
  }

  // Sheet 2: First Year Planning
  const year1Sheet = workbook.Sheets['תכנון שנה ראשונה']
  if (year1Sheet) {
    data.year1 = extractYearData(year1Sheet, 1)
    data.monthlyData = extractMonthlyData(year1Sheet)
  }

  // Sheet 3: Second Year Forecast
  const year2Sheet = workbook.Sheets['צפי שנה שניה']
  if (year2Sheet) {
    data.year2 = extractYearData(year2Sheet, 2)
  }

  // Sheet 5: Investments
  const investSheet = workbook.Sheets['השקעות']
  if (investSheet) {
    data.investments = extractInvestments(investSheet)
  }

  // Sheet 7: Performance Metrics
  const kpiSheet = workbook.Sheets['מדדי ביצועים']
  if (kpiSheet) {
    data.kpis = extractKPIs(kpiSheet)
    data.significantParameters = extractSignificantParams(kpiSheet)
  }

  return data
}

function extractBusinessInfo(sheet: XLSX.WorkSheet) {
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]

  return {
    name: getCellValue(json, 6, 4) || '',
    location: getCellValue(json, 7, 4) || '',
    openingDate: getCellValue(json, 8, 4) || null,
    legalEntity: getCellValue(json, 10, 4) || '',
    concept: getCellValue(json, 12, 3) || '',
    spaceGross: parseInteger(getCellValue(json, 6, 18)) || 0,
    spaceNet: parseInteger(getCellValue(json, 7, 18)) || 0,
  }
}

function extractPricing(sheet: XLSX.WorkSheet) {
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]

  const plans = []
  const rows = [22, 23, 24, 25] // Rows with pricing data

  for (const row of rows) {
    const name = getCellValue(json, row, 1)
    const sessions = parseInteger(getCellValue(json, row, 4))
    const price = parseInteger(getCellValue(json, row, 5))
    const percentage = parseNumber(getCellValue(json, row, 7), 1)

    if (name && price) {
      plans.push({
        name,
        sessionsPerMonth: sessions || 0,
        price,
        pricePerSession: sessions ? Math.round(price / sessions) : 0,
        customerPercentage: percentage || 0,
      })
    }
  }

  return {
    plans,
    averagePrice: parseNumber(getCellValue(json, 26, 5), 1) || 0,
    personalTraining: parseInteger(getCellValue(json, 42, 5)) || 0,
    clinicTreatment: parseInteger(getCellValue(json, 49, 5)) || 0,
  }
}

function extractExpenses(sheet: XLSX.WorkSheet) {
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]

  return {
    rent: parseInteger(getCellValue(json, 55, 6)) || 0,
    management: parseInteger(getCellValue(json, 56, 6)) || 0,
    propertyTax: parseInteger(getCellValue(json, 57, 6)) || 0,
    groupTrainers: parseInteger(getCellValue(json, 58, 6)) || 0,
    personalTrainers: parseInteger(getCellValue(json, 59, 6)) || 0,
    managementSystem: parseInteger(getCellValue(json, 61, 6)) || 0,
    insurance: parseInteger(getCellValue(json, 62, 6)) || 0,
  }
}

function extractYearData(sheet: XLSX.WorkSheet, year: number) {
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]

  return {
    year,
    revenue: parseInteger(getCellValue(json, 12, 29)) || 0,
    expenses: parseInteger(getCellValue(json, 38, 29)) || 0,
    operatingProfit: parseInteger(getCellValue(json, 39, 29)) || 0,
    customersStart: parseInteger(getCellValue(json, 5, 4)) || 0,
    customersEnd: parseInteger(getCellValue(json, 5, 26)) || 0,
    closingBalance: parseInteger(getCellValue(json, 62, 26)) || 0,
  }
}

function extractMonthlyData(sheet: XLSX.WorkSheet) {
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]
  const months = []

  for (let i = 0; i < 12; i++) {
    const col = 4 + i * 2
    months.push({
      month: i + 1,
      customers: parseInteger(getCellValue(json, 5, col)) || 0,
      revenueSubscription: parseInteger(getCellValue(json, 10, col)) || 0,
      revenuePersonal: parseInteger(getCellValue(json, 9, col)) || 0,
    })
  }

  return months
}

function extractInvestments(sheet: XLSX.WorkSheet) {
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]

  return {
    equipment: parseInteger(getCellValue(json, 18, 17)) || 0,
    renovation: parseInteger(getCellValue(json, 13, 17)) || 0,
    additional: parseInteger(getCellValue(json, 30, 17)) || 0,
    contingency: parseInteger(getCellValue(json, 42, 17)) || 0,
    total: parseInteger(getCellValue(json, 44, 17)) || 0,
  }
}

function extractKPIs(sheet: XLSX.WorkSheet) {
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]

  return {
    totalInvestment: parseInteger(getCellValue(json, 1, 2)) || 0,
    breakEvenCustomers: parseInteger(getCellValue(json, 3, 2)) || 0,
    breakEvenMonths: parseInteger(getCellValue(json, 5, 2)) || 0,
    roiYears: parseNumber(getCellValue(json, 9, 2), 2) || 0,
    year1Profit: parseInteger(getCellValue(json, 6, 2)) || 0,
    year2Profit: parseInteger(getCellValue(json, 7, 2)) || 0,
    year3Profit: parseInteger(getCellValue(json, 8, 2)) || 0,
  }
}

function extractSignificantParams(sheet: XLSX.WorkSheet) {
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]

  // Get year 3 profit to calculate monthly
  const year3Profit = parseInteger(getCellValue(json, 8, 2)) || 0
  const year3MonthlyProfit = year3Profit > 0 ? Math.round(year3Profit / 12) : 0

  return [
    {
      name: 'גיוס לקוחות פריסייל',
      value: parseInteger(getCellValue(json, 1, 7)) || 0,
      note: String(getCellValue(json, 1, 8) || ''),
      color: 'gray',
    },
    {
      name: 'קצב צמיחה MoM שנה ראשונה',
      value: parseNumber(getCellValue(json, 2, 7), 1) || 0,
      note: String(getCellValue(json, 2, 8) || ''),
      color: 'gray',
    },
    {
      name: 'ממוצע חודשי שעות אימון בעלים',
      value: parseInteger(getCellValue(json, 4, 7)) || 0,
      note: String(getCellValue(json, 4, 8) || ''),
      color: 'gray',
    },
    {
      name: 'שכירות למ"ר (כולל ניהול)',
      value: parseInteger(getCellValue(json, 5, 7)) || 0,
      note: String(getCellValue(json, 5, 8) || ''),
      color: 'gray',
    },
    {
      name: 'תקציב לפרויקט',
      value: parseInteger(getCellValue(json, 13, 2)) || 0,
      note: '',
      color: 'gray',
    },
    {
      name: 'רווח חודשי ממוצע (2 שנים)',
      value: parseInteger(getCellValue(json, 7, 7)) || 0,
      note: String(getCellValue(json, 7, 8) || ''),
      color: 'gray',
    },
    {
      name: 'צפי רווח חודשי - שנה שלישית',
      value: year3MonthlyProfit,
      note: '',
      color: 'gray',
    },
    {
      name: 'צפי ל-ROI מלא',
      value: parseNumber(getCellValue(json, 9, 2), 2) || 0,
      note: 'שנים',
      color: 'gray',
    },
  ]
}

function getCellValue(json: unknown[][], row: number, col: number): string | number | null {
  if (json[row] && json[row][col] !== undefined) {
    return json[row][col] as string | number
  }
  return null
}

function parseNumber(value: unknown, decimals?: number): number | null {
  if (value === null || value === undefined) return null
  let num: number
  if (typeof value === 'number') {
    num = value
  } else if (typeof value === 'string') {
    num = parseFloat(value.replace(/[^0-9.-]/g, ''))
    if (isNaN(num)) return null
  } else {
    return null
  }
  if (decimals !== undefined) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }
  return num
}

function parseInteger(value: unknown): number | null {
  const num = parseNumber(value)
  return num !== null ? Math.round(num) : null
}
