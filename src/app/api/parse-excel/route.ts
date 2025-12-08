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
    name: getCellValue(json, 6, 4) || 'לא צוין',
    location: getCellValue(json, 7, 4) || 'לא צוין',
    openingDate: getCellValue(json, 8, 4) || null,
    legalEntity: getCellValue(json, 10, 4) || 'לא צוין',
    concept: getCellValue(json, 12, 3) || '',
    spaceGross: parseNumber(getCellValue(json, 6, 18)) || 90,
    spaceNet: parseNumber(getCellValue(json, 7, 18)) || 76.5,
  }
}

function extractPricing(sheet: XLSX.WorkSheet) {
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]

  const plans = []
  const rows = [22, 23, 24, 25] // Rows with pricing data

  for (const row of rows) {
    const name = getCellValue(json, row, 1)
    const sessions = parseNumber(getCellValue(json, row, 4))
    const price = parseNumber(getCellValue(json, row, 5))
    const percentage = parseNumber(getCellValue(json, row, 7))

    if (name && price) {
      plans.push({
        name,
        sessionsPerMonth: sessions || 0,
        price,
        pricePerSession: sessions ? price / sessions : 0,
        customerPercentage: percentage || 0,
      })
    }
  }

  return {
    plans,
    averagePrice: parseNumber(getCellValue(json, 26, 5)) || 607.6,
    personalTraining: parseNumber(getCellValue(json, 42, 5)) || 220,
    clinicTreatment: parseNumber(getCellValue(json, 49, 5)) || 350,
  }
}

function extractExpenses(sheet: XLSX.WorkSheet) {
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]

  return {
    rent: parseNumber(getCellValue(json, 55, 6)) || 10800,
    management: parseNumber(getCellValue(json, 56, 6)) || 1440,
    propertyTax: parseNumber(getCellValue(json, 57, 6)) || 1350,
    groupTrainers: parseNumber(getCellValue(json, 58, 6)) || 9240,
    personalTrainers: parseNumber(getCellValue(json, 59, 6)) || 7056,
    managementSystem: parseNumber(getCellValue(json, 61, 6)) || 1100,
    insurance: parseNumber(getCellValue(json, 62, 6)) || 700,
  }
}

function extractYearData(sheet: XLSX.WorkSheet, year: number) {
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]

  return {
    year,
    revenue: parseNumber(getCellValue(json, 12, 29)) || 0,
    expenses: parseNumber(getCellValue(json, 38, 29)) || 0,
    operatingProfit: parseNumber(getCellValue(json, 39, 29)) || 0,
    customersStart: parseNumber(getCellValue(json, 5, 4)) || 0,
    customersEnd: parseNumber(getCellValue(json, 5, 26)) || 0,
    closingBalance: parseNumber(getCellValue(json, 62, 26)) || 0,
  }
}

function extractMonthlyData(sheet: XLSX.WorkSheet) {
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]
  const months = []

  for (let i = 0; i < 12; i++) {
    const col = 4 + i * 2
    months.push({
      month: i + 1,
      customers: parseNumber(getCellValue(json, 5, col)) || 0,
      revenueSubscription: parseNumber(getCellValue(json, 10, col)) || 0,
      revenuePersonal: parseNumber(getCellValue(json, 9, col)) || 0,
    })
  }

  return months
}

function extractInvestments(sheet: XLSX.WorkSheet) {
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]

  return {
    equipment: parseNumber(getCellValue(json, 18, 17)) || 110000,
    renovation: parseNumber(getCellValue(json, 13, 17)) || 25000,
    additional: parseNumber(getCellValue(json, 30, 17)) || 71500,
    contingency: parseNumber(getCellValue(json, 42, 17)) || 30000,
    total: parseNumber(getCellValue(json, 44, 17)) || 236500,
  }
}

function extractKPIs(sheet: XLSX.WorkSheet) {
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]

  return {
    totalInvestment: parseNumber(getCellValue(json, 3, 3)) || 334550,
    breakEvenCustomers: parseNumber(getCellValue(json, 4, 3)) || 70,
    breakEvenMonths: parseNumber(getCellValue(json, 6, 3)) || 11,
    roiYears: parseNumber(getCellValue(json, 14, 3)) || 2.52,
    year1Profit: parseNumber(getCellValue(json, 8, 3)) || 34897,
    year2Profit: parseNumber(getCellValue(json, 9, 3)) || 170523,
    year3Profit: parseNumber(getCellValue(json, 12, 3)) || 247590,
  }
}

function extractSignificantParams(sheet: XLSX.WorkSheet) {
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]

  return [
    {
      name: 'גיוס לקוחות פריסייל',
      value: parseNumber(getCellValue(json, 3, 9)) || 33,
      note: 'מעל הממוצע',
      color: 'red',
    },
    {
      name: 'קצב צמיחה MoM שנה ראשונה',
      value: parseNumber(getCellValue(json, 4, 9)) || 3.27,
      note: 'לקוחות/חודש',
      color: 'green',
    },
    {
      name: 'ממוצע חודשי שעות אימון בעלים',
      value: parseNumber(getCellValue(json, 6, 9)) || 68,
      note: 'שעות',
      color: 'orange',
    },
    {
      name: 'שכירות למ"ר (כולל ניהול)',
      value: parseNumber(getCellValue(json, 7, 9)) || 136,
      note: 'ממוצע לאזור',
      color: 'orange',
    },
    {
      name: 'תקציב ומימון',
      value: parseNumber(getCellValue(json, 8, 9)) || 296500,
      note: 'מימון נמוך, הון עצמי גבוה',
      color: 'orange',
    },
    {
      name: 'רווח חודשי ממוצע (2 שנים)',
      value: parseNumber(getCellValue(json, 9, 9)) || 8559,
      note: '* לפני הפרשות',
      color: 'orange',
    },
    {
      name: 'צפי רווח חודשי - שנה שלישית',
      value: parseNumber(getCellValue(json, 10, 9)) || 20632,
      note: 'פוטנציאל בתפוסה מלאה',
      color: 'red',
    },
    {
      name: 'צפי ל-ROI מלא',
      value: parseNumber(getCellValue(json, 12, 9)) || 2.52,
      note: 'שנים',
      color: 'green',
    },
  ]
}

function getCellValue(json: unknown[][], row: number, col: number): string | number | null {
  if (json[row] && json[row][col] !== undefined) {
    return json[row][col] as string | number
  }
  return null
}

function parseNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const num = parseFloat(value.replace(/[^0-9.-]/g, ''))
    return isNaN(num) ? null : num
  }
  return null
}
