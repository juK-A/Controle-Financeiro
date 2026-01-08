import React, { useState } from 'react';
import { TrendingUp, TrendingDown, X, Search } from 'lucide-react';
import { TRANSACTION_TYPES, PRIORITY_LABELS } from '../utils/categories';

const TransactionList = ({ transactions, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getPriorityBadge = (priority) => {
    const badges = {
      necessario: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', emoji: '🏠' },
      futil: { color: 'bg-pink-500/20 text-pink-400 border-pink-500/30', emoji: '🎮' },
      investimento: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', emoji: '📈' }
    };
    
    const badge = badges[priority];
    if (!badge) return null;

    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${badge.color}`}>
        {badge.emoji} {PRIORITY_LABELS[priority]}
      </span>
    );
  };

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Transações</h2>
        
        {/* Busca */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar transações..."
            className="input-field w-full pl-10"
          />
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg">
            {searchTerm ? 'Nenhuma transação encontrada' : 'Nenhuma transação registrada'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Limpar busca
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className="transaction-item flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Ícone */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  transaction.type === TRANSACTION_TYPES.ENTRADA ? 'gradient-cyan' : 'gradient-pink'
                }`}>
                  {transaction.type === TRANSACTION_TYPES.ENTRADA ? 
                    <TrendingUp size={20} /> : 
                    <TrendingDown size={20} />
                  }
                </div>

                {/* Informações */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-lg truncate">{transaction.description}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-sm text-slate-400">{transaction.category}</span>
                    {transaction.priority && getPriorityBadge(transaction.priority)}
                    <span className="text-slate-600">•</span>
                    <span className="text-sm text-slate-400">
                      {new Date(transaction.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Valor e ações */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <p className={`text-xl font-bold ${
                  transaction.type === TRANSACTION_TYPES.ENTRADA ? 'text-cyan-400' : 'text-pink-400'
                }`}>
                  {transaction.type === TRANSACTION_TYPES.ENTRADA ? '+' : '-'} R$ {
                    transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                  }
                </p>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-lg"
                  title="Deletar transação"
                >
                  <X size={18} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumo */}
      {filteredTransactions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10 text-sm text-slate-400">
          Mostrando {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transação' : 'transações'}
          {searchTerm && ' (filtrado)'}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
