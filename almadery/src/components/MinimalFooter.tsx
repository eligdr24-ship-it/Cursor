import Emblem from "./brand/Emblem";

export default function MinimalFooter() {
  return (
    <footer className="border-t border-charcoal bg-ink px-6 py-12">
      <div
        data-fade-up=""
        className="mx-auto flex max-w-3xl flex-col items-center gap-7"
      >
        <span className="text-champagne/90">
          <Emblem className="h-10 w-auto" title="ALMADERY emblem" />
        </span>

        <nav aria-label="Footer">
          <ul className="flex items-center gap-8 text-[10px] font-light uppercase tracking-[0.35em]">
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-warmgray transition-colors duration-300 hover:text-champagne"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@almadery.com"
                className="text-warmgray transition-colors duration-300 hover:text-champagne"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="#privacy"
                className="text-warmgray transition-colors duration-300 hover:text-champagne"
              >
                Privacy
              </a>
            </li>
          </ul>
        </nav>

        <p className="text-[10px] font-light tracking-[0.25em] text-warmgray uppercase">
          &copy; {new Date().getFullYear()} ALMADERY &mdash; Fine Diamonds &amp; Gold Jewellery
        </p>
      </div>
    </footer>
  );
}
