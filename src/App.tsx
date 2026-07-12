import { StoryJourney } from './components/StoryJourney'
import { PrivateAccessForm } from './components/PrivateAccessForm'
import { MinimalFooter } from './components/MinimalFooter'

export default function App() {
  return (
    <main className="relative bg-obsidian text-soft-ivory">
      <a href="#access-heading" className="skip-link">
        Skip to private access
      </a>

      <h1 className="sr-only">
        ALMADERY — Fine Diamonds &amp; Gold Jewellery. The creation of an
        engagement ring, from rough diamond to timeless form.
      </h1>

      <StoryJourney />
      <PrivateAccessForm />
      <MinimalFooter />
    </main>
  )
}
