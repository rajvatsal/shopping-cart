import Counter from '../Counter.jsx'
import { useOutletContext } from 'react-router'
import { object } from 'prop-types'

const Product = ({ details }) => {
  const { updateProductCount } = useOutletContext()
  return (
    <div data-testid="product-cart-page">
      <h2>{details.title}</h2>
      <h2>${details.price}</h2>
      <Counter
        id={details.id}
        updateValue={updateProductCount}
        value={details.count}
      />
    </div>
  )
}

Product.propTypes = {
  details: object,
}

export default Product
