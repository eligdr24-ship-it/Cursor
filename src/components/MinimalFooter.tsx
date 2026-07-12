import { AlmaderyLogo } from './Logo'

export function MinimalFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 border-t border-smoke/80 bg-obsidian px-6 py-12">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
        <AlmaderyLogo
          variant="emblem"
          className="text-champagne/80"
          emblemClassName="w-10 h-10"
        />

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-body text-[0.65rem] font-light uppercase tracking-[0.28em] text-muted-beige">
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-champagne"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@almadery.com"
                className="transition-colors hover:text-champagne"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="#privacy"
                className="transition-colors hover:text-champagne"
              >
                Privacy
              </a>
            </li>
          </ul>
        </nav>

        <div
          id="privacy"
          className="max-w-md scroll-mt-8 font-body text-[0.7rem] font-light leading-relaxed tracking-wide text-warm-gray"
        >
          Your email is used only to share ALMADERY updates and early access
          invitations. We do not sell personal information.
        </div>

        <p className="font-body text-[0.6rem] font-light tracking-[0.18em] text-warm-gray">
          © {year} ALMADERY. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default MinimalFooter
