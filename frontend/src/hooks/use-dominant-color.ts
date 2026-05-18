'use client'

import { useState, useEffect } from 'react'
import ColorThief from 'colorthief'
import { getProxiedImageUrl } from '@/lib/api'

export function useDominantColor(imageUrl: string | undefined) {
  const [dominantColor, setDominantColor] = useState<string | undefined>()
  const [palette, setPalette] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!imageUrl) {
      setDominantColor(undefined)
      setPalette([])
      return
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      setIsLoading(true)
      try {
        const colorThief = new ColorThief()

        // Couleur dominante
        const dominant = colorThief.getColor(img)
        setDominantColor(rgbToHex(dominant[0], dominant[1], dominant[2]))

        // Palette
        const colors = colorThief.getPalette(img, 5)
        setPalette(colors.map(([r, g, b]: number[]) => rgbToHex(r, g, b)))
      } catch (err) {
        console.error('Error extracting color:', err)
      } finally {
        setIsLoading(false)
      }
    }

    img.onerror = () => {
      setDominantColor(undefined)
      setPalette([])
    }

    // Use proxied URL to avoid CORS issues
    img.src = getProxiedImageUrl(imageUrl) || imageUrl
  }, [imageUrl])

  return { dominantColor, palette, isLoading }
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

// Re-export from utils for backward compatibility
export { adjustBrightness } from '@/lib/utils'
