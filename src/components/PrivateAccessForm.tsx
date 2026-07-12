import { useId, useState } from 'react'
import type { FormEvent } from 'react'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function PrivateAccessForm() {
  const emailId = useId()
  const errorId = useId()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = email.trim()

    if (!trimmed) {
      setError('Please enter your email address.')
      setStatus('error')
      return
    }

    if (!isValidEmail(trimmed)) {
      setError('Please enter a valid email address.')
      setStatus('error')
      return
    }

    setError('')
    setStatus('loading')

    // Simulated private-list request — no backend required for the teaser.
    await new Promise((resolve) => setTimeout(resolve, 1100))
    setStatus('success')
  }

  return (
    <section
      className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center bg-gradient-to-b from-obsidian via-void to-charcoal px-6 py-24"
      aria-labelledby="access-heading"
    >
      <div className="mx-auto w-full max-w-lg text-center">
        <p className="scene-eyebrow mb-5">Private Access</p>
        <h2
          id="access-heading"
          className="font-display text-3xl font-light tracking-wide text-soft-ivory md:text-4xl text-balance"
        >
          Enter the World of ALMADERY
        </h2>
        <p className="mx-auto mt-5 max-w-md font-body text-sm font-light leading-relaxed tracking-wide text-muted-beige md:text-base text-balance">
          Join the private list for early access, collection previews, and the
          official unveiling.
        </p>

        {status === 'success' ? (
          <div
            className="mt-12 rounded-sm border border-champagne/25 bg-graphite/40 px-6 py-10"
            role="status"
            aria-live="polite"
          >
            <p className="font-display text-2xl font-light text-soft-ivory">
              You are on the list
            </p>
            <p className="mt-3 font-body text-sm font-light text-muted-beige">
              We will be in touch when ALMADERY opens its doors.
            </p>
          </div>
        ) : (
          <form
            className="mt-12 space-y-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="text-left">
              <label
                htmlFor={emailId}
                className="mb-2 block font-body text-[0.65rem] font-light uppercase tracking-[0.28em] text-muted-beige"
              >
                Email address
              </label>
              <input
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === 'error') {
                    setStatus('idle')
                    setError('')
                  }
                }}
                aria-invalid={status === 'error'}
                aria-describedby={status === 'error' ? errorId : undefined}
                disabled={status === 'loading'}
                placeholder="you@example.com"
                className="w-full border border-smoke bg-void/80 px-4 py-3.5 font-body text-sm font-light text-soft-ivory placeholder:text-warm-gray/70 transition-colors focus:border-champagne/60 focus:outline-none disabled:opacity-60"
              />
              {status === 'error' && (
                <p
                  id={errorId}
                  className="mt-2 font-body text-xs font-light text-[#c4a090]"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="group relative w-full overflow-hidden border border-champagne/50 bg-transparent px-6 py-3.5 font-body text-[0.7rem] font-light uppercase tracking-[0.28em] text-champagne transition-colors hover:border-champagne hover:bg-champagne/10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-champagne disabled:cursor-wait disabled:opacity-70"
            >
              {status === 'loading' ? (
                <span className="inline-flex items-center justify-center gap-3">
                  <span
                    className="h-3.5 w-3.5 animate-spin rounded-full border border-champagne/30 border-t-champagne"
                    aria-hidden="true"
                  />
                  Requesting access…
                </span>
              ) : (
                'Request Private Access'
              )}
            </button>

            <p className="pt-2 font-body text-[0.65rem] font-light tracking-wide text-warm-gray">
              By joining, you agree to our{' '}
              <a
                href="#privacy"
                className="text-muted-beige underline decoration-champagne/30 underline-offset-4 transition-colors hover:text-champagne"
              >
                Privacy
              </a>{' '}
              notice.
            </p>
          </form>
        )}

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-14 inline-flex items-center gap-3 font-body text-[0.65rem] font-light uppercase tracking-[0.3em] text-muted-beige transition-colors hover:text-champagne"
          aria-label="ALMADERY on Instagram (opens in a new tab)"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
          </svg>
          Instagram
        </a>
      </div>
    </section>
  )
}

export default PrivateAccessForm
