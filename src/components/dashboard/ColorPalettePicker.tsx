'use client'

import { useState } from 'react'
import { COLOR_PALETTES, ColorPaletteId, DEFAULT_PALETTE_ID } from '@/types'

interface ColorPalettePickerProps {
  projectId: string
  currentPalette: ColorPaletteId | null
  onPaletteChange?: (paletteId: ColorPaletteId) => void
}

export function ColorPalettePicker({ projectId, currentPalette, onPaletteChange }: ColorPalettePickerProps) {
  const [selectedPalette, setSelectedPalette] = useState<ColorPaletteId>(currentPalette || DEFAULT_PALETTE_ID)
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSelect = async (paletteId: ColorPaletteId) => {
    setSelectedPalette(paletteId)
    setIsSaving(true)

    try {
      const response = await fetch('/api/projects/palette', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, colorPalette: paletteId }),
      })

      if (response.ok) {
        onPaletteChange?.(paletteId)
        setIsOpen(false)
      }
    } catch (error) {
      console.error('Failed to update palette:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const currentPaletteData = COLOR_PALETTES[selectedPalette]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
      >
        <div className="flex gap-1">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: currentPaletteData.primary }}
          />
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: currentPaletteData.secondary }}
          />
        </div>
        <span className="text-sm">{currentPaletteData.nameHe}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-background-light border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-white/10">
            <span className="text-xs text-gray-400">בחר פלטת צבעים</span>
          </div>
          <div className="p-2 space-y-1">
            {Object.values(COLOR_PALETTES).map((palette) => (
              <button
                key={palette.id}
                onClick={() => handleSelect(palette.id)}
                disabled={isSaving}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  selectedPalette === palette.id
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex gap-1">
                  <div
                    className="w-5 h-5 rounded-full border border-white/20"
                    style={{ backgroundColor: palette.primary }}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-white/20"
                    style={{ backgroundColor: palette.secondary }}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-white/20"
                    style={{ backgroundColor: palette.background }}
                  />
                </div>
                <span className="text-sm flex-1 text-right">{palette.nameHe}</span>
                {selectedPalette === palette.id && (
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          {isSaving && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
