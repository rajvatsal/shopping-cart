import Product from '../Product.jsx'
import { products } from './mock-products.js'
import { render, screen, fireEvent } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, vi, expect } from 'vitest'

describe('Product Index Page', () => {
  it('Snapshot', () => {
    const renderer = render(
      <Product product={products[0]} cart={[]} updateProductCount={vi.fn()} />
    )
    expect(renderer.container.firstChild).toMatchSnapshot()
  })

  it('Image Load Event', () => {
    const imageLoad = vi.fn()
    const { getByAltText } = render(
      <Product
        product={products[0]}
        onImageLoad={imageLoad}
        updateProductCount={vi.fn()}
        cart={[]}
      />
    )

    expect(imageLoad).toBeCalledTimes(0)

    fireEvent.load(getByAltText('product image'))

    expect(imageLoad).toBeCalledTimes(1)
  })

  it('Toggle cart item', async () => {
    const toggleItemInCart = vi.fn()
    const user = userEvent.setup()
    const { getByRole } = render(
      <Product
        toggleProduct={toggleItemInCart}
        product={products[0]}
        cart={[]}
        updateProductCount={vi.fn()}
      />
    )
    const button = getByRole('button', { name: /add to cart/i })

    expect(toggleItemInCart).toBeCalledTimes(0)

    await user.click(button)
    expect(toggleItemInCart).toBeCalledTimes(1)

    await user.click(button)
    expect(toggleItemInCart).toBeCalledTimes(2)

    await user.click(button)
    expect(toggleItemInCart).toBeCalledTimes(3)
  })
})
