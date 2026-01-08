import React from 'react';
import { Calendar } from 'lucide-react';

const Filters = ({ selectedMonth, selectedYear, onMonthChange, onYearChange, availableYears }) => {
  const months = [
    { value: 'all', label: 'Todos os meses' },
    { value: '0', label: 'Janeiro' },
    { value: '1', label: 'Fevereiro' },
    { value: '2', label: 'Março' },
    { value: '3', label: 'Abril' },
    { value: '4', label: 'Maio' },
    { value: '5', label: 'Junho' },
    { value: '6', label: 'Julho' },
    { value: '7', label: 'Agosto' },
    { value: '8', label: 'Setembro' },
    { value: '9', label: 'Outubro' },
    { value: '10', label: 'Novembro' },
    { value: '11', label: 'Dezembro' }
  ];

  const years = [
    { value: 'all', label: 'Todos os anos' },
    ...availableYears.map(year => ({ value: year.toString(), label: year.toString() }))
  ];

  return (
    <div className="glass-card p-6 mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={24} className="text-cyan-400" />
          <span className="text-lg font-semibold">Filtrar Período</span>
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filtro de Mês */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Mês</label>
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="input-field w-full cursor-pointer"
            >
              {months.map(month => (
                <option key={month.value} value={month.value} className="bg-slate-800">
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de Ano */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Ano</label>
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value)}
              className="input-field w-full cursor-pointer"
            >
              {years.map(year => (
                <option key={year.value} value={year.value} className="bg-slate-800">
                  {year.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botão de Reset */}
        {(selectedMonth !== 'all' || selectedYear !== 'all') && (
          <button
            onClick={() => {
              onMonthChange('all');
              onYearChange('all');
            }}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
          >
            Limpar Filtros
          </button>
        )}
      </div>

      {/* Indicador de Filtro Ativo */}
      {(selectedMonth !== 'all' || selectedYear !== 'all') && (
        <div className="mt-4 flex items-center gap-2 text-sm text-cyan-400">
          <span className="font-medium">Exibindo:</span>
          <span>
            {selectedMonth !== 'all' && months.find(m => m.value === selectedMonth)?.label}
            {selectedMonth !== 'all' && selectedYear !== 'all' && ' de '}
            {selectedYear !== 'all' && selectedYear}
            {selectedMonth === 'all' && selectedYear !== 'all' && `Ano ${selectedYear} completo`}
          </span>
        </div>
      )}
    </div>
  );
};

export default Filters;
