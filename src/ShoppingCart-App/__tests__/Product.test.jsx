import Product from '../Product.jsx'
import { products } from './mock-products.js'
import { render, fireEvent } from '@testing-library/react'

describe('Product Component', () => {
  it('DOM Structure', () => {
    const renderer = render(<Product product={products[0]} />)
    expect(renderer.container.firstChild).toMatchSnapshot()
  })

  it('Image Load Event', () => {
    const imageLoad = vi.fn()
    const { getByAltText } = render(
      <Product product={products[0]} onImageLoad={imageLoad} />
    )

    expect(imageLoad).toBeCalledTimes(0)

    fireEvent.load(getByAltText('product image'))

    expect(imageLoad).toBeCalledTimes(1)
  })
})
