'use client'

import { useState, useEffect, useRef } from 'react'
import posthog from 'posthog-js'
import { Search, X, Loader2 } from 'lucide-react'
import { useSearch } from '@/hooks/use-search'
import { useCardParams } from '@/hooks/use-card-params'
import { Input } from '@/components/ui/input'
import { SearchResults } from './search-results'
import { type Track, getPrimaryArtist, getArtworkUrl } from '@/types/track'

export function SearchSection() {
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const { selectTrack, resetAll } = useCardParams()
  const lastTrackedQuery = useRef('')

  const { data, isLoading, error } = useSearch(submittedQuery)

  // Track search errors and no results
  useEffect(() => {
    if (!isLoading && submittedQuery && submittedQuery !== lastTrackedQuery.current) {
      if (error) {
        posthog.capture('search_failed', {
          query: submittedQuery,
          error: error.message,
        })
        lastTrackedQuery.current = submittedQuery
      } else if (data && data.results.length === 0) {
        posthog.capture('search_no_results', {
          query: submittedQuery,
        })
        lastTrackedQuery.current = submittedQuery
      }
    }
  }, [isLoading, submittedQuery, error, data])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setSubmittedQuery(query.trim())
      posthog.capture('song_searched', { query: query.trim() })
    }
  }

  const handleSelectTrack = (track: Track) => {
    const artist = getPrimaryArtist(track)
    posthog.capture('track_selected', {
      track_id: track.id,
      track_name: track.name,
      artist_name: artist,
    })
    selectTrack({
      id: track.id,
      name: track.name,
      artist,
      artworkUrl: getArtworkUrl(track, 'large') || null,
    })
    setQuery('')
    setSubmittedQuery('')
  }

  const handleClear = () => {
    setQuery('')
    setSubmittedQuery('')
    resetAll()
  }

  return (
    <section className='space-y-4'>
      <form onSubmit={handleSubmit} className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input
          type='text'
          placeholder='Search for a song or artist...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='pl-10 pr-10'
        />
        {(query || submittedQuery) && (
          <button
            type='button'
            onClick={handleClear}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
          >
            {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <X className='h-4 w-4' />}
          </button>
        )}
      </form>

      {submittedQuery && (
        <SearchResults
          results={data?.results ?? []}
          isLoading={isLoading}
          error={error}
          onSelect={handleSelectTrack}
        />
      )}
    </section>
  )
}
