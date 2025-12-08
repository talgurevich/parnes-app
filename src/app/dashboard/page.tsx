import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { DeleteProjectButton } from '@/components/dashboard/DeleteProjectButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">הפרויקטים שלי</h1>
        <Link
          href="/dashboard/new"
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all"
        >
          + העלאה חדשה
        </Link>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:border-primary/50 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{project.name}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(project.created_at).toLocaleDateString('he-IL')}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    project.status === 'ready'
                      ? 'bg-success/20 text-success'
                      : project.status === 'error'
                      ? 'bg-danger/20 text-danger'
                      : 'bg-warning/20 text-warning'
                  }`}
                >
                  {project.status === 'ready' ? 'מוכן' : project.status === 'error' ? 'שגיאה' : 'בעיבוד'}
                </span>
              </div>

              {project.description && (
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="flex gap-2 mt-4">
                {project.status === 'ready' && (
                  <Link
                    href={`/dashboard/${project.id}`}
                    className="flex-1 py-2 text-center bg-primary/20 text-primary hover:bg-primary/30 rounded-lg transition-colors text-sm font-medium"
                  >
                    צפה באינפוגרפיקה
                  </Link>
                )}
                <DeleteProjectButton projectId={project.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-semibold mb-2">אין פרויקטים עדיין</h2>
          <p className="text-gray-400 mb-6">העלה את התוכנית העסקית הראשונה שלך</p>
          <Link
            href="/dashboard/new"
            className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all"
          >
            התחל עכשיו
          </Link>
        </div>
      )}
    </div>
  )
}
