import React from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const Dashboard = ({ totals, priorities, savingsRate, comparison, onRefresh, isRefreshing }) => {
  const getSaldoStatus = (saldo) => {
    if (saldo >= 1000) return { icon: CheckCircle, text: 'Excelente!', color: 'text-emerald-400' };
    if (saldo >= 0) return { icon: CheckCircle, text: 'Positivo', color: 'text-cyan-400' };
    return { icon: AlertCircle, text: 'Atenção', color: 'text-red-400' };
  };

  const getSavingsRateStatus = (rate) => {
    if (rate >= 30) return { text: 'Ótimo!', color: 'text-emerald-400' };
    if (rate >= 20) return { text: 'Bom', color: 'text-cyan-400' };
    if (rate >= 10) return { text: 'Regular', color: 'text-amber-400' };
    return { text: 'Baixa', color: 'text-red-400' };
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  const formatChange = (value) => {
    if (value === 0) return '';
    const sign = value > 0 ? '+' : '';
    return `${sign}R$ ${formatCurrency(Math.abs(value))}`;
  };

  const saldoStatus = getSaldoStatus(totals.saldo);
  const savingsStatus = getSavingsRateStatus(savingsRate);

  return (
    <div className="mb-8">
      {/* Header com botão de refresh */}
      {onRefresh && (
        <div className="flex justify-end mb-4">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:bg-white/5 disabled:opacity-50 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
            title="Atualizar dados"
          >
            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card Saldo */}
      <div className="glass-card p-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full gradient-purple flex items-center justify-center">
            <Wallet size={24} />
          </div>
          <span className="text-sm text-slate-400 font-medium">SALDO</span>
        </div>
        <p className={`text-3xl font-bold mb-1 ${totals.saldo >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          R$ {formatCurrency(totals.saldo)}
        </p>
        {comparison && comparison.saldoChange !== 0 && (
          <p className={`text-sm font-medium ${comparison.saldoChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatChange(comparison.saldoChange)} vs mês anterior
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <saldoStatus.icon size={16} className={saldoStatus.color} />
          <p className={`text-sm font-medium ${saldoStatus.color}`}>
            {saldoStatus.text}
          </p>
        </div>
      </div>

      {/* Card Entradas */}
      <div className="glass-card p-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full gradient-cyan flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <span className="text-sm text-slate-400 font-medium">ENTRADAS</span>
        </div>
        <p className="text-3xl font-bold mb-1">R$ {formatCurrency(totals.entradas)}</p>
        {comparison && comparison.entradasChange !== 0 && (
          <p className={`text-sm font-medium ${comparison.entradasChange > 0 ? 'text-cyan-400' : 'text-red-400'}`}>
            {formatChange(comparison.entradasChange)} vs mês anterior
          </p>
        )}
        <p className="text-cyan-400 text-sm font-medium mt-1">↑ Receitas do período</p>
      </div>

      {/* Card Saídas */}
      <div className="glass-card p-6 animate-scale-in" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full gradient-pink flex items-center justify-center">
            <TrendingDown size={24} />
          </div>
          <span className="text-sm text-slate-400 font-medium">SAÍDAS</span>
        </div>
        <p className="text-3xl font-bold mb-1">R$ {formatCurrency(totals.saidas)}</p>
        {comparison && comparison.saidasChange !== 0 && (
          <p className={`text-sm font-medium ${comparison.saidasChange < 0 ? 'text-cyan-400' : 'text-red-400'}`}>
            {formatChange(comparison.saidasChange)} vs mês anterior
          </p>
        )}
        <div className="text-sm text-slate-300 mt-2 space-y-1">
          <div className="flex justify-between">
            <span className="text-amber-400">Necessários:</span>
            <span>R$ {formatCurrency(priorities.necessarios)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-pink-400">Fúteis:</span>
            <span>R$ {formatCurrency(priorities.futeis)}</span>
          </div>
        </div>
      </div>

      {/* Card Taxa de Poupança */}
      <div className="glass-card p-6 animate-scale-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full gradient-emerald flex items-center justify-center">
            <PiggyBank size={24} />
          </div>
          <span className="text-sm text-slate-400 font-medium">POUPANÇA</span>
        </div>
        <p className="text-3xl font-bold mb-1">{savingsRate.toFixed(1)}%</p>
        <p className={`text-sm font-medium ${savingsStatus.color}`}>
          {savingsStatus.text}
        </p>
        <div className="text-sm text-slate-300 mt-2">
          <div className="flex justify-between">
            <span className="text-purple-400">Investimentos:</span>
            <span>R$ {formatCurrency(priorities.investimentos)}</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
