import Bag from './Icons/Bag.jsx'
import BagOutline from './Icons/BagOutline.jsx'
import {
  appHeader,
  appHeader__logo,
  app,
  loadingScreen,
  cartLink,
  cartLink__icon,
  cartLink__count,
} from './App.module.scss'
import { fetchData } from '../ShoppingCart-Core/api.js'
import { useState, useEffect, useRef } from 'react'
import { Link, Outlet } from 'react-router'

function App() {
  const [products, setProducts] = useState([])
  const [loadingState, setLoadingState] = useState(true)
  const [cart, setCart] = useState([])

  const loadedImageCount = useRef(0)

  const onImageLoad = () => {
    if (++loadedImageCount.current >= products.length) {
      setTimeout(() => setLoadingState(false), 500)
    }
  }

  const updateProductCount = (id, count) => {
    let newCart = []
    let foundInCart = false

    if (!count) {
      newCart = cart.filter((arr) => arr[0] !== id)
    } else {
      for (let product of cart) {
        if (product[0] === id) {
          foundInCart = true
          newCart.push([id, count])
        } else newCart.push(product)
      }

      if (!foundInCart) {
        newCart.push([id, count])
      }
    }

    setCart(newCart)
  }

  const toggleProductInCart = (id, count = 1) => {
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
    <div className={app}>
      <header className={appHeader}>
        <Link to="/">
          <h1 className={appHeader__logo}>Shopping Cart</h1>
        </Link>
        <Link to="cart-page" aria-label="cart page" className={cartLink}>
          <BagOutline className={cartLink__icon} />
          <span data-testid="cart-counter" className={cartLink__count}>
            {cart.length}
          </span>
        </Link>
      </header>
      <Outlet
        context={{
          cart,
          products,
          toggleProductInCart,
          onImageLoad,
          updateProductCount,
        }}
      />
      {loadingState === true ? (
        <div className={loadingScreen} data-testid="loading-screen">
          <p>Loading...</p>
        </div>
      ) : null}
    </div>
  )
}

export default App
