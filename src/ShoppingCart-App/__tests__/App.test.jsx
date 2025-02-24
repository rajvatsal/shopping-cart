import App from '../App.jsx'
import { describe, it, expect } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { render, getByRole } from '@testing-library/react'
import { fetchData } from '../../ShoppingCart-Core/api.js'
import Product from '../Product.jsx'

afterEach(() => vi.clearAllMocks())

const product = vi.hoisted(() => ({
  id: 1,
  title: 'skateboard',
  price: 500,
  description: 'cool skateboard',
  category: 'electronics',
  image: 'something',
  rating: 5,
}))

vi.mock('../../ShoppingCart-Core/api.js', () => {
  return {
    fetchData: vi.fn(async () => [product]),
  }
})

vi.mock('../Product.jsx', () => {
  return {
    default: vi.fn(() => null),
  }
})

describe('COMPONENT APP', () => {
  it('Heading', () => {
    const { getByRole } = render(<App />)

    const heading = getByRole('heading', { level: 1 })
    expect(heading.textContent).toBe('Shopping Cart')
  })

  it('Categories', () => {
    const { getByRole, getByText } = render(<App />)
    expect(getByText(/categories/i)).toBeInTheDocument()
    expect(getByRole('button', { name: /Jewelery/ })).toBeInTheDocument()
    expect(getByRole('button', { name: /Electronics/ })).toBeInTheDocument()
    expect(getByRole('button', { name: /Men\'s Clothing/ })).toBeInTheDocument()
    expect(
      getByRole('button', { name: /Women\'s Clothing/ })
    ).toBeInTheDocument()
  })

  it('Products Section Heading', () => {
    const { getByTestId } = render(<App />)
    const container = getByTestId('products-container')
    expect(getByRole(container, 'heading', { level: 2 }).textContent).toBe(
      'Products'
    )
  })

  it('Passes Correct Props to Product Component', () => {
    const { getByTestId } = render(<App />)

    expect(Product).toHaveBeenCalled()
    expect(Product).toHaveBeenCalledTimes(1)
    expect(Product).toHaveBeenCalledWith({ product }, undefined)
  })
})
