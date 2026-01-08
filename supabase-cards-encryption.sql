-- Script para adicionar criptografia de número de cartão
-- Execute este script DEPOIS do supabase-cards-setup.sql

-- 1. Adicionar coluna para armazenar número do cartão criptografado
ALTER TABLE cards
ADD COLUMN IF NOT EXISTS card_number_encrypted TEXT;

-- 2. Adicionar coluna para CVV criptografado (opcional)
ALTER TABLE cards
ADD COLUMN IF NOT EXISTS cvv_encrypted TEXT;

-- 3. Adicionar coluna para data de validade
ALTER TABLE cards
ADD COLUMN IF NOT EXISTS expiry_month VARCHAR(2);

ALTER TABLE cards
ADD COLUMN IF NOT EXISTS expiry_year VARCHAR(4);

-- 4. Adicionar coluna para nome no cartão
ALTER TABLE cards
ADD COLUMN IF NOT EXISTS cardholder_name VARCHAR(100);

-- NOTA IMPORTANTE SOBRE SEGURANÇA:
-- Para máxima segurança, recomendamos usar Supabase Vault para criptografia.
-- No entanto, para simplicidade, vamos armazenar de forma criptografada no lado do cliente
-- antes de enviar para o banco.
--
-- Em produção, considere:
-- 1. Usar um serviço de tokenização de cartões (Stripe, Adyen, etc)
-- 2. Nunca armazenar CVV (é contra as normas PCI DSS)
-- 3. Implementar criptografia adicional no lado do servidor

-- 5. Criar view para mostrar apenas últimos 4 dígitos (segurança adicional)
CREATE OR REPLACE VIEW cards_safe AS
SELECT
  id,
  user_id,
  name,
  type,
  color,
  last_digits,
  brand,
  expiry_month,
  expiry_year,
  cardholder_name,
  created_at,
  updated_at
FROM cards;

-- 6. Garantir que apenas o owner pode ver os dados completos
-- As políticas RLS já criadas anteriormente cobrem isso

COMMENT ON COLUMN cards.card_number_encrypted IS 'Número completo do cartão criptografado (AES-256). Apenas para referência, não usar para pagamentos reais.';
COMMENT ON COLUMN cards.cvv_encrypted IS 'CVV criptografado. ATENÇÃO: Armazenar CVV pode violar PCI DSS. Use apenas para fins educacionais.';
