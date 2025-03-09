import { product, toggleBtn } from './Product.module.scss'
import Counter from '../Counter.jsx'
import { useOutletContext } from 'react-router'
import { object } from 'prop-types'

const Product = ({ details }) => {
  const { updateProductCount } = useOutletContext()
  return (
    <div data-testid="product-cart-page" className={product}>
      <div>
        <h2>{details.title}</h2>
        <h2>${details.price}</h2>
        <Counter
          id={details.id}
          updateValue={updateProductCount}
          value={details.count}
        />
        <button
          className={toggleBtn}
          onClick={() => {
            updateProductCount(details.id, 0)
          }}
        >
          remove
        </button>
      </div>
      <img src={details.image} alt="product image" />
    </div>
  )
}

Product.propTypes = {
  details: object,
}

export default Product
