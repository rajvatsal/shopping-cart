import SecondaryHero from './SecondaryHero.jsx'
import Categories from './CategoryFilter.jsx'
import Product from './Product.jsx'
import { indexPage, indexPage__products } from './IndexPage.module.scss'
import { useState } from 'react'
import { useOutletContext } from 'react-router'

const IndexPage = () => {
  const [filter, setFilter] = useState([])
  const {
    products,
    onImageLoad,
    toggleProductInCart,
    cart,
    updateProductCount,
  } = useOutletContext()

  const addFilter = (newFilter) => {
    setFilter([...filter, newFilter])
  }
  const removeFilter = (oldFilter) => {
    setFilter(filter.filter((fl) => fl !== oldFilter))
  }

  return (
    <section data-testid="products-container" className={indexPage}>
      <SecondaryHero pageName="products" />
      <Categories add={addFilter} remove={removeFilter} />
      <ul className={indexPage__products}>
        {products.map((product) => {
          if (filter.length !== 0 && !filter.includes(product.category))
            return null

          return (
            <li key={product.id}>
              <Product
                product={product}
                onImageLoad={onImageLoad}
                toggleProduct={toggleProductInCart}
                cart={cart}
                updateProductCount={updateProductCount}
              />
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default IndexPage
