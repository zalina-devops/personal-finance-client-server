/**
 * client/src/__tests__/SummaryCards.test.jsx
 * Тесты компонента сводных карточек дашборда
 *
 * Запуск: npm test (из папки client/)
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import SummaryCards from '../pages/Dashboard/SummaryCards';

// Моковые данные транзакций
const mockTransactions = [
  { id: 1, type: 'income',  amount: '50000', category: 'Зарплата' },
  { id: 2, type: 'income',  amount: '10000', category: 'Фриланс'  },
  { id: 3, type: 'expense', amount: '5000',  category: 'Еда'       },
  { id: 4, type: 'expense', amount: '3000',  category: 'Транспорт' },
  { id: 5, type: 'expense', amount: '1500',  category: 'Кафе'      },
];

describe('SummaryCards — сводные карточки', () => {

  it('отображает без ошибок с корректными данными', () => {
    render(<SummaryCards transactions={mockTransactions} />);
  });

  it('отображает без ошибок с пустым массивом', () => {
    render(<SummaryCards transactions={[]} />);
  });

  it('показывает суммарный доход (60 000 ₽)', () => {
    render(<SummaryCards transactions={mockTransactions} />);
    // Ищем текст с суммой доходов — 50000 + 10000 = 60000
    expect(screen.getByText(/60.000/i) || screen.getByText(/60 000/i)).toBeTruthy();
  });

  it('показывает суммарный расход (9 500 ₽)', () => {
    render(<SummaryCards transactions={mockTransactions} />);
    // 5000 + 3000 + 1500 = 9500
    expect(screen.getByText(/9.500/i) || screen.getByText(/9 500/i)).toBeTruthy();
  });

  it('корректно показывает нули при пустом списке', () => {
    render(<SummaryCards transactions={[]} />);
    const zeros = screen.getAllByText(/0/);
    expect(zeros.length).toBeGreaterThan(0);
  });
});
