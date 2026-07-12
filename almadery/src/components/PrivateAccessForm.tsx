import { useId, useState, type FormEvent } from "react";

type FormState = "idle" | "submitting" | "success";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function PrivateAccessForm() {
  const inputId = useId();
  const hintId = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "submitting") return;

    const value = email.trim();
    if (!value) {
      setError("Please enter your email address.");
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    setState("submitting");
    // Teaser page: no backend yet — confirm after a brief, elegant pause.
    window.setTimeout(() => setState("success"), 1400);
  };

  return (
    <section
      id="private-access"
      aria-labelledby="private-access-heading"
      className="relative bg-ink px-6 py-28 md:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 h-px w-64 -translate-x-1/2 bg-gradient-to-r from-transparent via-champagne/40 to-transparent"
      />

      <div data-fade-up="" className="mx-auto max-w-xl text-center">
        <p className="text-[10px] font-light uppercase tracking-[0.45em] text-champagne/90 md:text-[11px]">
          The Invitation
        </p>
        <h2
          id="private-access-heading"
          className="mt-5 font-serif text-4xl leading-tight font-light text-balance text-ivory md:text-5xl"
        >
          Enter the World of ALMADERY
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed font-light tracking-wide text-warmgray md:text-base">
          Join the private list for early access, collection previews, and the
          official unveiling.
        </p>

        <div className="mt-12 min-h-32">
          {state === "success" ? (
            <div role="status" className="flex flex-col items-center gap-4">
              <svg
                viewBox="0 0 48 48"
                className="h-10 w-10 text-champagne"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M24 3 45 24 24 45 3 24Z" />
                <path d="m16.5 24 5.5 5.5 10-11" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="font-serif text-xl font-light text-ivory">
                Welcome. You are on the private list.
              </p>
              <p className="text-xs font-light tracking-wide text-warmgray">
                We will write to you only when there is something rare to share.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-md">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1 text-left">
                  <label
                    htmlFor={inputId}
                    className="mb-2 block text-[10px] font-light uppercase tracking-[0.4em] text-warmgray"
                  >
                    Email Address
                  </label>
                  <input
                    id={inputId}
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={hintId}
                    placeholder="you@example.com"
                    className={`w-full border-b bg-transparent pb-2.5 text-base font-light text-ivory transition-colors duration-300 outline-none placeholder:text-warmgray/45 focus:border-champagne ${
                      error ? "border-red-300/60" : "border-warmgray/40"
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="group inline-flex h-11 shrink-0 items-center justify-center gap-3 border border-champagne/50 px-7 text-[10px] font-light tracking-[0.35em] whitespace-nowrap text-champagne uppercase transition-colors duration-300 hover:bg-champagne hover:text-ink disabled:cursor-wait disabled:opacity-70"
                >
                  {state === "submitting" ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="al-spin h-3.5 w-3.5 rounded-full border border-current border-t-transparent"
                      />
                      Requesting
                    </>
                  ) : (
                    "Request Private Access"
                  )}
                </button>
              </div>
              <p
                id={hintId}
                role={error ? "alert" : undefined}
                aria-live="polite"
                className={`mt-3 min-h-5 text-left text-xs font-light tracking-wide ${
                  error ? "text-red-300/90" : "text-warmgray"
                }`}
              >
                {error ?? "One quiet email at the unveiling. Nothing more."}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
