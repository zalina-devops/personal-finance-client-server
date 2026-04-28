import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../api/auth', () => ({
  login: jest.fn(),
}));

import { login } from '../api/auth';

global.alert = jest.fn(); // на всякий случай

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
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('отображает кнопку Login', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('показывает ошибку при пустой отправке формы', async () => {
    renderLogin();
    const submitBtn = screen.getByRole('button', { name: /login/i });
    
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/email and password are required/i)).toBeInTheDocument();
    });

    expect(login).not.toHaveBeenCalled();
  });

  it('вызывает login с введёнными данными', async () => {
    login.mockResolvedValue({ token: 'fake-jwt-token' });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('показывает сообщение об ошибке при неверных данных', async () => {
    const errorMsg = 'Неверный email или пароль';
    login.mockRejectedValue({
      response: { data: { message: errorMsg } },
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});