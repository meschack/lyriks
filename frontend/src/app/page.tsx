import Link from 'next/link'
import { Suspense } from 'react'
import { AudioLines, ArrowUpRight } from 'lucide-react'
import { LyricsWizard } from '@/components/wizard/lyrics-wizard'
import { Footer } from '@/components/shared/footer'
import { ErrorBoundary } from '@/components/shared/error-boundary'
import { Skeleton } from '@/components/ui/skeleton'

export default function HomePage() {
  return (
    <main className='app-shell'>
      <a href='#studio' className='skip-link'>
        Skip to the studio
      </a>
      <header className='site-header'>
        <Link href='/' className='wordmark' aria-label='Lyriks home'>
          <span className='brand-mark'>
            <AudioLines size={23} />
          </span>
          lyriks<span className='brand-dot'>.</span>
        </Link>
        <span className='header-note'>A little music. A lot of meaning.</span>
        <a href='#studio' className='header-link'>
          Make a card <ArrowUpRight size={15} />
        </a>
      </header>
      <ErrorBoundary>
        <Suspense fallback={<Skeleton className='h-[600px] rounded-2xl' />}>
          <LyricsWizard />
        </Suspense>
      </ErrorBoundary>
      <Footer />
    </main>
  )
}
