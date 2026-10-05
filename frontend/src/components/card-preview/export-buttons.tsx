'use client'

import { useState } from 'react'
import posthog from 'posthog-js'
import { Download, Link, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ExportButtonsProps {
  onExportPng: () => Promise<void>
  onExportJpg: () => Promise<void>
  error?: string | null
  shareUrl: string
  disabled: boolean
  isExportingPng: boolean
  isExportingJpg: boolean
}

export function ExportButtons({
  onExportPng,
  onExportJpg,
  shareUrl,
  error,
  disabled,
  isExportingPng,
  isExportingJpg,
}: ExportButtonsProps) {
  const [copyError, setCopyError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleExportPng = async () => {
    posthog.capture('card_exported', { format: 'png' })
    await onExportPng()
  }

  const handleExportJpg = async () => {
    posthog.capture('card_exported', { format: 'jpg' })
    await onExportJpg()
  }

  const handleCopyLink = async () => {
    setCopyError('')
    try {
      await navigator.clipboard.writeText(shareUrl)
      posthog.capture('share_link_copied')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      setCopyError('Could not copy the link. You can copy the address from your browser.')
    }
  }

  return (
    <div className='space-y-3'>
      <p className='text-xs text-muted-foreground mb-3'>
        Save a high-resolution image, ready to share.
      </p>
      {(error || copyError) && (
        <p role='alert' className='text-sm text-destructive'>
          {error || copyError}
        </p>
      )}
      {/* Export buttons */}
      <div className='grid grid-cols-2 gap-2'>
        <Button
          onClick={handleExportPng}
          disabled={disabled || isExportingPng || isExportingJpg}
          size='sm'
          className='w-full'
        >
          {isExportingPng ? (
            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
          ) : (
            <Download className='h-4 w-4 mr-2' />
          )}
          Download PNG
        </Button>
        <Button
          onClick={handleExportJpg}
          disabled={disabled || isExportingPng || isExportingJpg}
          variant='secondary'
          size='sm'
          className='w-full'
        >
          {isExportingJpg ? (
            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
          ) : (
            <Download className='h-4 w-4 mr-2' />
          )}
          Download JPG
        </Button>
      </div>

      {/* Copy link */}
      <Button
        onClick={handleCopyLink}
        disabled={disabled}
        variant='ghost'
        size='sm'
        className='w-full'
      >
        {copied ? (
          <>
            <Check className='h-4 w-4 mr-2' />
            Link copied!
          </>
        ) : (
          <>
            <Link className='h-4 w-4 mr-2' />
            Copy link
          </>
        )}
      </Button>
    </div>
  )
}
