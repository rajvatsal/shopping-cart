import Product from './Product.jsx'
import { useOutletContext } from 'react-router'

const CartPage = () => {
  const { cart } = useOutletContext()
  return (
    <section data-testid="cart-container">
      <h2 data-testid="cart-page">Cart Page</h2>
      <div aria-label="total price of cart">
        ${cart.reduce((acc, p) => acc + p.price, 0)}
      </div>
      <ul>
        {cart.map((product) => (
          <li key={product.id}>
            <Product details={product} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default CartPage
