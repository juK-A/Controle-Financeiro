-- Script para adicionar sistema de cartões
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tabela de cartões
CREATE TABLE IF NOT EXISTS cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'credit', 'debit', 'cash', etc
  color VARCHAR(20) DEFAULT '#8b5cf6', -- cor do card em hex
  last_digits VARCHAR(4), -- últimos 4 dígitos (opcional)
  brand VARCHAR(50), -- 'visa', 'mastercard', 'elo', etc (opcional)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas de segurança para cartões
CREATE POLICY "Users can view their own cards"
  ON cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cards"
  ON cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards"
  ON cards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards"
  ON cards FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Adicionar campo card_id na tabela transactions (se já existir)
ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS card_id UUID REFERENCES cards(id) ON DELETE SET NULL;

-- 6. Criar índice para card_id
CREATE INDEX IF NOT EXISTS idx_transactions_card_id ON transactions(card_id);

-- 7. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Trigger para atualizar updated_at em cards
DROP TRIGGER IF EXISTS update_cards_updated_at ON cards;
CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 9. Inserir cartões padrão (opcional - remova se não quiser)
-- Estes serão criados automaticamente quando o usuário fizer login
-- Comentado por padrão:
-- INSERT INTO cards (user_id, name, type, color)
-- VALUES (auth.uid(), 'Carteira', 'cash', '#10b981');
