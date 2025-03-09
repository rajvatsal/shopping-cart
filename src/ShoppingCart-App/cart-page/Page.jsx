import Product from './Product.jsx'
import { useOutletContext } from 'react-router'

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
    <section data-testid="cart-container">
      <h2 data-testid="cart-page">Cart Page</h2>
      <div aria-label="total price of cart">
        ${cartDetails.reduce((acc, p) => acc + p.price * p.count, 0)}
      </div>
      <ul>
        {cartDetails.map((product) => (
          <li key={product.id}>
            <Product details={product} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default CartPage
