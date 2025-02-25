import App from '../App.jsx'
import { describe, it, expect } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { render, getByRole, prettyDOM } from '@testing-library/react'
import { fetchData } from '../../ShoppingCart-Core/api.js'
import Product from '../Product.jsx'

afterEach(() => vi.clearAllMocks())

const { products } = await vi.hoisted(
  async () => await import('./mock-products.js')
)

vi.mock('../../ShoppingCart-Core/api.js', () => {
  return {
    fetchData: vi.fn(async () => products),
  }
})

vi.mock('../Product.jsx', { spy: true })

describe('COMPONENT APP', () => {
  it('Heading', () => {
    const { getByRole } = render(<App />)

    const heading = getByRole('heading', { level: 1 })
    expect(heading.textContent).toBe('Shopping Cart')
  })

  it('Categories', async () => {
    const user = userEvent.setup()
    const { getByRole, getAllByTitle } = render(<App />)

    expect(getAllByTitle(/category/i).length).toBe(4)

    await user.click(getByRole('checkbox', { name: /Jewelery/ }))
    expect(getAllByTitle(/category/i).length).toBe(1)

    await user.click(getByRole('checkbox', { name: /Electronics/i }))
    expect(getAllByTitle(/category/i).length).toBe(2)

    await user.click(getByRole('checkbox', { name: /Electronics/i }))
    expect(getAllByTitle(/category/i).length).toBe(1)

    await user.click(getByRole('checkbox', { name: /women\'s clothing/i }))
    expect(getAllByTitle(/category/i).length).toBe(2)

    await user.click(getByRole('checkbox', { name: /^men\'s clothing/i }))
    await user.click(getByRole('checkbox', { name: /Electronics/i }))

    expect(getAllByTitle(/category/i).length).toBe(4)
  })

  it('Products Section Heading', () => {
    const { getByTestId } = render(<App />)
    const container = getByTestId('products-container')
    expect(getByRole(container, 'heading', { level: 2 }).textContent).toBe(
      'Products'
    )
  })

  it('Passes Correct Props to Product Component', () => {
    const { getByTestId } = render(<App />)

    products.forEach((product, i) => {
      expect(Product).toHaveBeenNthCalledWith(
        i + 1,
        { product: products[i] },
        undefined
      )
    })
  })
})
