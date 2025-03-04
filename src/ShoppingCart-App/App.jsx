import './App.scss'
import { fetchData } from '../ShoppingCart-Core/api.js'
import { useState, useEffect, useRef } from 'react'
import { Link, Outlet } from 'react-router'
import Product from './Product.jsx'
import Categories from './CategoryFilter.jsx'

function App() {
  const [filter, setFilter] = useState([])
  const [products, setProducts] = useState([])
  const [loadingState, setLoadingState] = useState(true)
  const [cart, setCart] = useState([])

  const loadedImageCount = useRef(0)

  const onLoad = () => {
    if (++loadedImageCount.current >= products.length) setLoadingState(false)
  }

  const addFilter = (newFilter) => {
    setFilter([...filter, newFilter])
  }
  const removeFilter = (oldFilter) => {
    setFilter(filter.filter((fl) => fl !== oldFilter))
  }

  const updateCart = (id) => {
    id = Number.parseInt(id)
    const firstElement = cart.find((product) => product.id === id)
    const product = products.find((product) => product.id === id)
    if (firstElement === undefined) {
      setCart([...cart, product])
      product.isInCart = true
    } else {
      setCart(cart.filter((product) => product.id !== id))
      product.isInCart = false
    }
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
      <header>
        <h1>Shopping Cart</h1>
        <Link to="cart-page" aria-label="cart page">
          <div data-testid="cart-counter">{cart.length}</div>
        </Link>
        <Categories add={addFilter} remove={removeFilter} />
      </header>
      <Outlet context={{ products }} />
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
                  onImageLoad={onLoad}
                  toggleProduct={updateCart}
                />
              </li>
            )
          })}
        </ul>
      </section>
      {loadingState === true ? (
        <div data-testid="loading-screen">
          <p>Loading...</p>
        </div>
      ) : null}
    </div>
  )
}

export default App
