import Product from './Product.jsx'
import { useOutletContext } from 'react-router'

const IndexPage = () => {
  const { products, filter, onImageLoad, updateCart } = useOutletContext()

  return (
    <section data-testid="products-container">
      <h2>Products</h2>{' '}
      <ul>
        {products.map((product) => {
          if (filter.length !== 0 && !filter.includes(product.category))
            return null

          return (
            <li key={product.id}>
              <Product
                product={product}
                onImageLoad={onImageLoad}
                toggleProduct={updateCart}
              />
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default IndexPage
