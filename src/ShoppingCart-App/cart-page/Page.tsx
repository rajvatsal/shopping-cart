import {
  page,
  page__items,
  page__price,
  emptyPageHeading,
} from './Page.module.scss'
import SecondaryHero from '../SecondaryHero.jsx'
import Product from './Product.tsx'
import { useOutletContext } from 'react-router'
import { AppContext } from '../App.tsx'

const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100

const CartPage = () => {
  const { cart, products } = useOutletContext<AppContext>()
  const cartDetails = []

  // add count details for product
  for (const product of products) {
    for (const item of cart) {
      if (item[0] === product.id) {
        cartDetails.push({ product, count: item[1] })
        break
      }
    }
  }

  return (
    <>
      <SecondaryHero pageName="cart" />
      <section data-testid="cart-container" className={page}>
        {cartDetails.length === 0 ? (
          <h2 className={emptyPageHeading}>Cart is empty :..(</h2>
        ) : (
          <ul className={page__items}>
            {cartDetails.map(({ product, count }) => (
              <li key={product.id}>
                <Product product={product} count={count} />
              </li>
            ))}
          </ul>
        )}
        <div aria-label="total price of cart" className={page__price}>
          $
          {round(
            cartDetails.reduce(
              (acc, { product, count }) => acc + product.price * count,
              0
            )
          )}
        </div>
      </section>
    </>
  )
}

export default CartPage
