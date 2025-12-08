import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          Parnes
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          העלה את התוכנית העסקית שלך וקבל אינפוגרפיקה מרהיבה
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/login"
            className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-primary/30 text-lg"
          >
            התחבר והתחל
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">העלאת Excel</h3>
            <p className="text-gray-400">העלה את קובץ התוכנית העסקית שלך בפורמט Excel</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">עיצוב אוטומטי</h3>
            <p className="text-gray-400">המערכת מייצרת אינפוגרפיקה מעוצבת באופן אוטומטי</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">שיתוף קל</h3>
            <p className="text-gray-400">שתף את התוכנית העסקית שלך עם משקיעים ושותפים</p>
          </div>
        </div>
      </div>
    </main>
  )
}
