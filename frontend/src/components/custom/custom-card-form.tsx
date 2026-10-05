'use client'

import { useState, useEffect } from 'react'
import posthog from 'posthog-js'
import { Image as ImageIcon, X, ChevronRight, Loader2, Check } from 'lucide-react'
import { useCardParams } from '@/hooks/use-card-params'
import { validateImageUrl } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  MAX_CUSTOM_LINES,
  MAX_TITLE_LENGTH,
  MAX_ARTIST_LENGTH,
  MAX_LINE_LENGTH,
} from '@/lib/constants'

type ImageValidationState = 'idle' | 'validating' | 'valid' | 'invalid'

function getArtworkValidationState(value: string): ImageValidationState {
  if (!value.trim()) return 'idle'
  try {
    new URL(value.trim())
    return 'validating'
  } catch {
    return 'invalid'
  }
}

export function CustomCardForm() {
  const {
    setCustomCard,
    trackName,
    artistName,
    artworkUrl: savedArtworkUrl,
    customLyrics,
  } = useCardParams()

  const [title, setTitle] = useState(trackName ?? '')
  const [artist, setArtist] = useState(artistName ?? '')
  const [artworkUrl, setArtworkUrl] = useState(savedArtworkUrl ?? '')
  const [lyrics, setLyrics] = useState(() => customLyrics.join('\n'))
  const [lyricsTouched, setLyricsTouched] = useState(false)
  const [imageValidation, setImageValidation] = useState<ImageValidationState>(() =>
    getArtworkValidationState(savedArtworkUrl ?? ''),
  )
  const [imageError, setImageError] = useState<string | null>(() =>
    getArtworkValidationState(savedArtworkUrl ?? '') === 'invalid'
      ? 'Please enter a valid URL'
      : null,
  )

  const pastedLines = lyrics.split(/\r\n|\r|\n/).map((line) => line.trim())
  const nonEmptyLines = pastedLines.filter(Boolean)
  const lineCount = nonEmptyLines.length
  const longLineNumbers = pastedLines.flatMap((line, index) =>
    line.length > MAX_LINE_LENGTH ? [index + 1] : [],
  )
  const lyricsError =
    lineCount > MAX_CUSTOM_LINES
      ? `Keep your text to ${MAX_CUSTOM_LINES} nonempty lines or fewer.`
      : longLineNumbers.length > 0
        ? `Line${longLineNumbers.length > 1 ? 's' : ''} ${longLineNumbers.join(', ')} exceed${longLineNumbers.length === 1 ? 's' : ''} ${MAX_LINE_LENGTH} characters. Shorten ${longLineNumbers.length > 1 ? 'them' : 'it'} to continue.`
        : lyricsTouched && lineCount === 0
          ? 'Enter at least one line of text.'
          : null

  const isTitleValid = title.trim().length > 0 && title.length <= MAX_TITLE_LENGTH
  const isArtistValid = artist.trim().length > 0 && artist.length <= MAX_ARTIST_LENGTH
  const isLyricsValid =
    lineCount >= 1 && lineCount <= MAX_CUSTOM_LINES && longLineNumbers.length === 0
  const isImageValid = !artworkUrl.trim() || imageValidation === 'valid'
  const canSubmit = isTitleValid && isArtistValid && isLyricsValid && isImageValid

  useEffect(() => {
    const url = artworkUrl.trim()
    if (getArtworkValidationState(url) !== 'validating') return

    let cancelled = false
    const timeout = setTimeout(async () => {
      try {
        const result = await validateImageUrl(url)
        if (cancelled) return
        setImageValidation(result.valid ? 'valid' : 'invalid')
        setImageError(
          result.valid ? null : result.error || 'This URL does not point to a valid image',
        )
      } catch {
        if (cancelled) return
        setImageValidation('invalid')
        setImageError('Failed to validate image URL')
      }
    }, 500)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [artworkUrl])

  const handleArtworkUrlChange = (value: string) => {
    const state = getArtworkValidationState(value)
    setArtworkUrl(value)
    setImageValidation(state)
    setImageError(state === 'invalid' ? 'Please enter a valid URL' : null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    posthog.capture('custom_card_created', {
      has_artwork: Boolean(artworkUrl.trim()),
      artwork_type: artworkUrl.trim() ? 'url' : 'none',
      lines_count: nonEmptyLines.length,
    })

    setCustomCard({
      title: title.trim(),
      artist: artist.trim(),
      artworkUrl: artworkUrl.trim() || null,
      lines: nonEmptyLines,
    })
  }

  const clearArtwork = () => handleArtworkUrlChange('')

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='grid gap-4 sm:grid-cols-2'>
        {/* Title */}
        <div className='space-y-2'>
          <Label htmlFor='title'>Title</Label>
          <Input
            id='title'
            type='text'
            placeholder='Song or book title...'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={MAX_TITLE_LENGTH}
            required
          />
          <p className='text-xs text-muted-foreground text-right'>
            {title.length}/{MAX_TITLE_LENGTH}
          </p>
        </div>

        {/* Artist */}
        <div className='space-y-2'>
          <Label htmlFor='artist'>Artist / Author</Label>
          <Input
            id='artist'
            type='text'
            placeholder='Artist or author name...'
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            maxLength={MAX_ARTIST_LENGTH}
            required
          />
          <p className='text-xs text-muted-foreground text-right'>
            {artist.length}/{MAX_ARTIST_LENGTH}
          </p>
        </div>
      </div>

      {/* Artwork URL */}
      <div className='space-y-2'>
        <Label htmlFor='artwork-url'>Artwork URL (optional)</Label>

        {/* Preview when valid */}
        {imageValidation === 'valid' && artworkUrl.trim() && (
          <div className='relative w-24 h-24 rounded-lg overflow-hidden border'>
            <img
              src={artworkUrl.trim()}
              alt='Artwork preview'
              className='w-full h-full object-cover'
              onError={() => {
                setImageValidation('invalid')
                setImageError('Failed to load image')
              }}
            />
            <button
              type='button'
              onClick={clearArtwork}
              aria-label='Clear artwork image'
              className='absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            >
              <X className='h-3 w-3 text-white' aria-hidden='true' />
            </button>
          </div>
        )}

        {/* URL input */}
        <div className='relative'>
          <ImageIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            id='artwork-url'
            type='url'
            aria-invalid={imageValidation === 'invalid'}
            aria-describedby='artwork-status'
            placeholder='https://example.com/image.jpg'
            value={artworkUrl}
            onChange={(e) => handleArtworkUrlChange(e.target.value)}
            className={cn(
              'pl-10 pr-10',
              imageValidation === 'invalid' && 'border-destructive focus-visible:ring-destructive',
            )}
          />
          {/* Validation indicator */}
          <div className='absolute right-3 top-1/2 -translate-y-1/2'>
            {imageValidation === 'validating' && (
              <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
            )}
            {imageValidation === 'invalid' && <X className='h-4 w-4 text-destructive' />}
          </div>
        </div>

        {imageValidation === 'validating' && (
          <p id='artwork-status' role='status' className='text-xs text-muted-foreground'>
            Validating image URL...
          </p>
        )}

        {/* Error message */}
        {imageError && (
          <p id='artwork-status' role='alert' className='text-xs text-destructive'>
            {imageError}
          </p>
        )}

        {/* Helper text */}
        {imageValidation === 'idle' && !imageError && (
          <p id='artwork-status' className='text-xs text-muted-foreground'>
            Paste a direct link to an image (JPG, PNG, GIF, WebP)
          </p>
        )}

        {/* Validation success */}
        {imageValidation === 'valid' && (
          <p
            id='artwork-status'
            role='status'
            className='text-xs text-primary flex items-center gap-1'
          >
            <Check className='h-3 w-3' />
            Valid image URL
          </p>
        )}
      </div>

      <div className='space-y-3'>
        <div className='flex items-center justify-between gap-2'>
          <Label htmlFor='custom-lyrics'>Text / Lyrics</Label>
          <span
            className={cn(
              'text-xs tabular-nums',
              lineCount > MAX_CUSTOM_LINES ? 'text-destructive' : 'text-muted-foreground',
            )}
          >
            {lineCount}/{MAX_CUSTOM_LINES} lines
          </span>
        </div>
        <textarea
          id='custom-lyrics'
          rows={8}
          placeholder='Paste your text or lyrics here...'
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          onBlur={() => setLyricsTouched(true)}
          aria-invalid={Boolean(lyricsError)}
          aria-describedby={lyricsError ? 'lyrics-help lyrics-error' : 'lyrics-help'}
          className='block min-h-48 w-full resize-y rounded-md border border-input bg-transparent px-3 py-3 text-base leading-relaxed shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 md:text-sm'
        />
        <p id='lyrics-help' className='text-xs text-muted-foreground'>
          Paste up to {MAX_CUSTOM_LINES} lines, with one lyric per line. Blank lines are ignored.
          Maximum {MAX_LINE_LENGTH} characters per line.
        </p>
        {lyricsError && (
          <p id='lyrics-error' role='alert' className='text-xs text-destructive'>
            {lyricsError}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button type='submit' disabled={!canSubmit} className='w-full'>
        {imageValidation === 'validating' ? (
          <>
            <Loader2 className='h-4 w-4 animate-spin' />
            Validating...
          </>
        ) : (
          <>
            Create my card
            <ChevronRight className='h-4 w-4' />
          </>
        )}
      </Button>
    </form>
  )
}
