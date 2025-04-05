import Product from '../cart-page/Product.jsx'
import Counter from '../Counter.jsx'
import { vi, describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup, act } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { routes } from '../../routes.jsx'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup.js'

afterEach(() => {
  vi.clearAllMocks()
  cleanup()
})

// Mock api calls
const { products } = await vi.hoisted(
  async () => await import('./mock-products.js')
)

vi.mock('../../ShoppingCart-Core/api.js', () => {
  return {
    fetchProducts: vi.fn().mockResolvedValue(products),
  }
})
vi.mock('../cart-page/Product.jsx', { spy: true })
vi.mock('../Counter.jsx', { spy: true })

// Setup
const setup = () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ['/'],
  })
  return {
    user: userEvent.setup(),
    router,
    render: render(<RouterProvider router={router} />),
  }
}

describe('Cart Page', () => {
  const addToCart = async (usr: UserEvent) =>
    usr.click(screen.getByRole('button', { name: /add to cart/i }))
  const selectOption = async (usr: UserEvent, opt: string, count: number) =>
    usr.selectOptions(
      screen.getAllByRole('combobox', { name: 'product count' })[count],
      opt
    )

  it('Loads in outlet', async () => {
    const { user } = setup()

    await screen.findAllByTitle('category')

    const products = screen.getByTestId('products-container')
    expect(products).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /cart page/i }))
    screen.getByTestId('cart-container')
    expect(products).not.toBeInTheDocument()
  })

  it('Heading', async () => {
    const { user, router } = setup()

    await screen.findAllByTitle('category')
    await user.click(screen.getByRole('link', { name: 'cart page' }))
    expect(router.state.location.pathname).toBe('/cart-page')
  })

  it('Total price', async () => {
    const { user } = setup()
    await screen.findAllByTitle('category')
    await user.click(screen.getByRole('link', { name: 'cart page' }))
  })

  it('Initially has 0 price and products', async () => {
    const { user } = setup()
    await screen.findAllByTitle('category')
    await user.click(screen.getByRole('link', { name: 'cart page' }))

    expect(screen.queryAllByTestId('product-cart-page').length).toBe(0)
    expect(Product).not.toHaveBeenCalled()
    expect(
      screen.getByRole('generic', { name: 'total price of cart' }).textContent
    ).toBe(`$0`)
  })

  it('Price', async () => {
    const { user, router } = setup()
    await screen.findAllByTitle('category')

    act(() => {
      router.navigate('/product/3')
    })
    await addToCart(user)
    act(() => {
      router.navigate('/product/1')
    })
    await addToCart(user)

    await user.click(screen.getByRole('link', { name: 'cart page' }))

    expect(screen.queryAllByTestId('product-cart-page').length).toBe(2)
    expect(Product).toHaveBeenCalledTimes(2)
    expect(
      screen.getByRole('generic', { name: 'total price of cart' }).textContent
    ).toBe(`$${products[0].price + products[2].price}`)
  })

  it('Product Snapshot', async () => {
    const { user, router } = setup()

    await screen.findAllByRole('link', { name: 'product page' })

    act(() => {
      router.navigate('/product/1')
    })
    await addToCart(user)

    await user.click(screen.getByRole('link', { name: 'cart page' }))

    expect(screen.getByTestId('product-cart-page')).toMatchInlineSnapshot(`
      <div
        data-testid="product-cart-page"
      >
        <div>
          <h2
            title="name"
          >
            skateboard
          </h2>
          <p
            title="price"
          >
            $
            500
          </p>
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
            <button
              aria-label="remove"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                  fill-rule="evenodd"
                />
              </svg>
              <svg
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <img
          alt="product image"
          src="image-url"
        />
      </div>
    `)
  })

  it('Counter is called correctly', async () => {
    const { user, router } = setup()

    await screen.findAllByRole('link', { name: 'product page' })

    for (let i = 0; i < 3; i++) {
      act(() => {
        router.navigate('/product/' + (i + 1))
      })
      await addToCart(user)
    }

    vi.mocked(Counter).mockClear()
    await user.click(screen.getByRole('link', { name: 'cart page' }))

    expect(Counter).toHaveBeenCalledTimes(3)
    expect(Counter).toHaveBeenNthCalledWith(
      1,
      {
        ref: undefined,
        isInCart: true,
        value: 1,
        updateValue: expect.any(Function),
        id: 1,
      },
      undefined
    )
    expect(Counter).toHaveBeenNthCalledWith(
      2,
      {
        ref: undefined,
        isInCart: true,
        updateValue: expect.any(Function),
        value: 1,
        id: 2,
      },
      undefined
    )
    expect(Counter).toHaveBeenNthCalledWith(
      3,
      {
        ref: undefined,
        isInCart: true,
        updateValue: expect.any(Function),
        value: 1,
        id: 3,
      },
      undefined
    )

    await selectOption(user, '5', 0)

    expect(
      screen.getByRole('generic', { name: 'total price of cart' }).textContent
    ).toBe(`$${products[0].price * 5 + products[1].price + products[2].price}`)

    await selectOption(user, '2', 1)

    expect(
      screen.getByRole('generic', { name: 'total price of cart' }).textContent
    ).toBe(
      `$${products[0].price * 5 + products[1].price * 2 + products[2].price}`
    )
  })

  it('Remove button works', async () => {
    const { user, router } = setup()

    await screen.findAllByRole('link', { name: 'product page' })

    act(() => {
      router.navigate('/product/3')
    })
    await addToCart(user)
    act(() => {
      router.navigate('/cart-page')
    })

    const price = screen.getByRole('generic', { name: /price/i })

    expect(price.textContent).toBe(`$${products[2].price}`)
    expect(screen.getAllByTestId('product-cart-page').length).toBe(1)

    const elements = screen.getAllByRole('button', { name: /remove/i })
    await user.click(elements[0])

    expect(screen.queryAllByTestId('product-cart-page').length).toBe(0)
    expect(screen.getByRole('generic', { name: /price/i }).textContent).toBe(
      `$0`
    )
  })

  it('Content when zero items in cart', async () => {
    const { router } = setup()

    await screen.findAllByRole('link', { name: 'product page' })
    act(() => {
      router.navigate('cart-page')
    })

    expect(screen.getByTestId('cart-container')).toMatchInlineSnapshot(`
      <section
        data-testid="cart-container"
      >
        <h2>
          Cart is empty :..(
        </h2>
        <div
          aria-label="total price of cart"
        >
          $
          0
        </div>
      </section>
    `)
  })
})
