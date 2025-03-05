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
    const { user, getByRole, findAllByTitle } = setup()
    await findAllByTitle('category')
    await user.click(screen.getByRole('link', { name: 'cart page' }))

    expect(
      getByRole('generic', { name: 'total price of cart' }).textContent
    ).toBe(`$${products.reduce((acc, p) => acc + p.price, 0)}`)
  })

  it('Items List', async () => {
    const { findAllByTitle, getAllByTestId, user } = setup()
    await findAllByTitle('category')
    await user.click(screen.getByRole('link', { name: 'cart page' }))

    expect(getAllByTestId('product-cart-page').length).toBe(4)
    products.forEach((product, i) => {
      expect(Product).toHaveBeenNthCalledWith(
        i + 1,
        { details: products[i] },
        undefined
      )
    })
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
