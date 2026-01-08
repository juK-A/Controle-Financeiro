-- Script de Verificação do Sistema de Cartões
-- Execute no SQL Editor do Supabase para verificar se tudo está configurado corretamente

-- 1. Verificar se a tabela cards existe e suas colunas
SELECT
  column_name,
  data_type,
  is_nullable
FROM
  information_schema.columns
WHERE
  table_name = 'cards'
ORDER BY
  ordinal_position;

-- Resultado esperado:
-- id, uuid, NO
-- user_id, uuid, NO
-- name, character varying, NO
-- type, character varying, NO
-- color, character varying, YES
-- last_digits, character varying, YES
-- brand, character varying, YES
-- card_number_encrypted, text, YES
-- cvv_encrypted, text, YES
-- cardholder_name, character varying, YES
-- expiry_month, character varying, YES
-- expiry_year, character varying, YES
-- created_at, timestamp with time zone, YES
-- updated_at, timestamp with time zone, YES

-- 2. Verificar se RLS está ativo
SELECT
  tablename,
  rowsecurity
FROM
  pg_tables
WHERE
  tablename = 'cards';

-- Resultado esperado: rowsecurity = true

-- 3. Listar todas as políticas da tabela cards
SELECT
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM
  pg_policies
WHERE
  tablename = 'cards';

-- Resultado esperado: 4 políticas
-- - Users can view their own cards (SELECT)
-- - Users can insert their own cards (INSERT)
-- - Users can update their own cards (UPDATE)
-- - Users can delete their own cards (DELETE)

-- 4. Verificar índices
SELECT
  indexname,
  indexdef
FROM
  pg_indexes
WHERE
  tablename = 'cards';

-- Resultado esperado:
-- - cards_pkey (PRIMARY KEY em id)
-- - idx_cards_user_id (INDEX em user_id)

-- 5. Verificar se o campo card_id existe na tabela transactions
SELECT
  column_name,
  data_type,
  is_nullable
FROM
  information_schema.columns
WHERE
  table_name = 'transactions' AND column_name = 'card_id';

-- Resultado esperado: card_id, uuid, YES

-- 6. Verificar triggers
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM
  information_schema.triggers
WHERE
  event_object_table = 'cards';

-- Resultado esperado: update_cards_updated_at, BEFORE UPDATE

-- 7. Contar cartões por usuário (para teste)
SELECT
  user_id,
  COUNT(*) as total_cards
FROM
  cards
GROUP BY
  user_id;

-- 8. Verificar se há cartões com dados criptografados
SELECT
  COUNT(*) as cards_with_encrypted_data
FROM
  cards
WHERE
  card_number_encrypted IS NOT NULL;

-- INTERPRETAÇÃO DOS RESULTADOS:

-- Se consulta 1 retornar erro "relation does not exist":
-- → Execute supabase-cards-setup.sql

-- Se consulta 1 não mostrar colunas encrypted:
-- → Execute supabase-cards-encryption.sql

-- Se consulta 2 mostrar rowsecurity = false:
-- → Execute: ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Se consulta 3 retornar 0 linhas:
-- → Execute a parte de políticas do supabase-cards-setup.sql

-- Se tudo retornar conforme esperado:
-- → Sistema configurado corretamente! ✅

-- TESTE RÁPIDO DE PERMISSÕES:
-- Tente inserir um cartão de teste
-- (Substitua 'seu-user-id-aqui' pelo seu ID de usuário real)

-- INSERT INTO cards (user_id, name, type, color)
-- VALUES (auth.uid(), 'Teste', 'debit', '#8b5cf6');

-- Se inserir com sucesso, tente atualizar:
-- UPDATE cards SET name = 'Teste Atualizado' WHERE user_id = auth.uid() AND name = 'Teste';

-- Se atualizar com sucesso, tente deletar:
-- DELETE FROM cards WHERE user_id = auth.uid() AND name = 'Teste Atualizado';

-- Se todas as operações funcionaram:
-- → Permissões configuradas corretamente! ✅
