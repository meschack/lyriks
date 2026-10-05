'use client'

import { useEffect, useRef } from 'react'
import { useCardParams, type WizardStep } from '@/hooks/use-card-params'
import { SearchSection } from '@/components/search/search-section'
import { LyricsSection } from '@/components/lyrics/lyrics-section'
import { CardPreviewSection } from '@/components/card-preview/card-preview-section'
import { ModeToggle } from '@/components/custom/mode-toggle'
import { CustomCardForm } from '@/components/custom/custom-card-form'
import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowRight, Check, Music2, Sparkles } from 'lucide-react'

export function LyricsWizard() {
  const {
    currentStep,
    canProceedToCard,
    goToStep,
    goToCard,
    isCustomMode,
    goToSearch,
    hasTrack,
    trackName,
    artistName,
  } = useCardParams()
  const previousStep = useRef(currentStep)
  useEffect(() => {
    if (previousStep.current !== currentStep) {
      document.getElementById('studio')?.scrollIntoView({ behavior: 'instant', block: 'start' })
      document.getElementById('step-title')?.focus({ preventScroll: true })
      previousStep.current = currentStep
    }
  }, [currentStep])
  const steps = isCustomMode
    ? ['Your words', 'Make it yours']
    : ['Find a song', 'Pick your lines', 'Make it yours']
  const isEditor = currentStep === (isCustomMode ? 2 : 3)
  return (
    <>
      {currentStep === 1 && (
        <section className='intro'>
          <div className='intro-copy'>
            <span className='eyebrow'>
              <span className='status-dot' /> YOUR WORDS, ON REPEAT
            </span>
            <h1>
              Some lyrics
              <br />
              just <span>stay with you.</span>
            </h1>
            <p>
              Turn the lines you love into something you can keep.
              <br className='hidden sm:block' /> Find a song, make it yours, share the feeling.
            </p>
            <div className='intro-note'>
              <Sparkles size={14} /> Free to create. Made to share.
            </div>
          </div>
          <div className='sample-composition' aria-label='Examples of lyrics cards'>
            <div className='sample-card sample-back'>
              <span className='sample-meta'>
                AFTER THE RAIN
                <br />
                JUNE PARK
              </span>
              <p>
                A little light.
                <br />A little longer.
              </p>
              <span className='sample-signature'>lyriks.</span>
            </div>
            <div className='sample-card sample-front'>
              <div className='sample-track'>
                <div className='sample-art' />
                <span>
                  Paper skies
                  <br />
                  <small>Mira Sol</small>
                </span>
              </div>
              <p>
                We kept the summer
                <br />
                in a paper cup.
              </p>
              <span className='sample-signature'>lyriks.</span>
            </div>
            <span className='sample-caption'>A feeling, worth keeping.</span>
          </div>
        </section>
      )}
      <section
        id='studio'
        className={cn('studio', currentStep !== 1 && 'studio-active')}
        aria-label='Lyrics card studio'
      >
        <div className='studio-top'>
          <span className='studio-title'>
            <Music2 size={17} /> THE STUDIO
          </span>
          <nav className='step-nav' aria-label='Creation progress'>
            {steps.map((label, i) => {
              const target = (i + 1) as WizardStep
              const enabled =
                target <= currentStep ||
                (target === steps.length && canProceedToCard) ||
                (target === 2 && !isCustomMode && hasTrack)
              return (
                <button
                  key={label}
                  onClick={() => goToStep(target)}
                  disabled={!enabled}
                  aria-current={target === currentStep ? 'step' : undefined}
                  className={cn(
                    'step-item',
                    target === currentStep && 'active',
                    target < currentStep && 'done',
                  )}
                >
                  <span className='step-number'>
                    {target < currentStep ? <Check size={12} /> : `0${target}`}
                  </span>
                  <span>{label}</span>
                </button>
              )
            })}
          </nav>
        </div>
        {currentStep === 1 && (
          <div className='start-layout'>
            <div className='start-main'>
              <ModeToggle />
              <div className='section-heading'>
                <span className='eyebrow'>LET’S START WITH THE WORDS</span>
                <h2>{isCustomMode ? 'Your words, your way.' : 'What’s on your mind?'}</h2>
                <p>
                  {isCustomMode
                    ? 'Paste your own lyrics, a quote, or a little something you wrote.'
                    : 'Search for a song or artist. We’ll find the lyrics.'}
                </p>
              </div>
              {isCustomMode ? <CustomCardForm /> : <SearchSection />}
            </div>
            <aside className='start-aside'>
              <span className='eyebrow'>FROM SONG TO SOMETHING PERSONAL</span>
              <div className='guide-row'>
                <span>01</span>
                <div>
                  <h3>Find your song</h3>
                  <p>Or start with your own words.</p>
                </div>
              </div>
              <div className='guide-row'>
                <span>02</span>
                <div>
                  <h3>Keep the good part</h3>
                  <p>Choose up to eight lines that say it all.</p>
                </div>
              </div>
              <div className='guide-row'>
                <span>03</span>
                <div>
                  <h3>Give it your style</h3>
                  <p>Pick a colour, a format, a feeling.</p>
                </div>
              </div>
              <div className='aside-foot'>No account needed. Just good words.</div>
            </aside>
          </div>
        )}
        {currentStep > 1 && (
          <>
            <div className='editor-heading'>
              <div>
                <span className='eyebrow'>
                  {isEditor ? 'THE FINISHING TOUCHES' : 'THE PART THAT STAYS'}
                </span>
                <h1 id='step-title' tabIndex={-1}>
                  {isEditor ? 'Make it yours.' : 'Pick your favourite lines.'}
                </h1>
                <p>
                  {trackName} <span className='text-muted-foreground'>/ {artistName}</span>
                </p>
              </div>
              <button
                className='text-action'
                onClick={isEditor ? () => goToStep((currentStep - 1) as WizardStep) : goToSearch}
              >
                <ArrowLeft size={15} />
                {isEditor ? 'Edit your words' : 'Change song'}
              </button>
            </div>
            {!isEditor ? (
              <div className='selection-layout'>
                <div>
                  <LyricsSection />
                  <div className='selection-action'>
                    <p>Click a first line, then a last line.</p>
                    <button
                      className='primary-action'
                      onClick={goToCard}
                      disabled={!canProceedToCard}
                    >
                      Style my card <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
                <CardPreviewSection selectionOnly />
              </div>
            ) : (
              <CardPreviewSection />
            )}
          </>
        )}
      </section>
    </>
  )
}
