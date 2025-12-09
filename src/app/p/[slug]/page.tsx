import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { InfographicDisplay } from '@/components/infographic/InfographicDisplay'
import { DEFAULT_COLORS } from '@/types'

// Public page - use service role to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function PublicProjectPage({ params }: { params: { slug: string } }) {
  const { slug } = await params

  // Fetch project by public slug
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('public_slug', slug)
    .single()

  if (!project) notFound()

  // Fetch project data
  const { data: projectData } = await supabase
    .from('project_data')
    .select('*')
    .eq('project_id', project.id)

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
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <InfographicDisplay
          projectId={project.id}
          projectName={project.name}
          initialColors={{
            primary: project.color_primary || DEFAULT_COLORS.primary,
            secondary: project.color_secondary || DEFAULT_COLORS.secondary,
          }}
          businessInfo={businessInfo}
          pricing={pricing}
          expenses={expenses}
          investments={investments}
          kpis={kpis}
          significantParams={significantParams}
          year1={year1}
          year2={year2}
          monthlyData={monthlyData}
          showColorPicker={false}
        />
      </div>
    </div>
  )
}
