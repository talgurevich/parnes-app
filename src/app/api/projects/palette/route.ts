import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { ColorPaletteId, COLOR_PALETTES } from '@/types'

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, colorPalette } = await request.json()

    if (!projectId || !colorPalette) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate the color palette
    if (!COLOR_PALETTES[colorPalette as ColorPaletteId]) {
      return NextResponse.json({ error: 'Invalid color palette' }, { status: 400 })
    }

    // Update the project's color palette
    const { error } = await supabase
      .from('projects')
      .update({ color_palette: colorPalette })
      .eq('id', projectId)

    if (error) {
      console.error('Error updating color palette:', error)
      return NextResponse.json({ error: 'Failed to update color palette' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in palette update:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
