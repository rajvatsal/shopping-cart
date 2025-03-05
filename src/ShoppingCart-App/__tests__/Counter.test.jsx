import Counter from '../Counter.jsx'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

beforeEach(() => {
  vi.clearAllMocks()
})

const addFn = vi.fn()
const subFn = vi.fn()
const setup = (initialValue) => ({
  user: userEvent.setup(),
  ...render(<Counter {...{ initialValue, addFn, subFn }} />),
})

describe('Product Counter', () => {
  it('Add and Subtract buttons', async () => {
    const { user, getByRole } = setup(10)
    const addBtn = getByRole('button', { name: '+' })
    const removeBtn = getByRole('button', { name: '-' })
    const input = getByRole('spinbutton')

    expect(input.value).toBe('10')

    await user.click(addBtn)
    await user.click(addBtn)
    expect(input.value).toBe('12')

    await user.click(removeBtn)
    expect(input.value).toBe('11')

    await user.click(addBtn)
    await user.click(removeBtn)
    expect(addFn).toBeCalledTimes(3)
    expect(subFn).toBeCalledTimes(2)
  })

  it('Default Value', () => {
    const { getByRole } = setup()
    expect(getByRole('spinbutton').value).toBe('1')
  })

  it('Appearance', () => {
    const element = setup()
    expect(element.container.firstChild).toMatchInlineSnapshot(`
      <button>
        +
      </button>
    `)
  })
})
