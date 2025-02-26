import App from '../App.jsx'
import Product from '../Product.jsx'
import { describe, it, expect } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import {
  render,
  getByRole,
  waitFor,
  cleanup,
  fireEvent,
} from '@testing-library/react'
import { fetchData } from '../../ShoppingCart-Core/api.js'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

const { products } = await vi.hoisted(
  async () => await import('./mock-products.js')
)

vi.mock('../../ShoppingCart-Core/api.js', () => {
  return {
    fetchData: vi.fn().mockResolvedValue(products),
  }
})

vi.mock('../Product.jsx', { spy: true })

describe('COMPONENT APP', () => {
  it('Heading', async () => {
    const { findByRole } = render(<App />)

    const heading = await findByRole('heading', { level: 1 })
    expect(heading.textContent).toBe('Shopping Cart')
  })

  it('Categories', async () => {
    const user = userEvent.setup()
    const { findAllByTitle, getByRole, getAllByTitle } = render(<App />)

    const items = await findAllByTitle(/category/i)
    expect(items.length).toBe(4)

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

  it('Products Section Heading', async () => {
    const { getByTestId } = render(<App />)
    const container = getByTestId('products-container')
    await waitFor(() => {
      expect(getByRole(container, 'heading', { level: 2 }).textContent).toBe(
        'Products'
      )
    })
  })

  it('Passes Correct Props to Product Component', async () => {
    const { findAllByTitle } = render(<App />)

    await findAllByTitle(/category/i)

    products.forEach((product, i) => {
      expect(Product).toHaveBeenNthCalledWith(
        i + 1,
        { product: products[i], onImageLoad: expect.anything() },
        undefined
      )
    })
  })

  it('Loading Screen', async () => {
    const { getAllByAltText, findAllByTitle, getByTestId } = render(<App />)

    const loadingScreen = getByTestId('loading-screen')
    expect(loadingScreen).toBeInTheDocument()

    await findAllByTitle(/category/i)
    expect(loadingScreen).toBeInTheDocument()

    const images = getAllByAltText('product image')
    expect(loadingScreen).toBeInTheDocument()
    images.forEach((image) => fireEvent.load(image))
    expect(loadingScreen).not.toBeInTheDocument()
  })
})
