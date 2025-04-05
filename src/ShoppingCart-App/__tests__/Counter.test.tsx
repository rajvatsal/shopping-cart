import Counter from '../Counter.jsx'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

afterEach(() => {
  vi.clearAllMocks()
  cleanup()
})

const updateValue = vi.fn()
const setup = () => ({
  user: userEvent.setup(),
  ...render(
    <Counter
      {...{ ref: undefined, isInCart: false, value: 1, updateValue, id: 3 }}
    />
  ),
})

describe('Product Counter', () => {
  const getSelect = (): HTMLInputElement => screen.getByRole('combobox')
  it('Default Value', () => {
    setup()
    expect(getSelect().value).toBe('1')
    expect(screen.getAllByRole('option').length).toBe(10)
  })

  it('Functionality', async () => {
    const { user, rerender } = setup()
    const select = getSelect()
    await user.selectOptions(select, '3')

    expect(select.value).toBe('3')
    expect(updateValue).not.toHaveBeenCalledWith()

    await user.selectOptions(select, '10')

    expect(select.value).toBe('10')
    expect(updateValue).not.toHaveBeenCalledWith(1, 10)

    rerender(
      <Counter
        {...{
          ref: undefined,
          value: 1,
          id: 1,
          isInCart: true,
          updateValue: updateValue,
        }}
      />
    )
    await user.selectOptions(screen.getByRole('combobox'), '5')

    expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('5')
    expect(updateValue).toHaveBeenCalledWith(1, 5, false)
  })

  it('Snapshot', () => {
    const element = setup()
    expect(element.container).toMatchInlineSnapshot(`
      <div>
        <select
          aria-label="product count"
        >
          <option
            selected=""
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
