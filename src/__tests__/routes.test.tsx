import { describe, expect, it, vi } from 'vitest'
import {
  createMemoryRouter,
  RouterProvider,
  ScrollRestoration,
} from 'react-router'
import { userEvent } from '@testing-library/user-event'
import { render, screen, act } from '@testing-library/react'
import { routes } from '../routes.jsx'

vi.mock('react-router', async (importOriginal) => {
  const original: object = await importOriginal()
  return {
    ...original,
    ScrollRestoration: vi.fn(),
  }
})

// Setup
const setup = () => {
  const router = createMemoryRouter(routes)
  return {
    user: userEvent.setup(),
    router,
    render: render(<RouterProvider router={router} />),
  }
}

describe('Routes', () => {
  it('ScreenRestoration is called on top', () => {
    expect(routes).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "children": [
                {
                  "element": <IndexPage />,
                  "index": true,
                },
                {
                  "element": <CartPage />,
                  "path": "cart-page",
                },
                {
                  "element": <ProductPage />,
                  "path": "product/:productId",
                },
              ],
              "element": <App />,
              "path": "/",
            },
          ],
          "element": <AppLayout />,
        },
      ]
    `)
  })

  it('ScrollRestoration is called on page', async () => {
    const { router } = setup()

    await screen.findAllByRole('link', { name: 'product page' })

    act(() => {
      router.navigate('cart-page')
    })

    expect(ScrollRestoration).toBeCalledTimes(1)
  })
})
