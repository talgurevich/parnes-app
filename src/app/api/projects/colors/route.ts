import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Validate hex color
function isValidHex(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color)
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, colorPrimary, colorSecondary } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: 'Missing project ID' }, { status: 400 })
    }

    // Validate colors if provided
    if (colorPrimary && !isValidHex(colorPrimary)) {
      return NextResponse.json({ error: 'Invalid primary color format' }, { status: 400 })
    }
    if (colorSecondary && !isValidHex(colorSecondary)) {
      return NextResponse.json({ error: 'Invalid secondary color format' }, { status: 400 })
    }

    // Build update object
    const updates: Record<string, string> = {}
    if (colorPrimary) updates.color_primary = colorPrimary
    if (colorSecondary) updates.color_secondary = colorSecondary

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No colors to update' }, { status: 400 })
    }

    // Update the project's colors
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)

    if (error) {
      console.error('Error updating colors:', error)
      return NextResponse.json({ error: 'Failed to update colors' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in colors update:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
