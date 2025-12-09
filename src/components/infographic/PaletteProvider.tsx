'use client'

import { createContext, useContext, ReactNode } from 'react'
import { CustomColors, DEFAULT_COLORS, generateColorVariants } from '@/types'

export interface PaletteColors {
  primary: string
  primaryLight: string
  primaryDark: string
  secondary: string
  secondaryLight: string
  secondaryDark: string
}

function generatePalette(colors: CustomColors): PaletteColors {
  const primary = generateColorVariants(colors.primary)
  const secondary = generateColorVariants(colors.secondary)

  return {
    primary: primary.base,
    primaryLight: primary.light,
    primaryDark: primary.dark,
    secondary: secondary.base,
    secondaryLight: secondary.light,
    secondaryDark: secondary.dark,
  }
}

const PaletteContext = createContext<PaletteColors>(generatePalette(DEFAULT_COLORS))

export function usePalette() {
  return useContext(PaletteContext)
}

interface PaletteProviderProps {
  colors: CustomColors
  children: ReactNode
}

export function PaletteProvider({ colors, children }: PaletteProviderProps) {
  const palette = generatePalette(colors)

  return (
    <PaletteContext.Provider value={palette}>
      {children}
    </PaletteContext.Provider>
  )
}
