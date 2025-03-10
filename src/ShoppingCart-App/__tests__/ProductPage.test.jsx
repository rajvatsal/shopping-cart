import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { routes } from '../../routes.jsx'
import { createMemoryRouter, RouterProvider } from 'react-router'

const setup = () => {
  const router = createMemoryRouter(routes, { initialEntries: ['/'] })
  return {
    user: userEvent.setup(),
    render: render(<RouterProvider router={router} />),
    router: router,
  }
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.useRealTimers()
})

const { products } = await vi.hoisted(
  async () => await import('./mock-products.js')
)

vi.mock('../../ShoppingCart-Core/api.js', () => {
  return {
    fetchData: vi.fn().mockResolvedValue(products),
  }
})

describe('Product Page', () => {
  const getProductLinks = async () =>
    screen.findAllByRole('link', { name: 'product page' })
  const goToHome = async (usr) =>
    usr.click(screen.getByRole('link', { name: 'Shopping Cart' }))
  const getSection = (id) => screen.getByTestId(`product-${id}-details`)

  it('Snapshot', async () => {
    const { user } = setup()
    let pages = await getProductLinks()
    await user.click(pages[0])

    expect(getSection(products[0].id)).toMatchInlineSnapshot(`
      <section
        data-testid="product-1-details"
      >
        <img
          alt="product image"
          src="image-url"
        />
        <div>
          <div>
            <span>
              electronics
            </span>
            <span />
          </div>
          <h3>
            skateboard
          </h3>
          <p>
            cool skateboard
          </p>
          <div>
            <button
              type="button"
            >
              Add To Cart
            </button>
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
          </div>
        </div>
      </section>
    `)
    await goToHome(user)

    pages = await getProductLinks()
    await user.click(pages[1])

    expect(getSection(products[1].id)).toMatchInlineSnapshot(`
      <section
        data-testid="product-2-details"
      >
        <img
          alt="product image"
          src="image-url"
        />
        <div>
          <div>
            <span>
              jewelery
            </span>
            <span />
          </div>
          <h3>
            boat
          </h3>
          <p>
            cool skateboard
          </p>
          <div>
            <button
              type="button"
            >
              Add To Cart
            </button>
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
          </div>
        </div>
      </section>
    `)
    await goToHome(user)

    pages = await getProductLinks()
    await user.click(pages[3])

    expect(getSection(products[3].id)).toMatchInlineSnapshot(`
      <section
        data-testid="product-4-details"
      >
        <img
          alt="product image"
          src="image-url"
        />
        <div>
          <div>
            <span>
              women's clothing
            </span>
            <span />
          </div>
          <h3>
            bike
          </h3>
          <p>
            cool skateboard
          </p>
          <div>
            <button
              type="button"
            >
              Add To Cart
            </button>
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
          </div>
        </div>
      </section>
    `)
  })
})
