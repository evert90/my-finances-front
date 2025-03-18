import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom'
import Register from '../../pages/auth/register'
import { useRouter } from 'next/router'

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('Register', () => {

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      pathname: '/auth/register',
      query: {},
      asPath: '/auth/register',
    })
  })

  test('should render the register page', () => {
    render(<Register />)
    const message = "Cadastre-se com sua conta"
    const element = screen.getByTestId("test");

    expect(element).toHaveTextContent(message);
  })
})