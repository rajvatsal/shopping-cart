import classes from './Product.module.scss'
import { Link, useOutletContext } from 'react-router'
import { AppContext } from './App'
import * as api from '../ShoppingCart-Core/api'

const Product = ({ product }: { product: api.Product }) => {
  const { onImageLoad } = useOutletContext<AppContext>()

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

export default Product
