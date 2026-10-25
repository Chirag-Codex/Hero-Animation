import { useRef } from 'react'
import Car from './Car'
import Headline from './Headline'
import StatCard from './StatCard'
import useHeroAnimation from '../hooks/useHeroAnimation'
import { stats } from '../data/stats'


const Hero = () => {
  const heroRef         = useRef(null)
  const greenRef        = useRef(null)
  const headlineWrapRef = useRef(null)
  const carRef          = useRef(null)
  const letterRefs      = useRef([])


  const card0 = useRef(null)  
  const card1 = useRef(null) 
  const card2 = useRef(null)  

  const card3 = useRef(null)
  const cardRefs = [card0, card1, card2, card3]

  useHeroAnimation({ heroRef, greenRef, headlineWrapRef, carRef, cardRefs, letterRefs })

  return (
    <section ref={heroRef} className="hero" aria-label="Welcome ItzFizz hero">

      <div className="road-strip">
        <div ref={greenRef} className="green-strip" aria-hidden="true" />
        <div ref={headlineWrapRef} className="headline-wrap">
          <Headline text="WELCOME ITZFIZZ" letterRefs={letterRefs} />
        </div>
      </div>


      <div ref={carRef} className="car-container" aria-hidden="true">
        <Car />
      </div>

      <StatCard
        innerRef={card0}
        value={stats[0].value}
        label={stats[0].label}
        variant={stats[0].variant}
        style={{ top: '6.8vh', left: '50vw' }}
      />

      <StatCard
        innerRef={card1}
        value={stats[1].value}
        label={stats[1].label}
        variant={stats[1].variant}
        style={{ top: '6.8vh', left: '72.5vw' }}
      />

  
      <StatCard
        innerRef={card2}
        value={stats[2].value}
        label={stats[2].label}
        variant={stats[2].variant}
        style={{ top: '73vh', left: '44vw' }}
      />

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
