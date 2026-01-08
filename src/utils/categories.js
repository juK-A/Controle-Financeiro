// Definição de categorias e tipos de gastos

export const TRANSACTION_TYPES = {
  ENTRADA: 'entrada',
  SAIDA: 'saida'
};

export const PRIORITY_TYPES = {
  NECESSARIO: 'necessario',
  FUTIL: 'futil',
  INVESTIMENTO: 'investimento'
};

export const PRIORITY_LABELS = {
  [PRIORITY_TYPES.NECESSARIO]: 'Necessário',
  [PRIORITY_TYPES.FUTIL]: 'Fútil',
  [PRIORITY_TYPES.INVESTIMENTO]: 'Investimento'
};

export const CATEGORIES = {
  entrada: [
    'Salário',
    'Freelance',
    'Investimentos',
    'Vendas',
    'Bonificações',
    'Dividendos',
    'Aluguel Recebido',
    'Outros'
  ],
  saida: {
    necessario: [
      'Aluguel/Moradia',
      'Alimentação',
      'Transporte',
      'Saúde',
      'Educação',
      'Contas Básicas',
      'Seguro',
      'Impostos'
    ],
    futil: [
      'Lazer',
      'Entretenimento',
      'Restaurantes',
      'Compras',
      'Assinaturas',
      'Viagens',
      'Beleza',
      'Hobbies'
    ],
    investimento: [
      'Poupança',
      'Ações',
      'Fundos',
      'Renda Fixa',
      'Criptomoedas',
      'Previdência',
      'Imóveis'
    ]
  }
};

export const COLORS = {
  entrada: '#06b6d4',
  necessario: '#f59e0b',
  futil: '#ec4899',
  investimento: '#8b5cf6'
};

export const CHART_COLORS = [
  '#06b6d4', // cyan
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#3b82f6', // blue
  '#f97316', // orange
  '#14b8a6', // teal
  '#a855f7'  // violet
];

// Função auxiliar para obter categorias baseado no tipo e prioridade
export const getCategoriesForType = (type, priority = null) => {
  if (type === TRANSACTION_TYPES.ENTRADA) {
    return CATEGORIES.entrada;
  }
  
  if (type === TRANSACTION_TYPES.SAIDA && priority) {
    return CATEGORIES.saida[priority] || [];
  }
  
  // Retorna todas as categorias de saída se não houver prioridade especificada
  return [
    ...CATEGORIES.saida.necessario,
    ...CATEGORIES.saida.futil,
    ...CATEGORIES.saida.investimento
  ];
};

// Função para determinar a prioridade baseada na categoria
export const getPriorityFromCategory = (category) => {
  if (CATEGORIES.saida.necessario.includes(category)) {
    return PRIORITY_TYPES.NECESSARIO;
  }
  if (CATEGORIES.saida.futil.includes(category)) {
    return PRIORITY_TYPES.FUTIL;
  }
  if (CATEGORIES.saida.investimento.includes(category)) {
    return PRIORITY_TYPES.INVESTIMENTO;
  }
  return null;
};

export default {
  TRANSACTION_TYPES,
  PRIORITY_TYPES,
  PRIORITY_LABELS,
  CATEGORIES,
  COLORS,
  CHART_COLORS,
  getCategoriesForType,
  getPriorityFromCategory
};
