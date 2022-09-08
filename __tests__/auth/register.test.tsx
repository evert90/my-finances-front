import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom'
import Register from '../../pages/auth/register'

describe('Register', () => {
  test('should render the register page', () => {
    render(<Register />)
    const message = "Cadastre-se com sua conta"
    const element = screen.getByTestId("test");

    expect(element).toHaveTextContent(message);
  })
})