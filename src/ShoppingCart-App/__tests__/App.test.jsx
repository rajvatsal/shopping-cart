import Product from '../Product.jsx'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '../../routes.jsx'
import {
  render,
  prettyDOM,
  act,
  screen,
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
const setup = () => {
  const router = createMemoryRouter(routes)
  return {
    user: userEvent.setup(),
    router,
    render: render(<RouterProvider router={router} />),
  }
}

describe('App', () => {
  const getAddBtns = async () => screen.findAllByRole('button', { name: '+' })
  const getSubBtns = async () => screen.findAllByRole('button', { name: '-' })
  const getCartPageLink = () => screen.getByRole('link', { name: 'cart page' })
  const getTitles = async () => screen.findAllByTitle(/category/i)
  const getProductCounterInput = async () => screen.findAllByRole('spinbutton')
  const getPrice = () =>
    screen.getByRole('generic', { name: 'total price of cart' })

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
      expect(getByRole(container, 'heading', { level: 2 }).textContent).toBe(
        'Products'
      )
    })
  })

  it('Passes Correct Props to Product Component', async () => {
    setup()

    await getTitles()

    products.forEach((product, i) => {
      expect(Product).toHaveBeenNthCalledWith(
        i + 1,
        {
          product: products[i],
          onImageLoad: expect.any(Function),
          toggleProduct: expect.any(Function),
          updateProductCount: expect.any(Function),
          cart: expect.any(Array),
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

    images.forEach((image) => fireEvent.load(image))

    expect(loadingScreen).not.toBeInTheDocument()
  })

  it('Add to Cart Button', async () => {
    const { user } = setup()

    const buttons = await screen.findAllByRole('button', {
      name: 'Add to Cart',
    })
    buttons.forEach((btn) => expect(btn).toBeInTheDocument())

    const cart = screen.getByTestId('cart-counter')

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
    setup()

    await getTitles()
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(getByTestId(header, /cart-counter/i)).toBeInTheDocument()
    expect(
      getByRole(header, 'heading', { name: /shopping cart/i })
    ).toBeInTheDocument()
  })

  it('Product Counter Button', async () => {
    const { user, router } = setup()

    let btns = await getAddBtns()
    await user.click(btns[0])
    await user.click(btns[0])
    await user.click(btns[0])

    await user.click(getCartPageLink())

    expect(getPrice().textContent).toBe(`$${products[0].price * 3}`)

    act(() => {
      router.navigate('/')
    })

    btns = await getAddBtns()
    expect(btns[0]).toBeInTheDocument()
    await user.click(btns[0])
    await user.click(getCartPageLink())
    expect(
      screen.getByRole('generic', { name: 'total price of cart' }).textContent
    ).toBe(`$${products[0].price * 4}`)

    act(() => {
      router.navigate('/')
    })

    btns = await getAddBtns()
    await user.click(btns[0])
    await user.click(getCartPageLink())

    expect(getPrice().textContent).toBe(`$${products[0].price * 5}`)

    act(() => {
      router.navigate('/')
    })
    btns = await getSubBtns()
    await user.click(btns[0])
    await user.click(getCartPageLink())
    expect(
      screen.getByRole('generic', { name: 'total price of cart' }).textContent
    ).toBe(`$${products[0].price * 4}`)
  })

  it('Product counter input values', async () => {
    const { router, user } = setup()
    let numbers = await getProductCounterInput()

    expect(numbers.length).toBe(4)

    await user.type(numbers[0], '500')
    await user.click(getCartPageLink())

    expect(getPrice().textContent).toBe(`$${products[0].price * 500}`)

    act(() => {
      router.navigate(-1)
    })
    numbers = await getProductCounterInput()
    await user.type(numbers[3], '200')
    await user.click(getCartPageLink())

    expect(getPrice().textContent).toBe(
      `$${products[0].price * 500 + products[3].price * 200}`
    )
  })

  it('Product is removed from cart at falsy count value', async () => {
    const { user, router } = setup()
    let elements = await getAddBtns()

    await user.click(elements[0])
    await user.click(getCartPageLink())
    elements = screen.getAllByTestId('product-cart-page')

    expect(elements.length).toBe(1)

    act(() => {
      router.navigate(-1)
    })

    elements = await getSubBtns()
    await user.click(elements[0])
    await user.click(getCartPageLink())
    elements = screen.queryAllByTestId('product-cart-page')

    expect(elements.length).toBe(0)

    act(() => {
      router.navigate(-1)
    })

    elements = await getAddBtns()
    await user.click(elements[0])
    elements = screen.getAllByRole('spinbutton')
    await user.type(elements[0], '[Backspace]')
    await user.click(getCartPageLink())
    elements = screen.queryAllByTestId('product-cart-page')

    expect(elements.length).toBe(0)
  })
})
