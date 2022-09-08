import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom'
import Login from '../../pages/auth/login'

describe('Login', () => {
  it('renders a login page', () => {
    render(<Login />)

/*     const heading = screen.getByRole('heading', {
      name: /Home Page/i,
    })

    expect(heading).toBeInTheDocument()
    */
  })
})