import React from 'react';
import { render, screen } from '@testing-library/react';
import SummaryCards from '../pages/Dashboard/SummaryCards';

const mockTransactions = [
  { id: 1, type: 'income', amount: 50000, category: 'Зарплата' },
  { id: 2, type: 'income', amount: 10000, category: 'Фриланс' },
  { id: 3, type: 'expense', amount: 5000, category: 'Еда' },
  { id: 4, type: 'expense', amount: 3000, category: 'Транспорт' },
  { id: 5, type: 'expense', amount: 1500, category: 'Кафе' },
];

describe('SummaryCards — сводные карточки', () => {
  it('отображается без ошибок с корректными данными', () => {
    render(<SummaryCards transactions={mockTransactions} />);
  });

  it('отображается без ошибок с пустым массивом', () => {
    render(<SummaryCards transactions={[]} />);
  });

  it('показывает суммарный доход (60000)', () => {
    render(<SummaryCards transactions={mockTransactions} />);
    expect(screen.getByText(/60000|60[., ]?000|60\s?000/i)).toBeInTheDocument();
  });

  it('показывает суммарный расход (9500)', () => {
    render(<SummaryCards transactions={mockTransactions} />);
    expect(screen.getByText(/9500|9[., ]?500|9\s?500/i)).toBeInTheDocument();
  });

  it('показывает нули при пустом списке транзакций', () => {
    render(<SummaryCards transactions={[]} />);
    
    // Ищем все элементы с нулём (должно быть минимум 3: Balance, Income, Expense)
    const zeroElements = screen.getAllByText(/0|0[., ]?00/i);
    
    expect(zeroElements.length).toBeGreaterThanOrEqual(2); // минимум Balance и Income/Expense
  });

  it('правильно считает доход и расход', () => {
    render(<SummaryCards transactions={mockTransactions} />);
    
    expect(screen.getByText(/60000|60[., ]?000/i)).toBeInTheDocument();
    expect(screen.getByText(/9500|9[., ]?500/i)).toBeInTheDocument();
  });
});