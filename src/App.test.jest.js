import { render, screen } from '@testing-library/react';
import App from './App';

test('muestra el título principal de Huerto Hogar', () => {
  render(<App />);
  const titulo = screen.getByText(/Huerto Hogar/i);
  expect(titulo).toBeInTheDocument();
});
