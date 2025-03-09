import { func, number } from 'prop-types'

const Counter = ({ value = 1, id, updateValue }) => {
  const addFn = () => {
    updateValue(id, value + 1)
  }

  const subFn = () => {
    updateValue(id, value - 1)
  }

  return (
    <>
      <button
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
        onClick={() => {
          addFn()
        }}
      >
        +
      </button>
    </>
  )
}

Counter.propTypes = {
  value: number,
  id: number,
  updateValue: func,
}

export default Counter
