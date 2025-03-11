import Counter from '../Counter.jsx'
import { Solid, Outline } from '../Icons/Bin.jsx'
import {
  product,
  product__toggleBtn,
  product__btnContainer,
  binOutline,
  binSolid,
} from './Product.module.scss'
import { useOutletContext } from 'react-router'
import { object } from 'prop-types'

const Product = ({ details }) => {
  const { updateProductCount } = useOutletContext()
  return (
    <div data-testid="product-cart-page" className={product}>
      <div>
        <h2 title="name">{details.title}</h2>
        <p title="price">${details.price}</p>
        <div className={product__btnContainer}>
          <Counter
            isInCart={true}
            id={details.id}
            updateValue={updateProductCount}
            value={details.count}
          />
          <button
            aria-label="remove"
            className={product__toggleBtn}
            onClick={() => {
              updateProductCount(details.id, 0)
            }}
          >
            <Solid className={binSolid} />
            <Outline className={binOutline} />
          </button>
        </div>
      </div>
      <img src={details.image} alt="product image" />
    </div>
  )
}

Product.propTypes = {
  details: object,
}

export default Product
