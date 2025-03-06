import Categories from './CategoryFilter.jsx'
import Product from './Product.jsx'
import { useState } from 'react'
import { useOutletContext } from 'react-router'

const IndexPage = () => {
  const [filter, setFilter] = useState([])
  const { products, onImageLoad, updateCart } = useOutletContext()

  const addFilter = (newFilter) => {
    setFilter([...filter, newFilter])
  }
  const removeFilter = (oldFilter) => {
    setFilter(filter.filter((fl) => fl !== oldFilter))
  }

  return (
    <section data-testid="products-container">
      <h2>Products</h2>
      <Categories add={addFilter} remove={removeFilter} />
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
