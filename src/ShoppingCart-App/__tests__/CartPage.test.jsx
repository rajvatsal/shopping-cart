import Product from '../cart-page/Product.jsx'
import { vi, describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { routes } from '../../routes.jsx'
import { RouterProvider, createMemoryRouter } from 'react-router'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
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

// Setup
const setup = () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ['/'],
  })
  return {
    user: userEvent.setup(),
    ...render(<RouterProvider router={router} />),
  }
}

describe('Cart Page', () => {
  it('Cart Page Loads correctly', async () => {
    const { user, getByRole, findAllByTitle, getByTestId } = setup()

    await findAllByTitle('category')

    const products = getByTestId('products-container')
    expect(products).toBeInTheDocument()
    await user.click(getByRole('link', { name: /cart page/i }))
    getByTestId('cart-container')
    expect(products).not.toBeInTheDocument()
  })

  it('Heading', async () => {
    const { findAllByTitle, getByRole, user } = setup()

    await findAllByTitle('category')
    await user.click(getByRole('link', { name: 'cart page' }))
    expect(getByRole('heading', { name: /cart page/i })).toBeInTheDocument()
  })

  it('Total Price', async () => {
    const { user, findAllByTitle } = setup()
    await findAllByTitle('category')
    await user.click(screen.getByRole('link', { name: 'cart page' }))
  })

  it('Cart is initially empty', async () => {
    const { user, findAllByTitle, queryAllByTestId, getByRole } = setup()
    await findAllByTitle('category')
    await user.click(screen.getByRole('link', { name: 'cart page' }))

    expect(queryAllByTestId('product-cart-page').length).toBe(0)
    expect(Product).not.toHaveBeenCalled()
    expect(
      getByRole('generic', { name: 'total price of cart' }).textContent
    ).toBe(`$0`)
  })

  it('Cart is functional', async () => {
    const { user, findAllByTitle, getAllByRole, getByRole, queryAllByTestId } =
      setup()
    await findAllByTitle('category')

    const btns = getAllByRole('button', { name: /add to cart/i })
    await user.click(btns[0])
    await user.click(btns[2])
    await user.click(getByRole('link', { name: 'cart page' }))

    expect(queryAllByTestId('product-cart-page').length).toBe(2)
    expect(Product).toHaveBeenCalledTimes(2)
    expect(
      getByRole('generic', { name: 'total price of cart' }).textContent
    ).toBe(`$${products[0].price + products[2].price}`)
  })

  it('Product', () => {
    const element = render(<Product details={products[0]} />)
    expect(element.container.firstChild).toMatchInlineSnapshot(`
      <div
        data-testid="product-cart-page"
      >
        <h2>
          skateboard
        </h2>
        <h2>
          $
          500
        </h2>
      </div>
    `)
  })
})
