import carSrc from '../assets/car.png'

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
