import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Index from '../pages'

describe('Index', () => {
  test('should render the index page', () => {
    render(<Index />)
    const message = "A beautiful extension for Tailwind CSS"
    const element = screen.getByTestId("test");

    expect(element).toHaveTextContent(message);
  })
})