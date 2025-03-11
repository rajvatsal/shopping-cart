import Product from '../cart-page/Product.jsx'
import Counter from '../Counter.jsx'
import { vi, describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup, act } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { routes } from '../../routes.jsx'
import { RouterProvider, createMemoryRouter } from 'react-router'

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
    fetchData: vi.fn().mockResolvedValue(products),
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
  const addToCart = async (usr) =>
    usr.click(screen.getByRole('button', { name: /add to cart/i }))
  const selectOption = async (usr, opt, count) =>
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
          <h2>
            skateboard
          </h2>
          <h2>
            $
            500
          </h2>
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
            class="undefined btn--primary"
          >
            remove
          </button>
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

    Counter.mockClear()
    await user.click(screen.getByRole('link', { name: 'cart page' }))

    expect(Counter).toHaveBeenCalledTimes(3)
    expect(Counter).toHaveBeenNthCalledWith(
      1,
      {
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
        isInCart: true,
        value: 1,
        updateValue: expect.any(Function),
        id: 2,
      },
      undefined
    )
    expect(Counter).toHaveBeenNthCalledWith(
      3,
      {
        isInCart: true,
        value: 1,
        updateValue: expect.any(Function),
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

    let elements = screen.getAllByRole('button', { name: /remove/i })
    await user.click(elements[0])

    expect(screen.queryAllByTestId('product-cart-page').length).toBe(0)
    expect(screen.getByRole('generic', { name: /price/i }).textContent).toBe(
      `$0`
    )
  })
})
