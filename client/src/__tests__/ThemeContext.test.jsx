/**
 * client/src/__tests__/ThemeContext.test.jsx
 * Тесты переключения тёмной темы
 *
 * Запуск: npm test (из папки client/)
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

// Тестовый компонент который использует контекст темы
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

  it('по умолчанию используется светлая тема', () => {
    render(
      <ThemeProvider>
        <ThemeToggler />
      </ThemeProvider>
    );
    const themeEl = screen.getByTestId('current-theme');
    expect(themeEl.textContent).toMatch(/light|светлая/i);
  });

  it('тема переключается при клике на кнопку', () => {
    render(
      <ThemeProvider>
        <ThemeToggler />
      </ThemeProvider>
    );

    const btn = screen.getByRole('button', { name: /переключить тему/i });
    const themeEl = screen.getByTestId('current-theme');

    const initialTheme = themeEl.textContent;
    fireEvent.click(btn);
    expect(themeEl.textContent).not.toBe(initialTheme);
  });

  it('повторный клик возвращает исходную тему', () => {
    render(
      <ThemeProvider>
        <ThemeToggler />
      </ThemeProvider>
    );

    const btn = screen.getByRole('button', { name: /переключить тему/i });
    const themeEl = screen.getByTestId('current-theme');

    const initialTheme = themeEl.textContent;
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(themeEl.textContent).toBe(initialTheme);
  });

  it('выбрасывает ошибку при использовании вне ThemeProvider', () => {
    // Подавляем console.error для чистого вывода теста
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<ThemeToggler />)).toThrow();

    spy.mockRestore();
  });
});
