import React from 'react';
import { CreditCard, Wallet, Plus, Trash2, Edit } from 'lucide-react';

const CardList = ({ cards, onAddCard, onEditCard, onDeleteCard }) => {
  const getCardIcon = (type) => {
    switch (type) {
      case 'cash':
        return <Wallet size={20} />;
      case 'credit':
      case 'debit':
      default:
        return <CreditCard size={20} />;
    }
  };

  const getCardBrandLogo = (brand) => {
    const brandLogos = {
      visa: '💳',
      mastercard: '💳',
      elo: '💳',
      amex: '💳'
    };
    return brandLogos[brand?.toLowerCase()] || '💳';
  };

  const formatCardNumber = (lastDigits) => {
    if (!lastDigits) return '';
    return `•••• ${lastDigits}`;
  };

  return (
    <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <CreditCard size={24} className="text-cyan-400" />
        Meus Cartões
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="glass-card p-4 relative group hover:scale-105 transition-transform duration-200"
            style={{
              background: `linear-gradient(135deg, ${card.color}33 0%, ${card.color}11 100%)`,
              borderColor: `${card.color}44`
            }}
          >
            {/* Botões de ação */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEditCard(card)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => onDeleteCard(card.id)}
                className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Ícone e tipo */}
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${card.color}33` }}
              >
                {getCardIcon(card.type)}
              </div>
              {card.brand && (
                <span className="text-2xl">{getCardBrandLogo(card.brand)}</span>
              )}
            </div>

            {/* Nome do cartão */}
            <h3 className="text-lg font-semibold mb-1" style={{ color: card.color }}>
              {card.name}
            </h3>

            {/* Nome do titular (se existir) */}
            {card.cardholder_name && (
              <p className="text-xs text-slate-500 mb-1 truncate">
                {card.cardholder_name}
              </p>
            )}

            {/* Últimos dígitos */}
            {card.last_digits && (
              <p className="text-sm text-slate-400 font-mono mb-1">
                {formatCardNumber(card.last_digits)}
              </p>
            )}

            {/* Data de validade */}
            {card.expiry_month && card.expiry_year && (
              <p className="text-xs text-slate-500 font-mono">
                Val: {card.expiry_month}/{card.expiry_year}
              </p>
            )}

            {/* Tipo */}
            {!card.cardholder_name && !card.expiry_month && (
              <p className="text-xs text-slate-500 mt-2 uppercase">
                {card.type === 'credit' && 'Crédito'}
                {card.type === 'debit' && 'Débito'}
                {card.type === 'cash' && 'Dinheiro'}
              </p>
            )}
          </div>
        ))}

        {/* Card para adicionar novo */}
        <button
          onClick={onAddCard}
          className="glass-card p-4 flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-all duration-200 group"
        >
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 group-hover:bg-cyan-500/30 flex items-center justify-center transition-colors">
            <Plus size={20} className="text-cyan-400" />
          </div>
          <div className="text-center flex-1 flex flex-col justify-center">
            <span className="text-base font-semibold text-slate-300 group-hover:text-cyan-400 transition-colors">
              Novo Cartão
            </span>
            <span className="text-xs text-slate-500 mt-1">Clique para adicionar</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CardList;
