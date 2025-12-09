'use client'

import { useState } from 'react'
import { ColorPaletteId, COLOR_PALETTES, DEFAULT_PALETTE_ID } from '@/types'
import { PaletteProvider } from './PaletteProvider'
import { ColorPalettePicker } from '@/components/dashboard/ColorPalettePicker'
import { KeyMetrics } from './KeyMetrics'
import { InvestmentChart } from './InvestmentChart'
import { PricingTable } from './PricingTable'
import { ExpensesList } from './ExpensesList'
import { YearProjections } from './YearProjections'
import { SignificantParams } from './SignificantParams'
import { RevenueChart } from './RevenueChart'
import { GrowthChart } from './GrowthChart'

interface InfographicDisplayProps {
  projectId: string
  projectName: string
  initialPalette: ColorPaletteId | null
  businessInfo: Record<string, unknown>
  pricing: Record<string, unknown>
  expenses: Record<string, unknown>
  investments: Record<string, unknown>
  kpis: Record<string, unknown>
  significantParams: unknown[]
  year1: Record<string, unknown>
  year2: Record<string, unknown>
  monthlyData: unknown[]
  showPalettePicker?: boolean
}

export function InfographicDisplay({
  projectId,
  projectName,
  initialPalette,
  businessInfo,
  pricing,
  expenses,
  investments,
  kpis,
  significantParams,
  year1,
  year2,
  monthlyData,
  showPalettePicker = true,
}: InfographicDisplayProps) {
  const [currentPalette, setCurrentPalette] = useState<ColorPaletteId>(
    initialPalette || DEFAULT_PALETTE_ID
  )

  const palette = COLOR_PALETTES[currentPalette]

  return (
    <PaletteProvider paletteId={currentPalette}>
      <div className="space-y-8">
        {/* Business Header */}
        <div
          className="rounded-2xl p-8 text-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.primaryLight} 100%)`,
          }}
        >
          {showPalettePicker && (
            <div className="absolute top-4 left-4">
              <ColorPalettePicker
                projectId={projectId}
                currentPalette={currentPalette}
                onPaletteChange={setCurrentPalette}
              />
            </div>
          )}
          <h2 className="text-4xl font-bold mb-2">{String(businessInfo.name || projectName)}</h2>
          <p className="text-xl opacity-90">{String(businessInfo.concept || 'תוכנית עסקית')}</p>
          {Boolean(businessInfo.location) && (
            <p className="mt-4 bg-white/20 inline-block px-4 py-2 rounded-full">
              {String(businessInfo.location)}
            </p>
          )}
        </div>

        {/* Key Metrics */}
        <KeyMetrics
          totalInvestment={Number(investments.total) || 236500}
          spaceGross={Number(businessInfo.spaceGross) || 90}
          maxCapacity={58}
          monthsToBreakeven={Number(kpis.breakEvenMonths) || 12}
          roiYears={Number(kpis.roiYears) || 2.52}
          averagePrice={Number(pricing.averagePrice) || 607}
        />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Investment Chart */}
          <InvestmentChart
            equipment={Number(investments.equipment) || 110000}
            additional={Number(investments.additional) || 71500}
            contingency={Number(investments.contingency) || 30000}
            renovation={Number(investments.renovation) || 25000}
          />

          {/* Pricing Table */}
          <PricingTable
            plans={Array.isArray(pricing.plans) ? pricing.plans : []}
            personalTraining={Number(pricing.personalTraining) || 220}
            clinicTreatment={Number(pricing.clinicTreatment) || 350}
          />

          {/* Expenses */}
          <ExpensesList expenses={expenses as Record<string, number>} />

          {/* Growth Chart */}
          <GrowthChart monthlyData={monthlyData as { month: number; customers: number }[]} />
        </div>

        {/* Year Projections */}
        <YearProjections
          year1={year1 as Record<string, number>}
          year2={year2 as Record<string, number>}
          kpis={kpis as Record<string, number>}
        />

        {/* Revenue Chart */}
        <RevenueChart monthlyData={monthlyData as { month: number; revenueSubscription: number; revenuePersonal: number }[]} />

        {/* Significant Parameters */}
        <SignificantParams params={significantParams as { name: string; value: number; note?: string; color: string }[]} />

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/10 mt-8">
          <a
            href="https://www.errn.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Built by <span style={{ color: palette.primary }}>errn.io</span>
          </a>
        </div>
      </div>
    </PaletteProvider>
  )
}
