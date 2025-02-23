import App from '../App.jsx'
import { describe, it, expect } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { render } from '@testing-library/react'

describe('Component App', () => {
  it('renders correct heading', () => {
    const { getByRole } = render(<App />)

    const heading = getByRole('heading')
    expect(heading.textContent).toBe('Shopping Cart')
  })
})
