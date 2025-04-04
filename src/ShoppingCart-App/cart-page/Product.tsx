import {
  pdt,
  pdt__toggleBtn,
  pdt__btnContainer,
  binOutline,
  binSolid,
} from './Product.module.scss'
import { useOutletContext } from 'react-router'
import { Solid, Outline } from '../Icons/Bin.tsx'
import { AppContext } from '../App.tsx'
import * as api from '../../ShoppingCart-Core/api.ts'
import Counter from '../Counter.tsx'

interface ProductCmp {
  product: api.Product
  count: number
}

const Product = ({ product, count }: ProductCmp) => {
  const { updateProductCount } = useOutletContext<AppContext>()
  return (
    <div data-testid="product-cart-page" className={pdt}>
      <div>
        <h2 title="name">{product.title}</h2>
        <p title="price">${product.price}</p>
        <div className={pdt__btnContainer}>
          <Counter
            ref={undefined}
            isInCart={true}
            id={product.id}
            value={count}
            updateValue={updateProductCount}
          />
          <button
            aria-label="remove"
            className={pdt__toggleBtn}
            onClick={() => {
              updateProductCount(product.id, 0, false)
            }}
          >
            <Solid className={binSolid} />
            <Outline className={binOutline} />
          </button>
        </div>
      </div>
      <img src={product.image} alt="product image" />
    </div>
  )
}

export default Product
