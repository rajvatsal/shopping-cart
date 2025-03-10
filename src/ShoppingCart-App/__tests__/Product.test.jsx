import { render, screen, cleanup } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, vi, expect, afterEach } from 'vitest'
import { routes } from '../../routes.jsx'
import { createMemoryRouter, RouterProvider } from 'react-router'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.useRealTimers()
})

const { products } = await vi.hoisted(
  async () => await import('./mock-products.js')
)

vi.mock('../../../ShoppingCart-Core/api.js', () => {
  return {
    fetchData: vi.fn().mockResolvedValue(products),
  }
})

const setup = () => {
  const router = createMemoryRouter(routes, { initialEntries: ['/'] })
  return {
    user: userEvent.setup(),
    router: router,
    render: render(<RouterProvider router={router} />),
  }
}

describe('Product comonent in index page', () => {
  it('Snapshot', async () => {
    setup()
    await screen.findAllByTitle(/category/i)
    expect(
      screen.getAllByRole('link', { name: 'product page' })[0]
    ).toMatchInlineSnapshot(`
      <a
        aria-label="product page"
        data-discover="true"
        href="/product/1"
      >
        <div
          class="_product__imgContainer_03d30d"
        >
          <img
            alt="product image"
            src="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
          />
        </div>
        <div
          title="category"
        >
          men's clothing
        </div>
        <div
          title="name"
        >
          Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops
        </div>
        <div
          class="_product__priceContainer_03d30d"
        >
          <span
            title="price"
          >
            $
            109.95
          </span>
          <span
            title="rating"
          >
            3.9
          </span>
        </div>
      </a>
    `)
  })

  it('Product page link', async () => {
    const { user, router } = setup()
    const homeLink = screen.getByRole('link', { name: 'Shopping Cart' })

    await screen.findAllByTitle(/category/i)

    expect(router.state.location.pathname).toBe('/')

    await user.click(screen.getAllByRole('link', { name: 'product page' })[0])

    expect(router.state.location.pathname).toBe('/product/1')

    await user.click(homeLink)
    await user.click(screen.getAllByRole('link', { name: 'product page' })[2])
    expect(router.state.location.pathname).toBe('/product/3')
  })
})
