import { object, func, bool } from 'prop-types'

const Product = ({ product, onImageLoad, toggleProduct, isInCart }) => {
  return (
    <div key={product.id}>
      <div title="name">{product.title}</div>
      <div title="description">{product.description}</div>
      <div title="category">{product.category}</div>
      <img src={product.image} alt="product image" onLoad={onImageLoad} />
      <div>{product.rating.rate}</div>
      <button
        onClick={() => {
          toggleProduct(product.id)
        }}
      >
        {isInCart ? 'remove' : 'Add to Cart'}
      </button>
    </div>
  )
}

Product.propTypes = {
  product: object.isRequired,
  onImageLoad: func.isRequied,
  toggleProduct: func.isRequired,
  isInCart: bool.isRequired,
}

export default Product
