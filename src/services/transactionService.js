import { supabase } from '../lib/supabaseClient'

// CREATE - Criar nova transação
export const createTransaction = async (transactionData) => {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('transactions')
    .insert([
      {
        ...transactionData,
        user_id: user.id,
        amount: parseFloat(transactionData.amount)
      }
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

// READ - Buscar todas as transações do usuário
export const getTransactions = async () => {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (error) throw error
  return data || []
}

// UPDATE - Atualizar transação
export const updateTransaction = async (id, updates) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// DELETE - Deletar transação
export const deleteTransaction = async (id) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

// REALTIME - Subscrever mudanças em tempo real
export const subscribeToTransactions = (userId, callback) => {
  return supabase
    .channel('transactions-changes')
    .on(
      'postgres_changes',
      {
        event: '*', // INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'transactions',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
}
