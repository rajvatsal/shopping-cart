import { func, number } from 'prop-types'
import { useState } from 'react'

const Counter = ({ initialValue = 1, addFn, subFn }) => {
  const [value, setValue] = useState(initialValue)
  return (
    <>
      <button
        onClick={() => {
          setValue(value + 1)
          addFn()
        }}
      >
        +
      </button>
      <input type="number" value={value} />
      <button
        onClick={() => {
          setValue(value - 1)
          subFn()
        }}
      >
        -
      </button>
    </>
  )
}

Counter.propTypes = {
  initialValue: number,
  addFn: func,
  subFn: func,
}

export default Counter
