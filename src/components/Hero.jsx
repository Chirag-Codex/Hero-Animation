import { useRef } from 'react'
import Car from './Car'
import Headline from './Headline'
import StatCard from './StatCard'
import useHeroAnimation from '../hooks/useHeroAnimation'
import { stats } from '../data/stats'

/**
 * Hero – layout owner and ref registry.
 *
 * STEP 7 – Card positions (measured from reference):
 *
 *   TOP PAIR (top: 6.8vh):
 *     58% lime  → left: 50vw
 *     27% dark  → left: 72.5vw   (gap ≈ 2.5vw between cards)
 *
 *   BOTTOM PAIR (top: 73vh):
 *     23% sky   → left: 44vw
 *     40% orange→ left: 66.5vw
 *
 *   ~8.7vh clear space between each pair and the strip edge.
 *   Strip occupies 36.5vh → 64vh, so:
 *     Top cards bottom = 6.8vh + 21vh = 27.8vh  (36.5 - 27.8 = 8.7vh gap ✓)
 *     Bottom cards top = 73vh           (73 - 64 = 9vh gap ✓)
 */
const Hero = () => {
  const heroRef         = useRef(null)
  const greenRef        = useRef(null)
  const headlineWrapRef = useRef(null)
  const carRef          = useRef(null)
  const letterRefs      = useRef([])

  // Individual refs so React hooks rules are never violated
  const card0 = useRef(null)  // lime   58%
  const card1 = useRef(null)  // dark   27%
  const card2 = useRef(null)  // sky    23%
  const card3 = useRef(null)  // orange 40%

  // Animation order: 58 → 23 → 27 → 40 (per STEP 8)
  const cardRefs = [card0, card1, card2, card3]

  useHeroAnimation({ heroRef, greenRef, headlineWrapRef, carRef, cardRefs, letterRefs })

  return (
    <section ref={heroRef} className="hero" aria-label="Welcome ItzFizz hero">

      {/* ─── STEP 2: Road strip (dark base + green layer + headline) ─── */}
      <div className="road-strip">
        <div ref={greenRef} className="green-strip" aria-hidden="true" />
        <div ref={headlineWrapRef} className="headline-wrap">
          <Headline text="WELCOME ITZFIZZ" letterRefs={letterRefs} />
        </div>
      </div>

      {/* ─── STEP 3: Car (GSAP drives translateX) ─── */}
      <div ref={carRef} className="car-container" aria-hidden="true">
        <Car />
      </div>

      {/* ─── STEP 7: Stat cards – exact vw/vh positions ─── */}

      {/* TOP-LEFT: lime 58% → left 50vw, top 6.8vh */}
      <StatCard
        innerRef={card0}
        value={stats[0].value}
        label={stats[0].label}
        variant={stats[0].variant}
        style={{ top: '6.8vh', left: '50vw' }}
      />

      {/* TOP-RIGHT: dark 27% → left 72.5vw, top 6.8vh */}
      <StatCard
        innerRef={card1}
        value={stats[1].value}
        label={stats[1].label}
        variant={stats[1].variant}
        style={{ top: '6.8vh', left: '72.5vw' }}
      />

      {/* BOTTOM-LEFT: sky 23% → left 44vw, top 73vh */}
      <StatCard
        innerRef={card2}
        value={stats[2].value}
        label={stats[2].label}
        variant={stats[2].variant}
        style={{ top: '73vh', left: '44vw' }}
      />

      {/* BOTTOM-RIGHT: orange 40% → left 66.5vw, top 73vh */}
      <StatCard
        innerRef={card3}
        value={stats[3].value}
        label={stats[3].label}
        variant={stats[3].variant}
        style={{ top: '73vh', left: '66.5vw' }}
      />
    </section>
  )
}

export default Hero
