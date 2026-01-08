// Funções de cálculos financeiros

import { TRANSACTION_TYPES, PRIORITY_TYPES } from './categories';

// Filtrar transações por mês e ano
export const filterTransactionsByPeriod = (transactions, month, year) => {
  if (month === 'all' && year === 'all') {
    return transactions;
  }

  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const transactionMonth = transactionDate.getMonth();
    const transactionYear = transactionDate.getFullYear();

    const monthMatch = month === 'all' || transactionMonth === parseInt(month);
    const yearMatch = year === 'all' || transactionYear === parseInt(year);

    return monthMatch && yearMatch;
  });
};

// Calcular totais de entradas e saídas
export const calculateTotals = (transactions) => {
  const entradas = transactions
    .filter(t => t.type === TRANSACTION_TYPES.ENTRADA)
    .reduce((sum, t) => sum + t.amount, 0);

  const saidas = transactions
    .filter(t => t.type === TRANSACTION_TYPES.SAIDA)
    .reduce((sum, t) => sum + t.amount, 0);

  const saldo = entradas - saidas;

  return { entradas, saidas, saldo };
};

// Calcular gastos por prioridade
export const calculateByPriority = (transactions) => {
  const necessarios = transactions
    .filter(t => t.type === TRANSACTION_TYPES.SAIDA && t.priority === PRIORITY_TYPES.NECESSARIO)
    .reduce((sum, t) => sum + t.amount, 0);

  const futeis = transactions
    .filter(t => t.type === TRANSACTION_TYPES.SAIDA && t.priority === PRIORITY_TYPES.FUTIL)
    .reduce((sum, t) => sum + t.amount, 0);

  const investimentos = transactions
    .filter(t => t.type === TRANSACTION_TYPES.SAIDA && t.priority === PRIORITY_TYPES.INVESTIMENTO)
    .reduce((sum, t) => sum + t.amount, 0);

  return { necessarios, futeis, investimentos };
};

// Calcular dados por categoria
export const calculateByCategory = (transactions) => {
  const categorias = {};
  
  transactions
    .filter(t => t.type === TRANSACTION_TYPES.SAIDA)
    .forEach(t => {
      if (!categorias[t.category]) {
        categorias[t.category] = {
          name: t.category,
          value: 0,
          priority: t.priority
        };
      }
      categorias[t.category].value += t.amount;
    });

  return Object.values(categorias).sort((a, b) => b.value - a.value);
};

// Calcular evolução mensal
export const calculateMonthlyEvolution = (transactions) => {
  const monthlyData = {};

  transactions.forEach(t => {
    const date = new Date(t.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = {
        month: monthYear,
        monthLabel: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        entradas: 0,
        saidas: 0,
        saldo: 0
      };
    }

    if (t.type === TRANSACTION_TYPES.ENTRADA) {
      monthlyData[monthYear].entradas += t.amount;
    } else {
      monthlyData[monthYear].saidas += t.amount;
    }
  });

  // Calcular saldo para cada mês
  Object.keys(monthlyData).forEach(key => {
    monthlyData[key].saldo = monthlyData[key].entradas - monthlyData[key].saidas;
  });

  return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
};

// Calcular taxa de poupança
export const calculateSavingsRate = (entradas, saidas) => {
  if (entradas === 0) return 0;
  return ((entradas - saidas) / entradas) * 100;
};

// Obter meses disponíveis nas transações
export const getAvailableMonths = (transactions) => {
  const months = new Set();
  transactions.forEach(t => {
    const date = new Date(t.date);
    months.add(date.getMonth());
  });
  return Array.from(months).sort((a, b) => a - b);
};

// Obter anos disponíveis nas transações
export const getAvailableYears = (transactions) => {
  const years = new Set();
  transactions.forEach(t => {
    const date = new Date(t.date);
    years.add(date.getFullYear());
  });
  return Array.from(years).sort((a, b) => b - a);
};

// Comparar período atual com anterior
export const compareWithPreviousPeriod = (transactions, month, year) => {
  const currentPeriod = filterTransactionsByPeriod(transactions, month, year);
  const currentTotals = calculateTotals(currentPeriod);

  // Calcular período anterior
  let previousMonth = month === 'all' ? 'all' : parseInt(month) - 1;
  let previousYear = year;

  if (previousMonth < 0) {
    previousMonth = 11;
    previousYear = year === 'all' ? 'all' : parseInt(year) - 1;
  }

  const previousPeriod = filterTransactionsByPeriod(
    transactions, 
    previousMonth.toString(), 
    previousYear.toString()
  );
  const previousTotals = calculateTotals(previousPeriod);

  return {
    current: currentTotals,
    previous: previousTotals,
    entradasChange: currentTotals.entradas - previousTotals.entradas,
    saidasChange: currentTotals.saidas - previousTotals.saidas,
    saldoChange: currentTotals.saldo - previousTotals.saldo
  };
};

export default {
  filterTransactionsByPeriod,
  calculateTotals,
  calculateByPriority,
  calculateByCategory,
  calculateMonthlyEvolution,
  calculateSavingsRate,
  getAvailableMonths,
  getAvailableYears,
  compareWithPreviousPeriod
};
