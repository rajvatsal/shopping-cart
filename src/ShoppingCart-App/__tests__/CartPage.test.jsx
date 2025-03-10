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
    const { user } = setup()
    await screen.findAllByTitle('category')

    const btns = screen.getAllByRole('button', { name: /add to cart/i })
    await user.click(btns[0])
    await user.click(btns[2])
    await user.click(screen.getByRole('link', { name: 'cart page' }))

    expect(screen.queryAllByTestId('product-cart-page').length).toBe(2)
    expect(Product).toHaveBeenCalledTimes(2)
    expect(
      screen.getByRole('generic', { name: 'total price of cart' }).textContent
    ).toBe(`$${products[0].price + products[2].price}`)
  })

  it('Product Snapshot', async () => {
    const { user } = setup()

    const btns = await screen.findAllByRole('button', { name: '+' })
    await user.click(btns[0])
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
          <button>
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

  it('Has counter', async () => {
    const { user } = setup()

    const addBtns = await screen.findAllByRole('button', {
      name: /add to cart/i,
    })
    await user.click(addBtns[0])
    await user.click(addBtns[1])
    await user.click(addBtns[3])
    Counter.mockClear()
    await user.click(screen.getByRole('link', { name: /cart page/i }))

    expect(Counter).toHaveBeenCalledTimes(3)
    expect(Counter).toHaveBeenNthCalledWith(
      1,
      {
        value: 1,
        updateValue: expect.any(Function),
        id: 1,
      },
      undefined
    )
    expect(Counter).toHaveBeenNthCalledWith(
      2,
      {
        value: 1,
        updateValue: expect.any(Function),
        id: 2,
      },
      undefined
    )
    expect(Counter).toHaveBeenNthCalledWith(
      3,
      {
        value: 1,
        updateValue: expect.any(Function),
        id: 4,
      },
      undefined
    )

    await user.click(screen.getAllByRole('button', { name: '+' })[0])

    expect(
      screen.getByRole('generic', { name: 'total price of cart' }).textContent
    ).toBe(`$${products[0].price * 2 + products[1].price + products[3].price}`)
  })

  it('Remove button works', async () => {
    const { user, router } = setup()

    let elements = await screen.findAllByRole('button', { name: '+' })
    await user.click(elements[2])

    act(() => {
      router.navigate('cart-page')
    })

    const price = screen.getByRole('generic', { name: /price/i })

    expect(price.textContent).toBe(`$${products[2].price}`)
    expect(screen.getAllByTestId('product-cart-page').length).toBe(1)

    elements = screen.getAllByRole('button', { name: /remove/i })
    await user.click(elements[0])

    expect(screen.queryAllByTestId('product-cart-page').length).toBe(0)
    expect(screen.getByRole('generic', { name: /price/i }).textContent).toBe(
      `$0`
    )
  })
})
