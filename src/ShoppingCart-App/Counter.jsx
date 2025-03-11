import { counter } from './Counter.module.scss'
import { func, number, bool } from 'prop-types'

const Counter = ({ isInCart, value, id, updateValue }) => {
  return (
    <select
      aria-label="product count"
      className={counter}
      defaultValue={value}
      onChange={(e) => {
        if (isInCart) {
          updateValue(id, Number.parseInt(e.target.value))
        }
      }}
    >
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select>
  )
}

Counter.propTypes = {
  value: number,
  id: number,
  updateValue: func,
  isInCart: bool,
}

export default Counter
