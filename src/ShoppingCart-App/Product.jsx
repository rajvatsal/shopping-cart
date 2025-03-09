import Counter from './Counter.jsx'
import classes from './Product.module.scss'
import { object, func, bool } from 'prop-types'

const Product = ({
  product,
  onImageLoad,
  toggleProduct,
  cart,
  updateProductCount,
}) => {
  const item = cart.find((item) => item[0] === product.id)

  return (
    <div key={product.id} className={classes.product}>
      <div className={classes.product__imgContainer}>
        <img src={product.image} alt="product image" onLoad={onImageLoad} />
      </div>
      <button
        className={classes.product__cartBtn}
        onClick={() => {
          toggleProduct(product.id)
        }}
      >
        {item ? 'remove' : 'Add to Cart'}
      </button>
      <h3>${product.price}</h3>
      <div className={classes.product__ratingCategoryContainer}>
        <div title="category">{product.category}</div>
        <div title="rating">{product.rating.rate}</div>
      </div>
      <div title="name">{product.title}</div>
      <Counter
        updateValue={updateProductCount}
        id={product.id}
        value={item === undefined ? 0 : item[1]}
      />
    </div>
  )
}

Product.propTypes = {
  product: object.isRequired,
  onImageLoad: func.isRequied,
  toggleProduct: func.isRequired,
  isInCart: bool.isRequired,
  updateProductCount: func.isRequired,
  cart: object.isRequired,
}

export default Product
