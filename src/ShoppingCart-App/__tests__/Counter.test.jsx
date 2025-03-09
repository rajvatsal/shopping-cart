import Counter from '../Counter.jsx'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

const updateValue = vi.fn()
const setup = (value, id = 1) => ({
  user: userEvent.setup(),
  ...render(<Counter {...{ value, updateValue, id }} />),
})

describe('Product Counter', () => {
  it('Add and Subtract buttons', async () => {
    const { user } = setup()
    const addBtn = screen.getByRole('button', { name: '+' })
    const removeBtn = screen.getByRole('button', { name: '-' })

    await user.click(addBtn)
    await user.click(addBtn)
    expect(updateValue).toHaveBeenCalledTimes(2)
    expect(updateValue).toHaveBeenNthCalledWith(2, 1, 2)

    await user.click(removeBtn)
    expect(updateValue).toHaveBeenCalledTimes(3)
    expect(updateValue).toHaveBeenNthCalledWith(3, 1, 0)

    await user.click(addBtn)
    await user.click(removeBtn)
    expect(updateValue).toHaveBeenCalledTimes(5)
    expect(updateValue).toHaveBeenNthCalledWith(4, 1, 2)
    expect(updateValue).toHaveBeenNthCalledWith(5, 1, 0)
  })

  it('Default Value', () => {
    const { getByRole } = setup()
    expect(getByRole('spinbutton').value).toBe('1')
  })

  it('Appearance', () => {
    const element = setup()
    expect(element.container).toMatchInlineSnapshot(`
      <div>
        <button>
          -
        </button>
        <input
          min="0"
          type="number"
          value="1"
        />
        <button>
          +
        </button>
      </div>
    `)
  })

  it("Value doesn't go below 0", async () => {
    const { user, rerender } = setup()
    const getRemove = () => screen.getByRole('button', { name: '-' })

    expect(updateValue).toHaveBeenCalledTimes(0)
    await user.click(getRemove())
    expect(updateValue).toHaveBeenCalledTimes(1)

    rerender(<Counter value={0} id={1} updateValue={updateValue} />)
    await user.click(getRemove())
    expect(updateValue).toHaveBeenCalledTimes(1)
  })

  it('Update Value', async () => {
    const { user } = setup(0)
    const number = screen.getByRole('spinbutton')

    await user.type(number, '5')
    expect(updateValue).toHaveBeenCalledTimes(1)
    expect(updateValue).toHaveBeenCalledWith(1, 5)
    await user.type(number, '2')
    expect(updateValue).toHaveBeenCalledTimes(2)
    expect(updateValue).toHaveBeenCalledWith(1, 2)
  })

  it('Min value is 0', async () => {
    setup()
    const number = screen.getByRole('spinbutton')
    expect(number).toHaveAttribute('min', '0')
  })
})
