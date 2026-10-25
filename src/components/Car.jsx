import carSrc from '../assets/car.png'

/**
 * Car – renders the exact reference McLaren 720S artwork.
 * The image (car.png) was extracted from the reference screenshot with
 * transparent background. No CSS shadow or glow is applied.
 *
 * Sizing via CSS class .car-svg:
 *   height: 25vh  (≈ 225px at 900px viewport)
 *   width: auto   → preserves aspect ratio ≈ 2.3:1 → ~27.5vw at 1886px
 *
 * Swap: replace car.png in src/assets/ to change the artwork.
 */
const Car = () => (
  <img
    src={carSrc}
    alt=""
    aria-hidden="true"
    className="car-svg"
    draggable="false"
  />
)

export default Car
