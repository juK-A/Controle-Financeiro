import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TRANSACTION_TYPES, PRIORITY_TYPES, PRIORITY_LABELS, getCategoriesForType } from '../utils/categories';

const TransactionModal = ({ show, onClose, onSubmit, cards = [] }) => {
  const [formData, setFormData] = useState({
    type: TRANSACTION_TYPES.ENTRADA,
    priority: null,
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    card_id: ''
  });

  const handleTypeChange = (type) => {
    setFormData({
      ...formData,
      type,
      priority: type === TRANSACTION_TYPES.SAIDA ? PRIORITY_TYPES.NECESSARIO : null,
      category: ''
    });
  };

  const handlePriorityChange = (priority) => {
    setFormData({
      ...formData,
      priority,
      category: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    
    // Reset form
    setFormData({
      type: TRANSACTION_TYPES.ENTRADA,
      priority: null,
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      card_id: ''
    });
  };

  if (!show) return null;

  const categories = formData.type === TRANSACTION_TYPES.ENTRADA 
    ? getCategoriesForType(TRANSACTION_TYPES.ENTRADA)
    : getCategoriesForType(TRANSACTION_TYPES.SAIDA, formData.priority);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="glass-card p-8 max-w-md w-full animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Nova Transação</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Transação */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Tipo de Transação</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange(TRANSACTION_TYPES.ENTRADA)}
                className={`p-3 rounded-xl font-semibold transition-all ${
                  formData.type === TRANSACTION_TYPES.ENTRADA
                    ? 'gradient-cyan text-white shadow-lg'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                💰 Entrada
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange(TRANSACTION_TYPES.SAIDA)}
                className={`p-3 rounded-xl font-semibold transition-all ${
                  formData.type === TRANSACTION_TYPES.SAIDA
                    ? 'gradient-pink text-white shadow-lg'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                💸 Saída
              </button>
            </div>
          </div>

          {/* Prioridade (apenas para saídas) */}
          {formData.type === TRANSACTION_TYPES.SAIDA && (
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Tipo de Gasto</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handlePriorityChange(PRIORITY_TYPES.NECESSARIO)}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all ${
                    formData.priority === PRIORITY_TYPES.NECESSARIO
                      ? 'bg-amber-500 text-white shadow-lg'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  🏠 {PRIORITY_LABELS[PRIORITY_TYPES.NECESSARIO]}
                </button>
                <button
                  type="button"
                  onClick={() => handlePriorityChange(PRIORITY_TYPES.FUTIL)}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all ${
                    formData.priority === PRIORITY_TYPES.FUTIL
                      ? 'gradient-pink text-white shadow-lg'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  🎮 {PRIORITY_LABELS[PRIORITY_TYPES.FUTIL]}
                </button>
                <button
                  type="button"
                  onClick={() => handlePriorityChange(PRIORITY_TYPES.INVESTIMENTO)}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all ${
                    formData.priority === PRIORITY_TYPES.INVESTIMENTO
                      ? 'gradient-purple text-white shadow-lg'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  📈 {PRIORITY_LABELS[PRIORITY_TYPES.INVESTIMENTO]}
                </button>
              </div>
            </div>
          )}

          {/* Cartão */}
          {cards.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Cartão (Opcional)</label>
              <select
                value={formData.card_id}
                onChange={(e) => setFormData({ ...formData, card_id: e.target.value })}
                className="input-field w-full cursor-pointer"
              >
                <option value="" className="bg-slate-800">Sem cartão</option>
                {cards.map(card => (
                  <option key={card.id} value={card.id} className="bg-slate-800">
                    {card.name} {card.last_digits ? `(•••• ${card.last_digits})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input-field w-full"
              placeholder="0,00"
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Categoria</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field w-full cursor-pointer"
              disabled={formData.type === TRANSACTION_TYPES.SAIDA && !formData.priority}
            >
              <option value="" className="bg-slate-800">Selecione uma categoria...</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
              ))}
            </select>
            {formData.type === TRANSACTION_TYPES.SAIDA && !formData.priority && (
              <p className="text-xs text-slate-400 mt-1">Selecione o tipo de gasto primeiro</p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Descrição</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field w-full"
              placeholder="Ex: Compras do mercado"
            />
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Data</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field w-full"
            />
          </div>

          {/* Botão Submit */}
          <button
            type="submit"
            className="btn-primary w-full py-3 rounded-xl font-semibold text-white shadow-xl mt-6"
          >
            ✨ Adicionar Transação
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
