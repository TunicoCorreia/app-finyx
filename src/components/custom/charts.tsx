'use client';

import { useMemo } from 'react';
import type { Transaction, CategorySummary } from '@/lib/types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/types';

interface ChartsProps {
  transactions: Transaction[];
}

export function ExpensePieChart({ transactions }: ChartsProps) {
  const expenseData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = new Map<string, number>();

    expenses.forEach(t => {
      const current = categoryTotals.get(t.category) || 0;
      categoryTotals.set(t.category, current + t.amount);
    });

    const total = Array.from(categoryTotals.values()).reduce((sum, val) => sum + val, 0);

    const data: CategorySummary[] = Array.from(categoryTotals.entries()).map(([category, amount]) => ({
      category: category as any,
      total: amount,
      percentage: (amount / total) * 100,
      color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || '#64748b'
    }));

    return data.sort((a, b) => b.total - a.total);
  }, [transactions]);

  if (expenseData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Nenhuma despesa registrada
      </div>
    );
  }

  const total = expenseData.reduce((sum, item) => sum + item.total, 0);
  let currentAngle = 0;

  return (
    <div className="space-y-4">
      <div className="relative w-64 h-64 mx-auto">
        <svg viewBox="0 0 200 200" className="transform -rotate-90">
          {expenseData.map((item, index) => {
            const percentage = item.percentage;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const startX = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
            const startY = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
            const endX = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
            const endY = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M 100 100`,
              `L ${startX} ${startY}`,
              `A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `Z`
            ].join(' ');
            
            currentAngle = endAngle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                className="transition-opacity hover:opacity-80"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              R$ {total.toFixed(2)}
            </div>
            <div className="text-sm text-gray-400">Total</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {expenseData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-gray-300">
                {CATEGORY_LABELS[item.category]}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-white">
                R$ {item.total.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">
                {item.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MonthlyBarChart({ transactions }: ChartsProps) {
  const monthlyData = useMemo(() => {
    const months = new Map<string, { income: number; expense: number }>();

    transactions.forEach(t => {
      const month = t.date.substring(0, 7); // YYYY-MM
      const current = months.get(month) || { income: 0, expense: 0 };
      
      if (t.type === 'income') {
        current.income += t.amount;
      } else {
        current.expense += t.amount;
      }
      
      months.set(month, current);
    });

    return Array.from(months.entries())
      .map(([month, data]) => ({
        month,
        ...data
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // últimos 6 meses
  }, [transactions]);

  if (monthlyData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Nenhuma transação registrada
      </div>
    );
  }

  const maxValue = Math.max(
    ...monthlyData.map(d => Math.max(d.income, d.expense))
  );

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'short' });
  };

  return (
    <div className="space-y-4">
      <div className="h-64 flex items-end justify-around gap-4 px-4">
        {monthlyData.map((data, index) => {
          const incomeHeight = (data.income / maxValue) * 100;
          const expenseHeight = (data.expense / maxValue) * 100;

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex gap-1 items-end h-48">
                <div
                  className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${incomeHeight}%` }}
                  title={`Receitas: R$ ${data.income.toFixed(2)}`}
                />
                <div
                  className="flex-1 bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${expenseHeight}%` }}
                  title={`Despesas: R$ ${data.expense.toFixed(2)}`}
                />
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {formatMonth(data.month)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded" />
          <span className="text-sm text-gray-300">Receitas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-400 rounded" />
          <span className="text-sm text-gray-300">Despesas</span>
        </div>
      </div>
    </div>
  );
}
