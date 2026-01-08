import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, AlertTriangle } from 'lucide-react';
import {
  validateCardNumber,
  detectCardBrand,
  formatCardNumber,
  getLastFourDigits
} from '../utils/encryption';

const CardModal = ({ show, onClose, onSubmit, editingCard = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'debit',
    color: '#8b5cf6',
    last_digits: '',
    brand: '',
    card_number: '',
    cardholder_name: '',
    expiry_month: '',
    expiry_year: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});
  const [showFullForm, setShowFullForm] = useState(false);

  useEffect(() => {
    if (editingCard) {
      setFormData({
        name: editingCard.name,
        type: editingCard.type,
        color: editingCard.color || '#8b5cf6',
        last_digits: editingCard.last_digits || '',
        brand: editingCard.brand || '',
        card_number: '',
        cardholder_name: editingCard.cardholder_name || '',
        expiry_month: editingCard.expiry_month || '',
        expiry_year: editingCard.expiry_year || '',
        cvv: ''
      });
      setShowFullForm(false);
    } else {
      setFormData({
        name: '',
        type: 'debit',
        color: '#8b5cf6',
        last_digits: '',
        brand: '',
        card_number: '',
        cardholder_name: '',
        expiry_month: '',
        expiry_year: '',
        cvv: ''
      });
      setShowFullForm(false);
    }
    setErrors({});
  }, [editingCard, show]);

  const handleCardNumberChange = (value) => {
    const formatted = formatCardNumber(value);
    setFormData({
      ...formData,
      card_number: formatted,
      last_digits: getLastFourDigits(value),
      brand: detectCardBrand(value)
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do cartão é obrigatório';
    }

    // Se preencheu número do cartão, validar
    if (showFullForm && formData.card_number) {
      const cleanNumber = formData.card_number.replace(/\s/g, '');

      if (!validateCardNumber(cleanNumber)) {
        newErrors.card_number = 'Número de cartão inválido';
      }

      // Só exigir nome do titular se preencheu número do cartão
      if (!formData.cardholder_name.trim()) {
        newErrors.cardholder_name = 'Nome do titular é obrigatório';
      }

      // Só exigir validade se preencheu número do cartão
      if (!formData.expiry_month || !formData.expiry_year) {
        newErrors.expiry = 'Data de validade é obrigatória';
      } else {
        const month = parseInt(formData.expiry_month);
        const year = parseInt(formData.expiry_year);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (month < 1 || month > 12) {
          newErrors.expiry = 'Mês inválido';
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
          newErrors.expiry = 'Cartão vencido';
        }
      }

      if (formData.cvv && (formData.cvv.length < 3 || formData.cvv.length > 4)) {
        newErrors.cvv = 'CVV deve ter 3 ou 4 dígitos';
      }
    }

    // Se está em modo completo MAS não preencheu número (editando), validar campos individualmente
    if (showFullForm && !formData.card_number) {
      // Se preencheu nome do titular, ok (pode estar atualizando apenas isso)
      // Se preencheu validade parcial, validar
      if ((formData.expiry_month && !formData.expiry_year) || (!formData.expiry_month && formData.expiry_year)) {
        newErrors.expiry = 'Preencha mês e ano completos';
      } else if (formData.expiry_month && formData.expiry_year) {
        const month = parseInt(formData.expiry_month);
        const year = parseInt(formData.expiry_year);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (month < 1 || month > 12) {
          newErrors.expiry = 'Mês inválido';
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
          newErrors.expiry = 'Cartão vencido';
        }
      }

      if (formData.cvv && (formData.cvv.length < 3 || formData.cvv.length > 4)) {
        newErrors.cvv = 'CVV deve ter 3 ou 4 dígitos';
      }
    }

    // Validar last_digits manual se não usar número completo
    if (!showFullForm && formData.last_digits && !/^\d{4}$/.test(formData.last_digits)) {
      newErrors.last_digits = 'Deve ter 4 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Preparar dados para enviar, removendo campos vazios desnecessários
      const dataToSubmit = {
        name: formData.name,
        type: formData.type,
        color: formData.color,
        last_digits: formData.last_digits || null,
        brand: formData.brand || null
      };

      // Adicionar campos do modo completo apenas se preenchidos
      if (formData.card_number) {
        dataToSubmit.card_number = formData.card_number;
      }
      if (formData.cardholder_name) {
        dataToSubmit.cardholder_name = formData.cardholder_name;
      }
      if (formData.expiry_month) {
        dataToSubmit.expiry_month = formData.expiry_month;
      }
      if (formData.expiry_year) {
        dataToSubmit.expiry_year = formData.expiry_year;
      }
      if (formData.cvv) {
        dataToSubmit.cvv = formData.cvv;
      }

      onSubmit(dataToSubmit);
      onClose();
    }
  };

  if (!show) return null;

  const cardColors = [
    { name: 'Roxo', value: '#8b5cf6' },
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Verde', value: '#10b981' },
    { name: 'Rosa', value: '#ec4899' },
    { name: 'Laranja', value: '#f59e0b' },
    { name: 'Vermelho', value: '#ef4444' },
    { name: 'Ciano', value: '#06b6d4' },
    { name: 'Índigo', value: '#6366f1' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card p-6 w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard size={24} className="text-cyan-400" />
            {editingCard ? 'Editar Cartão' : 'Novo Cartão'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Nome do Cartão *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Nubank, Sicredi, Carteira"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tipo *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors"
            >
              <option value="credit">Crédito</option>
              <option value="debit">Débito</option>
              <option value="cash">Dinheiro</option>
            </select>
          </div>

          {/* Toggle para formulário completo */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle size={20} className="text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-amber-300 font-medium mb-1">
                  Modo de Cadastro
                </p>
                <p className="text-xs text-amber-400/70">
                  {showFullForm
                    ? 'Cadastro completo: todos os dados serão criptografados localmente'
                    : 'Cadastro simplificado: apenas nome e últimos 4 dígitos'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFullForm(!showFullForm)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                showFullForm
                  ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Lock size={16} />
              {showFullForm ? 'Cadastro Completo Ativado' : 'Habilitar Cadastro Completo'}
            </button>
          </div>

          {/* Campos do modo simplificado */}
          {!showFullForm && (
            <>
              {/* Últimos 4 dígitos (opcional) */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Últimos 4 Dígitos (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.last_digits}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setFormData({ ...formData, last_digits: value });
                  }}
                  placeholder="1234"
                  maxLength={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                />
                {errors.last_digits && (
                  <p className="text-red-400 text-sm mt-1">{errors.last_digits}</p>
                )}
              </div>

              {/* Bandeira (opcional) */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Bandeira (Opcional)
                </label>
                <select
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  <option value="">Selecione...</option>
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="elo">Elo</option>
                  <option value="amex">American Express</option>
                  <option value="other">Outra</option>
                </select>
              </div>
            </>
          )}

          {/* Campos do modo completo */}
          {showFullForm && (
            <>
              {/* Número do Cartão */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Lock size={14} className="text-cyan-400" />
                  Número do Cartão *
                </label>
                <input
                  type="text"
                  value={formData.card_number}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                />
                {errors.card_number && (
                  <p className="text-red-400 text-sm mt-1">{errors.card_number}</p>
                )}
                {formData.brand && (
                  <p className="text-cyan-400 text-xs mt-1 capitalize">
                    Bandeira detectada: {formData.brand}
                  </p>
                )}
              </div>

              {/* Nome do Titular */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nome do Titular *
                </label>
                <input
                  type="text"
                  value={formData.cardholder_name}
                  onChange={(e) => setFormData({ ...formData, cardholder_name: e.target.value.toUpperCase() })}
                  placeholder="NOME COMO NO CARTÃO"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors uppercase"
                />
                {errors.cardholder_name && (
                  <p className="text-red-400 text-sm mt-1">{errors.cardholder_name}</p>
                )}
              </div>

              {/* Data de Validade e CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Validade *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.expiry_month}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                        setFormData({ ...formData, expiry_month: value });
                      }}
                      placeholder="MM"
                      maxLength={2}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 focus:outline-none focus:border-cyan-400 transition-colors font-mono text-center"
                    />
                    <input
                      type="text"
                      value={formData.expiry_year}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setFormData({ ...formData, expiry_year: value });
                      }}
                      placeholder="AAAA"
                      maxLength={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 focus:outline-none focus:border-cyan-400 transition-colors font-mono text-center"
                    />
                  </div>
                  {errors.expiry && (
                    <p className="text-red-400 text-xs mt-1">{errors.expiry}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Lock size={14} className="text-cyan-400" />
                    CVV (Opcional)
                  </label>
                  <input
                    type="password"
                    value={formData.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setFormData({ ...formData, cvv: value });
                    }}
                    placeholder="123"
                    maxLength={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                  />
                  {errors.cvv && (
                    <p className="text-red-400 text-xs mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>

              {/* Aviso sobre CVV */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-xs text-red-400 flex items-start gap-2">
                  <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Importante:</strong> O CVV é opcional e será criptografado.
                    Armazenar CVV pode violar normas PCI DSS. Use apenas para fins educacionais.
                  </span>
                </p>
              </div>
            </>
          )}

          {/* Cor */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Cor do Cartão
            </label>
            <div className="grid grid-cols-4 gap-3">
              {cardColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-full h-12 rounded-xl transition-all ${
                    formData.color === color.value
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div
            className="glass-card p-4 mt-4"
            style={{
              background: `linear-gradient(135deg, ${formData.color}33 0%, ${formData.color}11 100%)`,
              borderColor: `${formData.color}44`
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${formData.color}33` }}
              >
                <CreditCard size={20} />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-1" style={{ color: formData.color }}>
              {formData.name || 'Nome do Cartão'}
            </h3>
            {formData.last_digits && (
              <p className="text-sm text-slate-400 font-mono">
                •••• {formData.last_digits}
              </p>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary text-white px-6 py-3 rounded-xl font-semibold"
            >
              {editingCard ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardModal;
