import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ShareButton } from '@/components/dashboard/ShareButton'
import { InfographicDisplay } from '@/components/infographic/InfographicDisplay'
import { DEFAULT_COLORS } from '@/types'

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
          showColorPicker={true}
        />
      )}
    </div>
  )
}
