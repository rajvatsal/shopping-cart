import Counter from '../Counter.jsx'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

afterEach(() => {
  vi.clearAllMocks()
  cleanup()
})

const updateValue = vi.fn()
const setup = (value, id = 1, isInCart = false) => ({
  user: userEvent.setup(),
  ...render(<Counter {...{ isInCart, value, updateValue, id }} />),
})

describe('Product Counter', () => {
  it('Default Value', () => {
    setup()
    expect(screen.getByRole('combobox').value).toBe('1')
    expect(screen.getAllByRole('option').length).toBe(10)
  })

  it('Functionality', async () => {
    const { user, rerender } = setup()
    const select = screen.getByRole('combobox')
    await user.selectOptions(select, '3')

    expect(select.value).toBe('3')
    expect(updateValue).not.toHaveBeenCalledWith()

    await user.selectOptions(select, '10')

    expect(select.value).toBe('10')
    expect(updateValue).not.toHaveBeenCalledWith(1, 10)

    rerender(
      <Counter
        {...{ value: 1, id: 1, isInCart: true, updateValue: updateValue }}
      />
    )
    await user.selectOptions(screen.getByRole('combobox'), '5')

    expect(screen.getByRole('combobox').value).toBe('5')
    expect(updateValue).toHaveBeenCalledWith(1, 5)
  })

  it('Snapshot', () => {
    const element = setup()
    expect(element.container).toMatchInlineSnapshot(`
      <div>
        <select>
          <option
            value="1"
          >
            1
          </option>
          <option
            value="2"
          >
            2
          </option>
          <option
            value="3"
          >
            3
          </option>
          <option
            value="4"
          >
            4
          </option>
          <option
            value="5"
          >
            5
          </option>
          <option
            value="6"
          >
            6
          </option>
          <option
            value="7"
          >
            7
          </option>
          <option
            value="8"
          >
            8
          </option>
          <option
            value="9"
          >
            9
          </option>
          <option
            value="10"
          >
            10
          </option>
        </select>
      </div>
    `)
  })
})
