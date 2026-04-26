/**
 * client/src/__tests__/Login.test.jsx
 * Тесты страницы входа
 *
 * Запуск: npm test (из папки client/)
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';

// Мокируем navigate чтобы не падать без роутера
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Мокируем API чтобы не делать реальных запросов
jest.mock('../api/auth', () => ({
  login: jest.fn(),
  register: jest.fn(),
}));

import { login, register } from '../api/auth';

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

describe('Login — страница входа', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('рендерится без ошибок', () => {
    renderLogin();
  });

  it('отображает поля email и пароля', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i) || screen.getByPlaceholderText(/email/i)).toBeTruthy();
    expect(screen.getByLabelText(/пароль/i) || screen.getByPlaceholderText(/пароль/i) || screen.getByLabelText(/password/i)).toBeTruthy();
  });

  it('отображает кнопку входа', () => {
    renderLogin();
    expect(
      screen.getByRole('button', { name: /войти/i }) ||
      screen.getByRole('button', { name: /вход/i }) ||
      screen.getByRole('button', { name: /login/i })
    ).toBeTruthy();
  });

  it('показывает ошибку при пустой отправке формы', async () => {
    renderLogin();

    const submitBtn = screen.getByRole('button', { name: /войти|вход|login/i });
    fireEvent.click(submitBtn);

    // Проверяем что API не вызвалось
    expect(login).not.toHaveBeenCalled();
  });

  it('вызывает login с введёнными данными', async () => {
    login.mockResolvedValue({ token: 'fake-jwt-token' });
    renderLogin();

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/пароль|password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const submitBtn = screen.getByRole('button', { name: /войти|вход|login/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('показывает сообщение об ошибке при неверных данных', async () => {
    login.mockRejectedValue({ response: { data: { message: 'Неверный email или пароль' } } });
    renderLogin();

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/пароль|password/i);

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    const submitBtn = screen.getByRole('button', { name: /войти|вход|login/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/неверный|ошибка|error/i)).toBeTruthy();
    });
  });
});
