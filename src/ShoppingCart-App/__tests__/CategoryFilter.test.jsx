import Categories from '../CategoryFilter.jsx'
import { render } from '@testing-library/react'

describe('CATEGORY FILTER', () => {
  it('Categories', () => {
    const { getByRole, getAllByTitle, getByText } = render(<Categories />)
    expect(getByText(/categories/i)).toBeInTheDocument()
    expect(getByRole('checkbox', { name: /Jewelery/ })).toBeInTheDocument()
    expect(getByRole('checkbox', { name: /Electronics/ })).toBeInTheDocument()
    expect(
      getByRole('checkbox', { name: /Men\'s Clothing/ })
    ).toBeInTheDocument()
    expect(
      getByRole('checkbox', { name: /Women\'s Clothing/ })
    ).toBeInTheDocument()
  })
})
