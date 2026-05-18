'use client'

import { useState, useCallback } from 'react'
import type { SatoriCardProps } from '@/lib/satori-card'

type ExportFormat = 'png' | 'jpg'

interface UseExportImageOptions {
  cardProps: Omit<SatoriCardProps, 'artworkBase64'>
}

export function useExportImage({ cardProps }: UseExportImageOptions) {
  const [isExportingPng, setIsExportingPng] = useState(false)
  const [isExportingJpg, setIsExportingJpg] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchExport = useCallback(
    async (format: ExportFormat): Promise<Blob> => {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cardProps, outputFormat: format }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Export failed')
      }

      return response.blob()
    },
    [cardProps],
  )

  const exportTo = useCallback(
    async (format: ExportFormat, filename?: string) => {
      const setLoading = format === 'png' ? setIsExportingPng : setIsExportingJpg
      setLoading(true)
      setError(null)

      try {
        const blob = await fetchExport(format)
        const url = URL.createObjectURL(blob)
        downloadUrl(url, filename || `lyric-card.${format}`)
        URL.revokeObjectURL(url)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur lors de l'export"
        setError(message)
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [fetchExport],
  )

  const exportToPng = useCallback(
    (filename?: string) => exportTo('png', filename),
    [exportTo],
  )

  const exportToJpg = useCallback(
    (filename?: string) => exportTo('jpg', filename),
    [exportTo],
  )

  const copyToClipboard = useCallback(async () => {
    setIsCopying(true)
    setError(null)

    try {
      const blob = await fetchExport('png')
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la copie'
      setError(message)
      console.error(err)
    } finally {
      setIsCopying(false)
    }
  }, [fetchExport])

  return {
    exportToPng,
    exportToJpg,
    copyToClipboard,
    isExportingPng,
    isExportingJpg,
    isCopying,
    error,
  }
}

function downloadUrl(url: string, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = url
  link.click()
}
