const Product = ({ product, onImageLoad }) => {
  return (
    <div key={product.id}>
      <div title="name">{product.title}</div>
      <div title="description">{product.description}</div>
      <div title="category">{product.category}</div>
      <img src={product.image} alt="product image" onLoad={onImageLoad} />
      <div>{product.rating.rate}</div>
    </div>
  )
}

export default Product
