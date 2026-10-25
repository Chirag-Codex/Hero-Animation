import Hero from './components/Hero'

/**
 * FIX 2: Hero is the ONLY content on the page.
 * No below-hero section, no footer, no placeholder.
 * Total document height = 100svh + ScrollTrigger pin spacer (+=250vh).
 * The page cannot scroll past the pin end.
 */
const App = () => <Hero />

export default App
