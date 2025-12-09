'use client'

import { createContext, useContext, ReactNode } from 'react'
import { ColorPalette, COLOR_PALETTES, ColorPaletteId, DEFAULT_PALETTE_ID } from '@/types'

const PaletteContext = createContext<ColorPalette>(COLOR_PALETTES[DEFAULT_PALETTE_ID])

export function usePalette() {
  return useContext(PaletteContext)
}

interface PaletteProviderProps {
  paletteId: ColorPaletteId | null
  children: ReactNode
}

export function PaletteProvider({ paletteId, children }: PaletteProviderProps) {
  const palette = COLOR_PALETTES[paletteId || DEFAULT_PALETTE_ID]

  return (
    <PaletteContext.Provider value={palette}>
      <div
        style={{
          '--palette-primary': palette.primary,
          '--palette-primary-light': palette.primaryLight,
          '--palette-primary-dark': palette.primaryDark,
          '--palette-secondary': palette.secondary,
          '--palette-secondary-light': palette.secondaryLight,
          '--palette-secondary-dark': palette.secondaryDark,
          '--palette-background': palette.background,
          '--palette-background-light': palette.backgroundLight,
          '--palette-background-dark': palette.backgroundDark,
        } as React.CSSProperties}
        className="palette-container"
      >
        {children}
      </div>
    </PaletteContext.Provider>
  )
}
