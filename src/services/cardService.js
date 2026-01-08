import { supabase } from '../lib/supabaseClient';
import { encryptData } from '../utils/encryption';

// Obter todos os cartões do usuário
export async function getCards() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Usuário não autenticado');

  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Criar novo cartão
export async function createCard(card) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Usuário não autenticado');

  // Criptografar dados sensíveis se existirem
  const cardNumber = card.card_number ? card.card_number.replace(/\s/g, '') : null;
  const encryptedNumber = cardNumber ? await encryptData(cardNumber) : null;
  const encryptedCVV = card.cvv ? await encryptData(card.cvv) : null;

  const { data, error } = await supabase
    .from('cards')
    .insert([{
      user_id: user.id,
      name: card.name,
      type: card.type,
      color: card.color || '#8b5cf6',
      last_digits: card.last_digits || null,
      brand: card.brand || null,
      card_number_encrypted: encryptedNumber,
      cvv_encrypted: encryptedCVV,
      cardholder_name: card.cardholder_name || null,
      expiry_month: card.expiry_month || null,
      expiry_year: card.expiry_year || null
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Atualizar cartão
export async function updateCard(id, updates) {
  // Criptografar dados sensíveis se existirem nas atualizações
  const updateData = {};

  // Copiar apenas campos válidos (não undefined e não vazios)
  const allowedFields = ['name', 'type', 'color', 'last_digits', 'brand', 'cardholder_name', 'expiry_month', 'expiry_year'];

  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      updateData[field] = updates[field];
    }
  });

  // Criptografar dados sensíveis se foram fornecidos
  if (updates.card_number) {
    const cardNumber = updates.card_number.replace(/\s/g, '');
    updateData.card_number_encrypted = await encryptData(cardNumber);
  }

  if (updates.cvv) {
    updateData.cvv_encrypted = await encryptData(updates.cvv);
  }

  // O trigger updated_at no Supabase atualiza automaticamente

  const { data, error } = await supabase
    .from('cards')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar cartão:', error);
    throw error;
  }

  return data;
}

// Deletar cartão
export async function deleteCard(id) {
  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Subscription em tempo real para cartões
export function subscribeToCards(userId, callback) {
  return supabase
    .channel('cards-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'cards',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
}

// Criar cartão padrão para novos usuários
export async function createDefaultCard() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Usuário não autenticado');

  // Verificar se já existe algum cartão
  const { data: existingCards } = await supabase
    .from('cards')
    .select('id')
    .eq('user_id', user.id)
    .limit(1);

  // Se não existir nenhum cartão, criar um padrão
  if (!existingCards || existingCards.length === 0) {
    return await createCard({
      name: 'Carteira',
      type: 'cash',
      color: '#10b981'
    });
  }

  return null;
}
