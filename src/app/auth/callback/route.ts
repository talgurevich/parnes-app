import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Allowed email addresses
const ALLOWED_EMAILS = [
  'parnes2@gmail.com',
  'tal.gurevich@gmail.com',
]

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if profile exists, if not create one
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Check if email is allowed
        if (!ALLOWED_EMAILS.includes(user.email || '')) {
          await supabase.auth.signOut()
          return NextResponse.redirect(`${origin}/login?error=unauthorized`)
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select()
          .eq('id', user.id)
          .single()

        if (!profile) {
          await supabase.from('profiles').insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name,
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
          })
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth`)
}
