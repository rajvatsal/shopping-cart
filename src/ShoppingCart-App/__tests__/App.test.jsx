import App from '../App.jsx'
import Product from '../Product.jsx'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '../../routes.jsx'
import {
  render,
  getByRole,
  waitFor,
  cleanup,
  fireEvent,
  getByTestId,
} from '@testing-library/react'

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

// Setup
const router = createMemoryRouter(routes)
const setup = () => {
  return {
    user: userEvent.setup(),
    ...render(<RouterProvider router={router} />),
  }
}

describe('COMPONENT APP', () => {
  it('Heading', async () => {
    const { findByRole } = setup(<App />)

    const heading = await findByRole('heading', { level: 1 })
    expect(heading.textContent).toBe('Shopping Cart')
  })

  it('Categories', async () => {
    const { user, findAllByTitle, getByRole, getAllByTitle } = setup(<App />)

    const items = await findAllByTitle(/category/i)
    expect(items.length).toBe(4)

    await user.click(getByRole('checkbox', { name: /Jewelery/ }))
    expect(getAllByTitle(/category/i).length).toBe(1)

    await user.click(getByRole('checkbox', { name: /Electronics/i }))
    expect(getAllByTitle(/category/i).length).toBe(2)

    await user.click(getByRole('checkbox', { name: /Electronics/i }))
    expect(getAllByTitle(/category/i).length).toBe(1)

    await user.click(getByRole('checkbox', { name: /women's clothing/i }))
    expect(getAllByTitle(/category/i).length).toBe(2)

    await user.click(getByRole('checkbox', { name: /^men's clothing/i }))
    await user.click(getByRole('checkbox', { name: /Electronics/i }))

    expect(getAllByTitle(/category/i).length).toBe(4)
  })

  it('Products Section Heading', async () => {
    const { getByTestId } = setup(<App />)
    const container = getByTestId('products-container')
    await waitFor(() => {
      expect(getByRole(container, 'heading', { level: 2 }).textContent).toBe(
        'Products'
      )
    })
  })

  it('Passes Correct Props to Product Component', async () => {
    const { findAllByTitle } = setup(<App />)

    await findAllByTitle(/category/i)

    products.forEach((product, i) => {
      expect(Product).toHaveBeenNthCalledWith(
        i + 1,
        {
          product: products[i],
          onImageLoad: expect.any(Function),
          toggleProduct: expect.any(Function),
        },
        undefined
      )
    })
  })

  it('Loading Screen', async () => {
    const { getAllByAltText, findAllByTitle, getByTestId } = setup(<App />)

    const loadingScreen = getByTestId('loading-screen')
    expect(loadingScreen).toBeInTheDocument()

    await findAllByTitle(/category/i)
    expect(loadingScreen).toBeInTheDocument()

    const images = getAllByAltText('product image')
    expect(loadingScreen).toBeInTheDocument()
    images.forEach((image) => fireEvent.load(image))
    expect(loadingScreen).not.toBeInTheDocument()
  })

  it('Add to Cart Button', async () => {
    const opts = setup(<App />)
    const user = opts.user

    const buttons = await opts.findAllByRole('button', { name: 'Add to Cart' })
    buttons.forEach((btn) => expect(btn).toBeInTheDocument())

    const cart = opts.getByTestId('cart-counter')

    expect(buttons[0].textContent).toMatch(/add to cart/i)
    await user.click(buttons[0])
    expect(cart.textContent).toBe('1')
    expect(buttons[0].textContent).toMatch(/remove/i)

    await user.click(buttons[0])
    expect(cart.textContent).toBe('0')
    expect(buttons[0].textContent).toMatch(/add to cart/i)

    expect(buttons[2].textContent).toMatch(/add to cart/i)
    expect(buttons[3].textContent).toMatch(/add to cart/i)
    await user.click(buttons[2])
    await user.click(buttons[3])
    expect(cart.textContent).toBe('2')
    expect(buttons[2].textContent).toMatch(/remove/i)
    expect(buttons[3].textContent).toMatch(/remove/i)

    await user.click(buttons[2])
    await user.click(buttons[3])
    expect(cart.textContent).toBe('0')
    expect(buttons[2].textContent).toMatch(/add to cart/i)
    expect(buttons[3].textContent).toMatch(/add to cart/i)

    expect(buttons[1].textContent).toMatch(/add to cart/i)
    await user.click(buttons[1])
    expect(cart.textContent).toBe('1')
    expect(buttons[1].textContent).toMatch(/remove/i)
  })

  it('Header', async () => {
    const opts = setup(<App />)

    await opts.findAllByTitle(/category/i)
    const header = opts.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(getByTestId(header, /cart-counter/i)).toBeInTheDocument()
    expect(
      getByRole(header, 'heading', { name: /shopping cart/i })
    ).toBeInTheDocument()
  })
})
