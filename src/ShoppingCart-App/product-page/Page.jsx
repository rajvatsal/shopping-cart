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
  const { products } = useOutletContext()
  const { productId } = useParams()

  const product = products.find(
    (product) => product.id === Number.parseInt(productId)
  )

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
          <button type="button">Add To Cart</button>
          <Counter />
        </div>
      </div>
    </section>
  )
}

export default ProductPage
