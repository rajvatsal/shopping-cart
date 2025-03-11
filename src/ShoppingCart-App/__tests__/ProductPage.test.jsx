import Counter from '../Counter.jsx'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, act } from '@testing-library/react'
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

vi.mock('../Counter.jsx', { spy: true })

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
            <select>
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
            <select>
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
            <select>
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
        </div>
      </section>
    `)
  })

  it('Counter is called correctly', async () => {
    const { router } = setup()
    await screen.findAllByRole('link', { name: 'product page' })

    act(() => {
      router.navigate('/product/1')
    })

    expect(Counter).toHaveBeenCalledWith(
      {
        isInCart: false,
        updateValue: expect.any(Function),
        id: 1,
        value: expect.any(Number),
      },
      undefined
    )
  })

  it('Counter value is synced between pages', async () => {
    const { router, user } = setup()
    await screen.findAllByRole('link', { name: 'product page' })

    act(() => {
      router.navigate('/product/2')
    })

    expect(screen.getByRole('combobox').value).toBe('1')
    await user.click(screen.getByRole('button', { name: 'Add To Cart' }))
    await user.selectOptions(screen.getByRole('combobox'), '5')
    expect(screen.getByRole('combobox').value).toBe('5')

    act(() => {
      router.navigate('/cart-page')
    })

    act(() => {
      router.navigate('/product/2')
    })

    expect(screen.getByRole('combobox').value).toBe('5')
  })

  it("Counter just changing counter shouldn't add it to cart", async () => {
    const { router, user } = setup()

    await screen.findAllByTitle(/category/i)

    act(() => {
      router.navigate('/product/3')
    })

    const btn = screen.getByRole('button', { name: /^add to cart$/i })
    expect(btn.textContent).toBe('Add To Cart')
    await user.selectOptions(screen.getByRole('combobox'), '5')
    expect(screen.getByRole('combobox').value).toBe('5')
    await user.selectOptions(screen.getByRole('combobox'), '9')
    expect(screen.getByRole('combobox').value).toBe('9')
    expect(btn.textContent).not.toMatch(/^remove$/i)
    expect(btn.textContent).toBe('Add To Cart')

    act(() => {
      router.navigate('/cart-page')
    })

    expect(screen.getByRole('generic', { name: /price/i }).textContent).toBe(
      '$0'
    )
  })
})
