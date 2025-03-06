import './App.scss'
import { fetchData } from '../ShoppingCart-Core/api.js'
import { useState, useEffect, useRef } from 'react'
import { Link, Outlet } from 'react-router'

function App() {
  const [products, setProducts] = useState([])
  const [loadingState, setLoadingState] = useState(true)
  const [cart, setCart] = useState([])

  const loadedImageCount = useRef(0)

  const onImageLoad = () => {
    if (++loadedImageCount.current >= products.length) setLoadingState(false)
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
      </header>
      <Outlet context={{ cart, products, updateCart, onImageLoad }} />
      {loadingState === true ? (
        <div data-testid="loading-screen">
          <p>Loading...</p>
        </div>
      ) : null}
    </div>
  )
}

export default App
