
const BANNED_WORDS = [
  'buceta', 'caralho', 'porra', 'puta', 'vadi', 'pinto', 'rola', 'cu', 'foder', 'fodas',
  'merda', 'bosta', 'cacete', 'piroca', 'xereca', 'canalha', 'viado'
];

const LEET_MAP: Record<string, string> = {
  '4': 'a', '3': 'e', '1': 'i', '0': 'o', '5': 's', '7': 't', '@': 'a', '$': 's', '8': 'b'
};

/**
 * Normaliza uma string removendo acentos e convertendo leetspeak para letras normais.
 */
export const normalizeText = (text: string): string => {
  let normalized = text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remove acentos

  // Converte leetspeak (ex: bvc374 -> buceta)
  let translated = "";
  for (let char of normalized) {
    translated += LEET_MAP[char] || char;
  }

  return translated.replace(/[^a-z]/g, ""); // Deixa apenas letras
};

/**
 * Verifica se o nome contém palavras ofensivas.
 */
export const isProfane = (name: string): boolean => {
  const normalizedName = normalizeText(name);
  return BANNED_WORDS.some(word => normalizedName.includes(word));
};

/**
 * Normaliza nomes de escolas para comparação (evitar duplicatas).
 */
export const normalizeSchoolName = (name: string): string => {
  return name.trim().toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
};
