import CinematicJourney from "./components/CinematicJourney";
import PrivateAccessForm from "./components/PrivateAccessForm";
import MinimalFooter from "./components/MinimalFooter";

export default function App() {
  return (
    <>
      <main>
        <h1 className="sr-only">
          ALMADERY — Fine Diamonds &amp; Gold Jewellery. Coming soon.
        </h1>
        <CinematicJourney />
        <PrivateAccessForm />
      </main>
      <MinimalFooter />
      <div className="film-grain" aria-hidden="true" />
    </>
  );
}
