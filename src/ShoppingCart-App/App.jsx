import './App.scss'
import { fetchData } from '../ShoppingCart-Core/api.js'
import Product from './Product.jsx'

const products = await fetchData()

function App() {
  return (
    <div>
      <h1>Shopping Cart</h1>
      <div>
        <span>Categories</span>
        <div>
          <button>Jewelery</button>
          <button>Electronics</button>
          <button>Men's Clothing</button>
          <button>Women's Clothing</button>
        </div>
      </div>
      <section data-testid="products-container">
        <h2>Products</h2>{' '}
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <Product product={product} />
            </li>
          ))}
          ;
        </ul>
      </section>
    </div>
  )
}

export default App
