import { object, func, bool } from 'prop-types'
import Counter from './Counter.jsx'

const Product = ({
  product,
  onImageLoad,
  toggleProduct,
  cart,
  updateProductCount,
}) => {
  const item = cart.find((item) => item[0] === product.id)

  return (
    <div key={product.id}>
      <div title="name">{product.title}</div>
      <div title="description">{product.description}</div>
      <div title="category">{product.category}</div>
      <img src={product.image} alt="product image" onLoad={onImageLoad} />
      <div>{product.rating.rate}</div>
      <Counter
        updateValue={updateProductCount}
        id={product.id}
        value={item === undefined ? 0 : item[1]}
      />
      <button
        onClick={() => {
          toggleProduct(product.id)
        }}
      >
        {item ? 'remove' : 'Add to Cart'}
      </button>
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
