import { object } from 'prop-types'

const Product = ({ details }) => {
  return (
    <div data-testid="product-cart-page">
      <h2>{details.title}</h2>
      <h2>${details.price}</h2>
    </div>
  )
}

Product.propTypes = {
  details: object,
}

export default Product
