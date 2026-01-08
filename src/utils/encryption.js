// Utilitário de criptografia usando Web Crypto API (AES-GCM)
// IMPORTANTE: Esta é uma implementação educacional. Em produção, use serviços
// especializados como Stripe, Adyen ou PCI DSS compliant tokenization services.

const ENCRYPTION_KEY_STORAGE = 'card_encryption_key';

// Gerar ou recuperar chave de criptografia
async function getEncryptionKey() {
  // Tentar recuperar chave do localStorage
  const storedKey = localStorage.getItem(ENCRYPTION_KEY_STORAGE);

  if (storedKey) {
    // Importar chave existente
    const keyData = JSON.parse(storedKey);
    return await crypto.subtle.importKey(
      'jwk',
      keyData,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Gerar nova chave
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  // Exportar e salvar chave
  const exportedKey = await crypto.subtle.exportKey('jwk', key);
  localStorage.setItem(ENCRYPTION_KEY_STORAGE, JSON.stringify(exportedKey));

  return key;
}

// Criptografar texto
export async function encryptData(plaintext) {
  if (!plaintext) return null;

  try {
    const key = await getEncryptionKey();

    // Gerar IV (Initialization Vector) aleatório
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Converter texto para bytes
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    // Criptografar
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    // Combinar IV + dados criptografados
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Converter para base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Erro ao criptografar:', error);
    return null;
  }
}

// Descriptografar texto
export async function decryptData(encryptedData) {
  if (!encryptedData) return null;

  try {
    const key = await getEncryptionKey();

    // Converter de base64 para bytes
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

    // Separar IV e dados criptografados
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    // Descriptografar
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );

    // Converter bytes para texto
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Erro ao descriptografar:', error);
    return null;
  }
}

// Validar número de cartão usando algoritmo de Luhn
export function validateCardNumber(cardNumber) {
  // Remover espaços e traços
  const number = cardNumber.replace(/[\s-]/g, '');

  // Verificar se é apenas números
  if (!/^\d+$/.test(number)) return false;

  // Verificar tamanho (13-19 dígitos)
  if (number.length < 13 || number.length > 19) return false;

  // Algoritmo de Luhn
  let sum = 0;
  let isEven = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// Detectar bandeira do cartão
export function detectCardBrand(cardNumber) {
  const number = cardNumber.replace(/[\s-]/g, '');

  // Visa: começa com 4
  if (/^4/.test(number)) return 'visa';

  // Mastercard: começa com 51-55 ou 2221-2720
  if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) return 'mastercard';

  // Amex: começa com 34 ou 37
  if (/^3[47]/.test(number)) return 'amex';

  // Elo: começa com 636368, 438935, 504175, 451416, 636297, 5067, 4576, 4011
  if (/^(636368|438935|504175|451416|636297|5067|4576|4011)/.test(number)) return 'elo';

  // Hipercard: começa com 606282
  if (/^606282/.test(number)) return 'hipercard';

  return 'other';
}

// Formatar número de cartão (adiciona espaços)
export function formatCardNumber(value) {
  const number = value.replace(/\s/g, '');
  const matches = number.match(/\d{1,4}/g);
  return matches ? matches.join(' ') : '';
}

// Obter últimos 4 dígitos
export function getLastFourDigits(cardNumber) {
  const number = cardNumber.replace(/[\s-]/g, '');
  return number.slice(-4);
}

// Mascarar número do cartão (mostrar apenas últimos 4 dígitos)
export function maskCardNumber(cardNumber) {
  const number = cardNumber.replace(/[\s-]/g, '');
  const lastFour = number.slice(-4);
  const masked = '•'.repeat(number.length - 4) + lastFour;
  return formatCardNumber(masked);
}

// AVISO DE SEGURANÇA
console.warn(
  '⚠️ AVISO DE SEGURANÇA: Este sistema de criptografia é apenas para fins educacionais.\n' +
  'Para ambientes de produção que lidam com dados reais de cartões de crédito,\n' +
  'use serviços certificados PCI DSS como Stripe, Adyen ou similares.\n' +
  'Nunca armazene CVV em nenhuma circunstância.'
);
