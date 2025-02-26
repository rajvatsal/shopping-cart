import './App.scss'
import { fetchData } from '../ShoppingCart-Core/api.js'
import { useState, useEffect } from 'react'
import Product from './Product.jsx'
import Categories from './CategoryFilter.jsx'

function App() {
  const [filter, setFilter] = useState([])
  const [products, setProducts] = useState([])

  const addFilter = (newFilter) => {
    setFilter([...filter, newFilter])
  }
  const removeFilter = (oldFilter) => {
    setFilter(filter.filter((fl) => fl !== oldFilter))
  }

  useEffect(() => {
    const getProducts = async () => {
      const products = await fetchData()
      setProducts(products)
    }

    getProducts()
  }, [])

  return (
    <div>
      <h1>Shopping Cart</h1>
      <Categories add={addFilter} remove={removeFilter} />
      <section data-testid="products-container">
        <h2>Products</h2>{' '}
        <ul>
          {products.map((product) => {
            if (filter.length !== 0 && !filter.includes(product.category))
              return null

            return (
              <li key={product.id}>
                <Product product={product} />
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

export default App
