import {
  appHeader,
  appHeader__logo,
  app,
  loadingScreen,
  cartLink,
  cartLink__icon,
  cartLink__count,
} from './App.module.scss'
import BagOutline from './Icons/BagOutline.tsx'
import { fetchProducts, Product } from '../ShoppingCart-Core/api.ts'
import { useState, useEffect, useRef } from 'react'
import { Link, Outlet } from 'react-router'

export interface AppContext {
  cart: number[][]
  products: Product[]
  onImageLoad: () => void
  updateProductCount: (id: number, count: number, remove: boolean) => void
}

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [loadingState, setLoadingState] = useState<boolean>(true)
  const [cart, setCart] = useState<number[][] | []>([])

  const loadedImageCount = useRef(0)

  const onImageLoad = () => {
    if (++loadedImageCount.current >= products.length) {
      setTimeout(() => setLoadingState(false), 500)
    }
  }

  const updateProductCount = (id: number, count = 1, remove = false) => {
    let newCart = []
    let foundInCart = false

    if (!count) {
      newCart = cart.filter((arr) => arr[0] !== id)
    } else {
      for (const product of cart) {
        if (product[0] === id) {
          foundInCart = true
          if (remove) continue
          newCart.push([id, count])
        } else newCart.push(product)
      }

      if (!foundInCart) {
        newCart.push([id, count])
      }
    }

    setCart(newCart)
  }

  useEffect(() => {
    const getProducts = async () => {
      const products = await fetchProducts()
      setProducts(products)
      if (window.location.href.slice(-1) !== '/') {
        setLoadingState(false)
      }
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
