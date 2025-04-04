import { categories, categories__heading } from './CategoryFilter.module.scss'

interface CategoriesCmp {
  add: (tag: string) => void
  remove: (tag: string) => void
}

const Categories = ({ add, remove }: CategoriesCmp) => {
  const onClick =
    (item: string): React.ChangeEventHandler<HTMLInputElement> =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked === false) remove(item)
        else add(item)
      }

  return (
    <div data-testid="categories-component" className={categories}>
      <h3 className={categories__heading}>CATEGORIES</h3>
      <div>
        <label>
          <input
            onChange={onClick('jewelery')}
            defaultChecked={false}
            type="checkbox"
          />
          Jewelery
        </label>
        <label>
          <input
            type="checkbox"
            onChange={onClick('electronics')}
            defaultChecked={false}
          />
          Electronics
        </label>
        <label>
          <input
            type="checkbox"
            onChange={onClick("men's clothing")}
            defaultChecked={false}
          />
          Men's Clothing
        </label>
        <label>
          <input
            type="checkbox"
            onChange={onClick("women's clothing")}
            defaultChecked={false}
          />
          Women's Clothing
        </label>
      </div>
    </div>
  )
}

export default Categories
