import { render, screen } from '@testing-library/react';
import { Hello } from './Hello';

describe('Hello', () => {
  it('рендерит с именем по умолчанию', () => {
    render(<Hello />);
    expect(screen.getByText('Привет, Мир!')).toBeInTheDocument();
  });

  it('рендерит с переданным именем', () => {
    render(<Hello name="Николай" />);
    expect(screen.getByText('Привет, Николай!')).toBeInTheDocument();
  });
});
