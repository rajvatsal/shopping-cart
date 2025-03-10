import { useParams } from 'react-router'

const ProductPage = () => {
  const params = useParams()
  return <h2>Product Page {params.productId}</h2>
}

export default ProductPage
