'use client'

import { useState, useRef, useEffect } from 'react'
import { CustomColors, DEFAULT_COLORS } from '@/types'

interface ColorPickerProps {
  projectId: string
  initialColors: CustomColors
  onColorsChange?: (colors: CustomColors) => void
}

export function ColorPalettePicker({ projectId, initialColors, onColorsChange }: ColorPickerProps) {
  const [colors, setColors] = useState<CustomColors>(initialColors)
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleColorChange = async (key: keyof CustomColors, value: string) => {
    const newColors = { ...colors, [key]: value }
    setColors(newColors)
    onColorsChange?.(newColors)

    // Debounced save
    setIsSaving(true)
    try {
      await fetch('/api/projects/colors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          colorPrimary: newColors.primary,
          colorSecondary: newColors.secondary,
        }),
      })
    } catch (error) {
      console.error('Failed to save colors:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const resetToDefaults = () => {
    handleColorChange('primary', DEFAULT_COLORS.primary)
    setTimeout(() => handleColorChange('secondary', DEFAULT_COLORS.secondary), 100)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
      >
        <div className="flex gap-1">
          <div
            className="w-5 h-5 rounded-full border border-white/30"
            style={{ backgroundColor: colors.primary }}
          />
          <div
            className="w-5 h-5 rounded-full border border-white/30"
            style={{ backgroundColor: colors.secondary }}
          />
        </div>
        <span className="text-sm">צבעים</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {isSaving && (
          <div className="w-3 h-3 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-background-light border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b border-white/10">
            <span className="text-sm font-medium">בחר צבעים</span>
          </div>

          <div className="p-4 space-y-4">
            {/* Primary Color */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">צבע ראשי</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={colors.primary}
                  onChange={(e) => {
                    const val = e.target.value
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                      if (val.length === 7) {
                        handleColorChange('primary', val)
                      } else {
                        setColors({ ...colors, primary: val })
                      }
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-sm font-mono"
                  placeholder="#e94560"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">צבע משני</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={colors.secondary}
                  onChange={(e) => {
                    const val = e.target.value
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                      if (val.length === 7) {
                        handleColorChange('secondary', val)
                      } else {
                        setColors({ ...colors, secondary: val })
                      }
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-sm font-mono"
                  placeholder="#4ecdc4"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">פלטות מוכנות</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { primary: '#e94560', secondary: '#4ecdc4' },
                  { primary: '#0077b6', secondary: '#90e0ef' },
                  { primary: '#ff6b35', secondary: '#ffc857' },
                  { primary: '#2d6a4f', secondary: '#95d5b2' },
                  { primary: '#7b2cbf', secondary: '#ffd700' },
                  { primary: '#f72585', secondary: '#4cc9f0' },
                  { primary: '#ef476f', secondary: '#06d6a0' },
                  { primary: '#264653', secondary: '#e9c46a' },
                ].map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      handleColorChange('primary', preset.primary)
                      setTimeout(() => handleColorChange('secondary', preset.secondary), 100)
                    }}
                    className="flex gap-0.5 p-1 rounded hover:bg-white/10 transition-colors"
                    title="בחר פלטה"
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-white/20"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="w-5 h-5 rounded-full border border-white/20"
                      style={{ backgroundColor: preset.secondary }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetToDefaults}
              className="w-full py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
            >
              איפוס לברירת מחדל
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
