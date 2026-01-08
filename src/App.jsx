import React, { useState, useEffect } from 'react';
import { Plus, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  subscribeToTransactions
} from './services/transactionService';
import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
  subscribeToCards,
  createDefaultCard
} from './services/cardService';

// Componentes existentes
import Dashboard from './components/Dashboard';
import Filters from './components/Filters';
import TransactionModal from './components/TransactionModal';
import TransactionList from './components/TransactionList';
import Charts from './components/Charts';
import CardList from './components/CardList';
import CardModal from './components/CardModal';

// Componentes de autenticação
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Utils existentes
import {
  filterTransactionsByPeriod,
  calculateTotals,
  calculateByPriority,
  calculateByCategory,
  calculateMonthlyEvolution,
  calculateSavingsRate,
  getAvailableYears,
  compareWithPreviousPeriod
} from './utils/calculations';
import { COLORS, PRIORITY_LABELS } from './utils/categories';
import './styles/global.css';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [showAuthMode, setShowAuthMode] = useState('login'); // 'login' ou 'register'

  // Estados principais
  const [transactions, setTransactions] = useState([]);
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Carregar transações e cartões do Supabase ao logar
  useEffect(() => {
    if (user) {
      loadTransactions();
      loadCards();

      // Configurar real-time subscription para transações
      const transactionSub = subscribeToTransactions(user.id, (payload) => {
        if (payload.eventType === 'INSERT') {
          setTransactions(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setTransactions(prev => prev.filter(t => t.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setTransactions(prev =>
            prev.map(t => (t.id === payload.new.id ? payload.new : t))
          );
        }
      });

      // Configurar real-time subscription para cartões
      const cardSub = subscribeToCards(user.id, (payload) => {
        if (payload.eventType === 'INSERT') {
          setCards(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setCards(prev => prev.filter(c => c.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setCards(prev =>
            prev.map(c => (c.id === payload.new.id ? payload.new : c))
          );
        }
      });

      return () => {
        transactionSub.unsubscribe();
        cardSub.unsubscribe();
      };
    }
  }, [user]);

  const loadTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Erro ao carregar transações:', err);
      setError('Erro ao carregar transações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const loadCards = async () => {
    try {
      const data = await getCards();
      if (data.length === 0) {
        // Criar cartão padrão se não existir nenhum
        await createDefaultCard();
        const updatedData = await getCards();
        setCards(updatedData);
      } else {
        setCards(data);
      }
    } catch (err) {
      console.error('Erro ao carregar cartões:', err);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([loadTransactions(), loadCards()]);
    } catch (err) {
      console.error('Erro ao atualizar dados:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Adicionar transação
  const handleAddTransaction = async (transaction) => {
    try {
      await createTransaction(transaction);
      setShowModal(false);
    } catch (err) {
      console.error('Erro ao adicionar transação:', err);
      alert('Erro ao adicionar transação. Tente novamente.');
    }
  };

  // Deletar transação
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta transação?')) {
      try {
        await deleteTransaction(id);
      } catch (err) {
        console.error('Erro ao deletar transação:', err);
        alert('Erro ao deletar transação. Tente novamente.');
      }
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Deseja sair da aplicação?')) {
      try {
        await signOut();
        setTransactions([]);
        setCards([]);
      } catch (err) {
        console.error('Erro ao fazer logout:', err);
      }
    }
  };

  // Gerenciar cartões
  const handleAddCard = async (cardData) => {
    try {
      if (editingCard) {
        await updateCard(editingCard.id, cardData);
        setEditingCard(null);
      } else {
        await createCard(cardData);
      }
      setShowCardModal(false);
    } catch (err) {
      console.error('Erro ao salvar cartão:', err);

      // Mostrar mensagem de erro mais detalhada
      const errorMessage = err.message || 'Erro desconhecido';
      const errorDetails = err.details || '';

      alert(`Erro ao salvar cartão:\n${errorMessage}\n${errorDetails}\n\nVerifique o console (F12) para mais detalhes.`);
    }
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setShowCardModal(true);
  };

  const handleDeleteCard = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este cartão?')) {
      try {
        await deleteCard(id);
      } catch (err) {
        console.error('Erro ao deletar cartão:', err);
        alert('Erro ao deletar cartão. Tente novamente.');
      }
    }
  };

  const handleCloseCardModal = () => {
    setShowCardModal(false);
    setEditingCard(null);
  };

  // Tela de loading inicial
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  // Tela de autenticação
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-slide-up">
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Gestão Financeira
            </h1>
            <p className="text-slate-400 text-lg">Controle inteligente das suas finanças</p>
          </div>

          {showAuthMode === 'login' ? (
            <Login
              onSwitchToRegister={() => setShowAuthMode('register')}
              onForgotPassword={() => alert('Funcionalidade em desenvolvimento')}
            />
          ) : (
            <Register onSwitchToLogin={() => setShowAuthMode('login')} />
          )}
        </div>
      </div>
    );
  }

  // Filtrar transações e calcular dados
  const filteredTransactions = filterTransactionsByPeriod(transactions, selectedMonth, selectedYear);
  const totals = calculateTotals(filteredTransactions);
  const priorities = calculateByPriority(filteredTransactions);
  const categoryData = calculateByCategory(filteredTransactions);
  const monthlyData = calculateMonthlyEvolution(transactions);
  const savingsRate = calculateSavingsRate(totals.entradas, totals.saidas);
  const availableYears = getAvailableYears(transactions);
  const comparison = compareWithPreviousPeriod(transactions, selectedMonth, selectedYear);

  const totalSaidas = priorities.necessarios + priorities.futeis + priorities.investimentos;
  const priorityChartData = [
    {
      name: PRIORITY_LABELS.necessario,
      value: priorities.necessarios,
      percentage: totalSaidas > 0 ? (priorities.necessarios / totalSaidas) * 100 : 0,
      color: COLORS.necessario
    },
    {
      name: PRIORITY_LABELS.futil,
      value: priorities.futeis,
      percentage: totalSaidas > 0 ? (priorities.futeis / totalSaidas) * 100 : 0,
      color: COLORS.futil
    },
    {
      name: PRIORITY_LABELS.investimento,
      value: priorities.investimentos,
      percentage: totalSaidas > 0 ? (priorities.investimentos / totalSaidas) * 100 : 0,
      color: COLORS.investimento
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 animate-slide-up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Gestão Financeira
            </h1>
            <p className="text-slate-400 text-lg">
              Olá, {user.email.split('@')[0]}!
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-xl"
            >
              <Plus size={20} />
              Nova Transação
            </button>
            <button
              onClick={handleLogout}
              className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-xl transition-colors"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Erro ao carregar */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Carregando transações...</p>
          </div>
        ) : (
          <>
            {/* Filtros */}
            <Filters
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
              availableYears={availableYears}
            />

            {/* Dashboard */}
            <Dashboard
              totals={totals}
              priorities={priorities}
              savingsRate={savingsRate}
              comparison={selectedMonth !== 'all' || selectedYear !== 'all' ? comparison : null}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />

            {/* Lista de Cartões */}
            <CardList
              cards={cards}
              onAddCard={() => setShowCardModal(true)}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
            />

            {/* Gráficos */}
            <Charts
              categoryData={categoryData}
              monthlyData={monthlyData}
              priorityData={priorityChartData}
            />

            {/* Lista de Transações */}
            <TransactionList
              transactions={filteredTransactions}
              onDelete={handleDeleteTransaction}
            />
          </>
        )}
      </div>

      {/* Modals */}
      <TransactionModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddTransaction}
        cards={cards}
      />

      <CardModal
        show={showCardModal}
        onClose={handleCloseCardModal}
        onSubmit={handleAddCard}
        editingCard={editingCard}
      />
    </div>
  );
}

export default App;
