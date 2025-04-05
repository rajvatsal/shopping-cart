import Categories from '../CategoryFilter.jsx'
import { vi, describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

describe('CATEGORY FILTER', () => {
  it('Structure', () => {
    const { getByTestId } = render(
      <Categories add={() => 3} remove={() => 3} />
    )
    const container = getByTestId('categories-component')

    expect(container).toMatchSnapshot()
  })

  it('Checkbox works', async () => {
    const add = vi.fn()
    const remove = vi.fn()
    const user = userEvent.setup()
    const { getByRole } = render(<Categories add={add} remove={remove} />)

    expect(add).toBeCalledTimes(0)
    expect(remove).toBeCalledTimes(0)

    await user.click(getByRole('checkbox', { name: /jewelery/i }))
    expect(add).toBeCalledTimes(1)

    await user.click(getByRole('checkbox', { name: /jewelery/i }))
    expect(remove).toBeCalledTimes(1)

    await user.click(getByRole('checkbox', { name: /electronics/i }))
    expect(add).toBeCalledTimes(2)

    await user.click(getByRole('checkbox', { name: /^men's clothing/i }))
    expect(add).toBeCalledTimes(3)

    await user.click(getByRole('checkbox', { name: /women's clothing/i }))
    expect(add).toBeCalledTimes(4)

    await user.click(getByRole('checkbox', { name: /^men's clothing/i }))
    expect(remove).toBeCalledTimes(2)
  })
})
