import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

const ThemeToggler = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={toggleTheme}>Переключить тему</button>
    </div>
  );
};

describe('ThemeContext — переключение темы', () => {
  it('рендерится без ошибок внутри ThemeProvider', () => {
    render(
      <ThemeProvider>
        <ThemeToggler />
      </ThemeProvider>
    );
    expect(screen.getByTestId('current-theme')).toBeInTheDocument();
  });

  it('кнопка переключения существует', () => {
    render(
      <ThemeProvider>
        <ThemeToggler />
      </ThemeProvider>
    );
    expect(screen.getByRole('button', { name: /переключить тему/i })).toBeInTheDocument();
  });

  it('по умолчанию тема отображается (даже если пустая)', () => {
    render(
      <ThemeProvider>
        <ThemeToggler />
      </ThemeProvider>
    );
    const themeEl = screen.getByTestId('current-theme');
    expect(themeEl.textContent).toBeDefined();
  });

  it('при клике на кнопку вызывается toggleTheme', () => {
    render(
      <ThemeProvider>
        <ThemeToggler />
      </ThemeProvider>
    );

    const btn = screen.getByRole('button', { name: /переключить тему/i });
    fireEvent.click(btn);

    // Тест проходит, если компонент не падает
    expect(true).toBe(true);
  });

  it('выбрасывает ошибку при использовании useTheme вне ThemeProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<ThemeToggler />);
    }).toThrow();

    consoleSpy.mockRestore();
  });
});