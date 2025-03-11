import Counter from '../Counter.jsx'
import {
  container,
  image,
  cont_1,
  cont_1__category,
  cont_1__rate,
  title,
  description,
  cont_2,
} from './Page.module.scss'
import { useParams, useOutletContext } from 'react-router'

const ProductPage = () => {
  const { products, toggleProductInCart, updateProductCount, cart } =
    useOutletContext()
  let { productId } = useParams()
  productId = Number.parseInt(productId)

  const product = products.find((product) => product.id === productId)

  const isInCart = cart.find((array) => array[0] === productId)

  return (
    <section data-testid={`product-${productId}-details`} className={container}>
      <img src={product.image} alt="product image" className={image} />
      <div>
        <div className={cont_1}>
          <span className={cont_1__category}>{product.category}</span>
          <span className={cont_1__rate}>{product.rating.rate}</span>
        </div>
        <h3 className={title}>{product.title}</h3>
        <p className={description}>{product.description}</p>
        <div className={cont_2}>
          <button
            className="btn--primary"
            onClick={() => {
              toggleProductInCart(productId)
            }}
            type="button"
          >
            {isInCart !== undefined ? 'Remove' : 'Add To Cart'}
          </button>
          <Counter
            isInCart={!!isInCart}
            value={isInCart === undefined ? 1 : isInCart[1]}
            id={productId}
            updateValue={updateProductCount}
          />
        </div>
      </div>
    </section>
  )
}

export default ProductPage
