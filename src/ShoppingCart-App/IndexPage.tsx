import Categories from './CategoryFilter.jsx'
import Product from './Product.jsx'
import { indexPage, indexPage__products } from './IndexPage.module.scss'
import { useState } from 'react'
import { useOutletContext } from 'react-router'
import { AppContext } from './App.tsx'

const IndexPage = () => {
  const [filter, setFilter] = useState<string[]>([])
  const { products } = useOutletContext<AppContext>()

  const addFilter = (newFilter: string) => {
    setFilter([...filter, newFilter])
  }
  const removeFilter = (oldFilter: string) => {
    setFilter(filter.filter((fl) => fl !== oldFilter))
  }

  return (
    <section
      data-testid="products-container"
      className={indexPage + ' top-section'}
    >
      <Categories add={addFilter} remove={removeFilter} />
      <ul className={indexPage__products}>
        {products.map((product) => {
          if (filter.length !== 0 && !filter.includes(product.category))
            return null

          return (
            <li key={product.id}>
              <Product product={product} />
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default IndexPage
