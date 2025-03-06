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

  const updateCart = (id, count = 1) => {
    id = Number.parseInt(id)
    count = Number.parseInt(count)
    const newCart = []
    let isInCart = false

    for (const item of cart) {
      if (item[0] === id) {
        isInCart = true
        continue
      }
      newCart.push([item[0], item[1]])
    }

    if (isInCart) {
      setCart(newCart)
      return
    }

    newCart.push([id, count])
    setCart(newCart)
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
