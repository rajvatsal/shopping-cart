const Product = ({ product }) => {
  return (
    <div key={product.id}>
      <div>{product.title}</div>
      <div>{product.description}</div>
      <div>{product.category}</div>
      <img src={product.image} alt="product image" />
      <div>{product.rating.rate}</div>
    </div>
  )
}

export default Product
