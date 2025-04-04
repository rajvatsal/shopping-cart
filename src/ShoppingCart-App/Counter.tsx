import { counter } from './Counter.module.scss'

interface CounterCmp {
  ref: React.RefObject<HTMLSelectElement> | React.RefObject<null> | undefined
  isInCart: boolean
  value: number
  id: number
  updateValue: (id: number, count: number, remove: boolean) => void
}

const Counter = ({ ref, isInCart, value, id, updateValue }: CounterCmp) => {
  return (
    <select
      ref={ref}
      aria-label="product count"
      className={counter}
      defaultValue={value}
      onChange={(e) => {
        if (isInCart) {
          updateValue(id, Number.parseInt(e.target.value), false)
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

export default Counter
