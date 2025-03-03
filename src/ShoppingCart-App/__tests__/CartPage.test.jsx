import { vi, describe, it, expect } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { routes } from '../../routes.jsx'
import {
  RouterProvider,
  createMemoryRouter,
  MemoryRouter,
  BrowserRouter,
} from 'react-router-dom'

// Mock api calls
const { products } = await vi.hoisted(
  async () => await import('./mock-products.js')
)

vi.mock('../../ShoppingCart-Core/api.js', () => {
  return {
    fetchData: vi.fn().mockResolvedValue(products),
  }
})

// Setup
const setup = () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ['/cart-page'],
  })
  return {
    user: userEvent.setup(),
    router: router,
    ...render(<RouterProvider router={router} />, { wrapper: MemoryRouter }),
  }
}

describe('Cart Page', () => {
  it('Cart Page Link', async () => {
    const {
      findAllByTitle,
      user,
      findByRole,
      router,
      queryByRole,
      queryByTestId,
      debug,
    } = setup()

    await findAllByTitle('category')
    debug()
  })
})
