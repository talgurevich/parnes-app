import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ShareButton } from '@/components/dashboard/ShareButton'
import { KeyMetrics } from '@/components/infographic/KeyMetrics'
import { InvestmentChart } from '@/components/infographic/InvestmentChart'
import { PricingTable } from '@/components/infographic/PricingTable'
import { ExpensesList } from '@/components/infographic/ExpensesList'
import { YearProjections } from '@/components/infographic/YearProjections'
import { SignificantParams } from '@/components/infographic/SignificantParams'
import { RevenueChart } from '@/components/infographic/RevenueChart'
import { GrowthChart } from '@/components/infographic/GrowthChart'

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch project (shared between authorized users)
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (!project) notFound()

  // Fetch project data
  const { data: projectData } = await supabase
    .from('project_data')
    .select('*')
    .eq('project_id', id)

  // Organize data by type
  const data: Record<string, unknown> = {}
  projectData?.forEach((item) => {
    data[item.data_type] = item.data
  })

  const businessInfo = data.businessInfo as Record<string, unknown> || {}
  const pricing = data.pricing as Record<string, unknown> || {}
  const expenses = data.expenses as Record<string, unknown> || {}
  const investments = data.investments as Record<string, unknown> || {}
  const kpis = data.kpis as Record<string, unknown> || {}
  const significantParams = data.significantParameters as unknown[] || []
  const year1 = data.year1 as Record<string, unknown> || {}
  const year2 = data.year2 as Record<string, unknown> || {}
  const monthlyData = data.monthlyData as unknown[] || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm mb-2 inline-block">
            ← חזרה לפרויקטים
          </Link>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          {project.description && (
            <p className="text-gray-400 mt-1">{project.description}</p>
          )}
        </div>
        {project.status === 'ready' && (
          <ShareButton projectId={project.id} publicSlug={project.public_slug} />
        )}
      </div>

      {project.status !== 'ready' ? (
        <div className="text-center py-16">
          {project.status === 'processing' ? (
            <>
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold">מעבד את הקובץ...</h2>
              <p className="text-gray-400">זה עשוי לקחת כמה שניות</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-red-400">שגיאה בעיבוד הקובץ</h2>
              <p className="text-gray-400">נסה להעלות את הקובץ מחדש</p>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Business Header */}
          <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 text-center">
            <h2 className="text-4xl font-bold mb-2">{String(businessInfo.name || project.name)}</h2>
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
        </>
      )}
    </div>
  )
}
