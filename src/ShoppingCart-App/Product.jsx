const Product = ({ product }) => {
  return (
    <div key={product.id}>
      <div title="name">{product.title}</div>
      <div title="description">{product.description}</div>
      <div title="category">{product.category}</div>
      <img src={product.image} alt="product image" />
      <div>{product.rating.rate}</div>
    </div>
  )
}

export default Product
