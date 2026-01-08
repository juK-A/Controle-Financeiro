# 💰 Sistema de Gestão Financeira

Sistema completo de controle financeiro pessoal com análise temporal, categorização de gastos, gerenciamento de cartões e visualização de dados.

## 🚀 Funcionalidades

### 🔐 Autenticação e Segurança
- ✅ Login e registro de usuários via Supabase
- 🔒 Autenticação segura
- 👤 Dados isolados por usuário (Row Level Security)

### 💳 Gerenciamento de Cartões (NOVO!)
- ✅ Cadastro de cartões de crédito, débito e dinheiro
- 🎨 Personalização com cores e nomes
- 🔒 **Modo Completo**: Armazenamento seguro com criptografia AES-256
- 🔍 Detecção automática de bandeira (Visa, Mastercard, Elo, etc)
- ✏️ Edição e exclusão de cartões
- 🔄 Sincronização em tempo real entre dispositivos
- 🎯 Associação de transações a cartões específicos

### Gestão de Transações
- ✅ Registro de entradas e saídas
- 📅 Filtros por mês e ano
- 🗑️ Exclusão de transações
- 💳 Vinculação opcional a cartões
- 🔄 Atualização em tempo real
- 📊 Dados persistentes no Supabase

### Categorização Inteligente
- **Gastos Necessários**: Aluguel, alimentação, transporte, saúde, educação
- **Gastos Fúteis**: Lazer, entretenimento, compras não essenciais
- **Investimentos**: Aplicações, poupança, ações
- **Outras Categorias**: Personalizáveis

### Análises e Relatórios
- 📈 Gráfico de evolução mensal do saldo
- 🥧 Distribuição de gastos por categoria
- 📊 Comparação entre gastos necessários vs fúteis
- 💹 Análise temporal de receitas e despesas
- 📉 Taxa de poupança mensal

### Dashboard Completo
- 💵 Cards de resumo (Entradas, Saídas, Saldo)
- 🎯 Indicadores de saúde financeira
- 🔄 Botão de atualização manual
- 📋 Lista detalhada de transações
- 🔍 Sistema de busca e filtros
- 💳 Visualização de cartões cadastrados

## 🛠️ Tecnologias

- **React 18** - Framework principal
- **Supabase** - Backend, autenticação e banco de dados
- **Web Crypto API** - Criptografia AES-256 client-side
- **Recharts** - Visualização de dados
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Vite** - Build tool

## 📦 Instalação

### Pré-requisitos
- Node.js 16+ instalado
- Conta no [Supabase](https://supabase.com) (gratuito)

### Passos

```bash
# 1. Clone ou extraia o projeto
cd gestao-financeira-app

# 2. Instale as dependências
npm install

# 3. Configure o Supabase
# - Crie um projeto no Supabase
# - Configure as credenciais em src/lib/supabaseClient.js
# - Execute os scripts SQL:
#   1. supabase-cards-setup.sql
#   2. supabase-cards-encryption.sql

# 4. Habilite Realtime no Supabase
# - Database > Replication
# - Ative para as tabelas: transactions, cards

# 5. Inicie o servidor de desenvolvimento
npm run dev

# 6. Acesse no navegador
http://localhost:5173
```

### 📚 Documentação Adicional
- **SETUP-CARDS.md** - Configuração detalhada do sistema de cartões
- **CARDS-SECURITY.md** - Informações sobre segurança e criptografia
- **TROUBLESHOOTING.md** - Solução de problemas comuns
- **supabase-verify.sql** - Script para verificar configuração

## 🏗️ Estrutura do Projeto

```
gestao-financeira-app/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx            # Tela de login
│   │   │   └── Register.jsx         # Tela de registro
│   │   ├── Dashboard.jsx            # Cards de resumo + botão refresh
│   │   ├── TransactionModal.jsx     # Modal de nova transação
│   │   ├── TransactionList.jsx      # Lista de transações
│   │   ├── Charts.jsx               # Todos os gráficos
│   │   ├── Filters.jsx              # Filtros mês/ano
│   │   ├── CardList.jsx             # Lista de cartões (NOVO!)
│   │   └── CardModal.jsx            # Modal de cartão (NOVO!)
│   ├── contexts/
│   │   └── AuthContext.jsx          # Contexto de autenticação
│   ├── services/
│   │   ├── transactionService.js    # CRUD de transações
│   │   └── cardService.js           # CRUD de cartões (NOVO!)
│   ├── utils/
│   │   ├── categories.js            # Definição de categorias
│   │   ├── calculations.js          # Cálculos financeiros
│   │   └── encryption.js            # Criptografia AES-256 (NOVO!)
│   ├── lib/
│   │   └── supabaseClient.js        # Cliente Supabase
│   ├── styles/
│   │   └── global.css               # Estilos globais
│   ├── App.jsx                      # Componente principal
│   └── main.jsx                     # Entry point
├── public/
│   └── index.html
├── Scripts SQL/
│   ├── supabase-cards-setup.sql     # Setup inicial de cartões
│   ├── supabase-cards-encryption.sql # Campos de criptografia
│   └── supabase-verify.sql          # Verificação da config
├── Documentação/
│   ├── SETUP-CARDS.md               # Guia de configuração
│   ├── CARDS-SECURITY.md            # Segurança detalhada
│   └── TROUBLESHOOTING.md           # Solução de problemas
├── package.json
└── README.md
```

## 💡 Como Usar

### Adicionar Cartão (NOVO!)
1. Clique em "Novo Cartão" na seção "Meus Cartões"
2. **Modo Simplificado**:
   - Preencha nome, tipo (crédito/débito/dinheiro) e cor
   - Opcionalmente adicione últimos 4 dígitos e bandeira
3. **Modo Completo** (com criptografia):
   - Clique em "Habilitar Cadastro Completo"
   - Preencha número completo, nome do titular e validade
   - CVV é opcional (não recomendado)
   - Bandeira e últimos 4 dígitos detectados automaticamente
4. Clique em "Adicionar"

### Adicionar Transação
1. Clique em "Nova Transação"
2. Selecione o tipo (Entrada/Saída)
3. Opcionalmente selecione um cartão
4. Escolha a prioridade (se for saída)
5. Preencha valor, categoria, descrição e data
6. Clique em "Adicionar"

### Filtrar por Período
1. Use os seletores de mês e ano no topo
2. Selecione "Todos" para ver todo o histórico
3. Os gráficos e estatísticas serão atualizados automaticamente

### Analisar Gastos
- **Gráfico de Pizza**: Mostra distribuição por categoria
- **Gráfico de Linha**: Evolução temporal
- **Gráfico de Barras**: Comparação necessário vs fútil
- **Cards de Resumo**: Visão geral do período selecionado

## 🎨 Categorias Disponíveis

### Entradas
- Salário
- Freelance
- Investimentos
- Vendas
- Bonificações
- Outros

### Saídas - Necessárias
- Aluguel/Moradia
- Alimentação
- Transporte
- Saúde
- Educação
- Contas Básicas

### Saídas - Fúteis
- Lazer
- Entretenimento
- Restaurantes
- Compras
- Assinaturas
- Viagens

### Investimentos
- Poupança
- Ações
- Fundos
- Renda Fixa
- Criptomoedas

## 📊 Métricas Calculadas

- **Saldo Total**: Entradas - Saídas
- **Taxa de Poupança**: (Entradas - Saídas) / Entradas × 100
- **Gastos Essenciais**: Soma de todas as despesas necessárias
- **Gastos Supérfluos**: Soma de todas as despesas fúteis
- **Evolução Mensal**: Comparação mês a mês

## 🔐 Segurança e Privacidade

### Armazenamento de Dados
- Dados de transações e configurações armazenados no Supabase
- Isolamento completo por usuário (Row Level Security)
- Sincronização em tempo real entre dispositivos

### Criptografia de Cartões
- **Modo Simplificado**: Armazena apenas informações básicas (nome, cor, últimos 4 dígitos)
- **Modo Completo**: Criptografia AES-GCM 256 bits no navegador
  - Dados criptografados ANTES de enviar ao servidor
  - Chave de criptografia armazenada localmente
  - Algoritmo: Web Crypto API (padrão do navegador)

### ⚠️ Importante
- Sistema adequado para uso pessoal e educacional
- Para processar pagamentos reais, use Stripe, Adyen ou similar
- Armazenar CVV pode violar normas PCI DSS
- Leia **CARDS-SECURITY.md** para detalhes completos

### Autenticação
- Login seguro via Supabase Auth
- Tokens JWT com renovação automática
- Logout em todos os dispositivos

## 🚀 Deploy em Produção

### Deploy no EasyPanel

A aplicação está pronta para deploy com Docker. Veja o guia completo em **DEPLOY-EASYPANEL.md**.

**Resumo rápido**:
```bash
# 1. Configure as variáveis de ambiente no EasyPanel
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon

# 2. Conecte seu repositório Git
# 3. EasyPanel detecta o Dockerfile automaticamente
# 4. Clique em Deploy
```

### Outros Provedores

A aplicação também pode ser deployada em:
- **Vercel**: Build automático de apps Vite
- **Netlify**: Suporte nativo para SPAs React
- **Railway**: Deploy com Dockerfile
- **Render**: Build de containers Docker
- **Fly.io**: Deploy global com Docker

### Build Local para Produção

```bash
# Build da aplicação
npm run build

# Preview do build
npm run preview

# Os arquivos estarão em /dist
```

## 🤝 Contribuindo

Sinta-se livre para fazer fork e melhorias no projeto!

## 📄 Licença

MIT License - Use livremente!

---

**Desenvolvido para melhor gestão financeira pessoal**
