import classes from './Product.module.scss'
import { object, func } from 'prop-types'
import { Link } from 'react-router'

const Product = ({ product, onImageLoad }) => {
  return (
    <div key={product.id} className={classes.product}>
      <Link aria-label="product page" to={`product/${product.id}`}>
        <div className={classes.product__imgContainer}>
          <img src={product.image} alt="product image" onLoad={onImageLoad} />
        </div>
        <div title="category">{product.category}</div>
        <div title="name">{product.title}</div>
        <div className={classes.product__priceContainer}>
          <span title="price">${product.price}</span>
          <span title="rating">{product.rating.rate}</span>
        </div>
      </Link>
    </div>
  )
}

Product.propTypes = {
  product: object.isRequired,
  onImageLoad: func.isRequied,
}

export default Product
