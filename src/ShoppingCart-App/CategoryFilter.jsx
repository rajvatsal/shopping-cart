import { categories, categories__heading } from './CategoryFilter.module.scss'
import { func, string } from 'prop-types'

const Categories = ({ add, remove }) => {
  const onClick = (item) => (e) => {
    if (e.target.checked === false) remove(item)
    else add(item)
  }

  return (
    <div data-testid="categories-component" className={categories}>
      <h3 className={categories__heading}>CATEGORIES</h3>
      <div>
        <label>
          <input
            onClick={onClick('jewelery')}
            defaultChecked={false}
            type="checkbox"
          />
          Jewelery
        </label>
        <label>
          <input
            type="checkbox"
            onClick={onClick('electronics')}
            defaultChecked={false}
          />
          Electronics
        </label>
        <label>
          <input
            type="checkbox"
            onClick={onClick("men's clothing")}
            defaultChecked={false}
          />
          Men's Clothing
        </label>
        <label>
          <input
            type="checkbox"
            onClick={onClick("women's clothing")}
            defaultChecked={false}
          />
          Women's Clothing
        </label>
      </div>
    </div>
  )
}

Categories.propTypes = {
  add: func.isRequired,
  remove: func.isRequired,
  className: string,
}

export default Categories
