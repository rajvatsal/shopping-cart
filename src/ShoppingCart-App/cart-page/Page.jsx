import { page, page__items, page__price } from './Page.module.scss'
import Product from './Product.jsx'
import { useOutletContext } from 'react-router'

const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100

const CartPage = () => {
  const { cart, products } = useOutletContext()
  let cartDetails = []

  for (const product of products) {
    for (const item of cart) {
      if (item[0] === product.id) {
        product.count = item[1]
        cartDetails.push(product)
        break
      }
    }
  }

  return (
    <section data-testid="cart-container" className={page}>
      <ul className={page__items}>
        {cartDetails.map((product) => (
          <li key={product.id}>
            <Product details={product} />
          </li>
        ))}
      </ul>
      <div aria-label="total price of cart" className={page__price}>
        ${round(cartDetails.reduce((acc, p) => acc + p.price * p.count, 0))}
      </div>
    </section>
  )
}

export default CartPage
