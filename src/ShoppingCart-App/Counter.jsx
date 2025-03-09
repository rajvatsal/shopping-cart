import {
  counter,
  counter__addBtn,
  counter__subBtn,
} from './Counter.module.scss'
import { func, number } from 'prop-types'

const Counter = ({ value = 1, id, updateValue }) => {
  const addFn = () => {
    updateValue(id, value + 1)
  }

  const subFn = () => {
    updateValue(id, value - 1)
  }

  return (
    <div className={counter}>
      <button
        className={counter__subBtn}
        onClick={() => {
          if (value === 0) return
          subFn()
        }}
      >
        -
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          updateValue(id, Number.parseInt(e.target.value))
        }}
        min="0"
      />
      <button
        className={counter__addBtn}
        onClick={() => {
          addFn()
        }}
      >
        +
      </button>
    </div>
  )
}

Counter.propTypes = {
  value: number,
  id: number,
  updateValue: func,
}

export default Counter
