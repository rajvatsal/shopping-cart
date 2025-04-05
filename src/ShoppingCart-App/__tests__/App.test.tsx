import Product from '../Product.tsx'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '../../routes.tsx'
import '@testing-library/jest-dom'
import {
  render,
  act,
  screen,
  getByRole,
  waitFor,
  cleanup,
  fireEvent,
} from '@testing-library/react'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.useRealTimers()
})

const { products } = await vi.hoisted(
  async () => await import('./mock-products.ts')
)

vi.mock('../../ShoppingCart-Core/api.ts', () => {
  return {
    fetchProducts: vi.fn().mockResolvedValue(products),
  }
})

vi.mock('../Product.tsx', { spy: true })

// Setup
const setup = () => {
  const router = createMemoryRouter(routes)
  return {
    user: userEvent.setup(),
    router,
    render: render(<RouterProvider router={router} />),
  }
}

describe('App', () => {
  const getTitles = async () => screen.findAllByTitle(/category/i)
  it('Heading', async () => {
    setup()

    const heading = await screen.findByRole('heading', { level: 1 })
    expect(heading.textContent).toBe('Shopping Cart')
  })

  it('Categories', async () => {
    const { user } = setup()

    const items = await getTitles()
    expect(items.length).toBe(4)

    await user.click(screen.getByRole('checkbox', { name: /Jewelery/ }))
    expect(screen.getAllByTitle(/category/i).length).toBe(1)

    await user.click(screen.getByRole('checkbox', { name: /Electronics/i }))
    expect(screen.getAllByTitle(/category/i).length).toBe(2)

    await user.click(screen.getByRole('checkbox', { name: /Electronics/i }))
    expect(screen.getAllByTitle(/category/i).length).toBe(1)

    await user.click(
      screen.getByRole('checkbox', { name: /women's clothing/i })
    )
    expect(screen.getAllByTitle(/category/i).length).toBe(2)

    await user.click(screen.getByRole('checkbox', { name: /^men's clothing/i }))
    await user.click(screen.getByRole('checkbox', { name: /Electronics/i }))

    expect(screen.getAllByTitle(/category/i).length).toBe(4)
  })

  it('Products Section Heading', async () => {
    setup()
    const container = screen.getByTestId('products-container')
    await waitFor(() => {
      expect(getByRole(container, 'heading', { level: 2 }).textContent).toMatch(
        /Products/i
      )
    })
  })

  it('Passes Correct Props to Product Component', async () => {
    setup()

    await getTitles()

    products.forEach((_, i) => {
      expect(Product).toHaveBeenNthCalledWith(
        i + 1,
        {
          product: products[i],
        },
        undefined
      )
    })
  })

  it('Loading Screen', async () => {
    setup()
    const loadingScreen = screen.getByTestId('loading-screen')

    expect(loadingScreen).toBeInTheDocument()

    await getTitles()

    expect(loadingScreen).toBeInTheDocument()

    const images = screen.getAllByAltText('product image')

    expect(loadingScreen).toBeInTheDocument()

    vi.useFakeTimers()
    images.forEach((image) => fireEvent.load(image))

    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(loadingScreen).not.toBeInTheDocument()
  })

  it('Header Snapshot', async () => {
    setup()

    await getTitles()
    expect(screen.getByRole('banner')).toMatchInlineSnapshot(`
      <header>
        <a
          data-discover="true"
          href="/"
        >
          <h1>
            Shopping Cart
          </h1>
        </a>
        <a
          aria-label="cart page"
          data-discover="true"
          href="/cart-page"
        >
          <svg
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span
            data-testid="cart-counter"
          >
            0
          </span>
        </a>
      </header>
    `)
  })

  it('Header logo links to home page', async () => {
    const { user, router } = setup()

    await screen.findAllByTitle(/category/i)
    expect(router.state.location.pathname).toBe('/')
    await user.click(screen.getByRole('link', { name: /cart page/i }))
    expect(router.state.location.pathname).toBe('/cart-page')
    await user.click(screen.getByRole('link', { name: 'Shopping Cart' }))
    expect(router.state.location.pathname).toBe('/')
  })

  it('Header shows cart count', async () => {
    const getProductLinks = async () =>
      screen.findAllByRole('link', { name: 'product page' })
    const { user } = setup()
    let products = await getProductLinks()
    await user.click(products[0])

    expect(screen.getByTestId('cart-counter').textContent).toBe('0')

    await user.click(screen.getByRole('button', { name: /add to cart/i }))

    expect(screen.getByTestId('cart-counter').textContent).toBe('1')

    await user.click(screen.getByRole('link', { name: 'Shopping Cart' }))
    products = await getProductLinks()
    await user.click(products[2])
    await user.click(screen.getByRole('button', { name: /add to cart/i }))

    expect(screen.getByTestId('cart-counter').textContent).toBe('2')

    await user.click(screen.getByRole('link', { name: 'Shopping Cart' }))
    products = await getProductLinks()
    await user.click(products[1])
    await user.click(screen.getByRole('button', { name: /add to cart/i }))

    expect(screen.getByTestId('cart-counter').textContent).toBe('3')

    await user.click(screen.getByRole('link', { name: 'Shopping Cart' }))
    products = await getProductLinks()
    await user.click(products[3])
    await user.click(screen.getByRole('button', { name: /add to cart/i }))

    expect(screen.getByTestId('cart-counter').textContent).toBe('4')

    await user.click(screen.getByRole('button', { name: /remove/i }))

    expect(screen.getByTestId('cart-counter').textContent).toBe('3')

    await user.click(screen.getByRole('link', { name: 'Shopping Cart' }))
    products = await getProductLinks()
    await user.click(products[1])
    await user.click(screen.getByRole('button', { name: /remove/i }))

    expect(screen.getByTestId('cart-counter').textContent).toBe('2')

    await user.click(screen.getByRole('link', { name: 'Shopping Cart' }))
    products = await getProductLinks()
    await user.click(products[2])
    await user.click(screen.getByRole('button', { name: /remove/i }))

    expect(screen.getByTestId('cart-counter').textContent).toBe('1')
  })
})
