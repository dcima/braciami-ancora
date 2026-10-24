/**
 * Utility per il calcolo e validazione ufficiale del Codice Fiscale italiano
 * Secondo il D.M. 23/12/1976 del Ministero delle Finanze.
 */

const MESI_CODICE: Record<number, string> = {
  1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'H',
  7: 'L', 8: 'M', 9: 'P', 10: 'R', 11: 'S', 12: 'T'
};

const TABELLA_PARI: Record<string, number> = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
  'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18,
  'T': 19, 'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25
};

const TABELLA_DISPARI: Record<string, number> = {
  '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
  'A': 1, 'B': 0, 'C': 5, 'D': 7, 'E': 9, 'F': 13, 'G': 15, 'H': 17, 'I': 19, 'J': 21,
  'K': 2, 'L': 4, 'M': 18, 'N': 20, 'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14,
  'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23
};

const TABELLA_RESTO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function normalizzaTesto(testo: string): string {
  return (testo || '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z]/g, '');
}

function estraiConsonantiEVocali(str: string): { consonanti: string[]; vocali: string[] } {
  const norm = normalizzaTesto(str);
  const vocaliSet = new Set(['A', 'E', 'I', 'O', 'U']);
  const consonanti: string[] = [];
  const vocali: string[] = [];

  for (const ch of norm) {
    if (vocaliSet.has(ch)) {
      vocali.push(ch);
    } else {
      consonanti.push(ch);
    }
  }

  return { consonanti, vocali };
}

export function calcolaCodiceCognome(cognome: string): string {
  const { consonanti, vocali } = estraiConsonantiEVocali(cognome);
  const unite = [...consonanti, ...vocali, 'X', 'X', 'X'];
  return unite.slice(0, 3).join('');
}

export function calcolaCodiceNome(nome: string): string {
  const { consonanti, vocali } = estraiConsonantiEVocali(nome);
  if (consonanti.length >= 4) {
    // Si prendono la 1ª, la 3ª e la 4ª consonante
    return consonanti[0] + consonanti[2] + consonanti[3];
  }
  const unite = [...consonanti, ...vocali, 'X', 'X', 'X'];
  return unite.slice(0, 3).join('');
}

export function calcolaCarattereControllo(primi15: string): string {
  const chars = primi15.toUpperCase();
  let somma = 0;
  for (let i = 0; i < 15; i++) {
    const ch = chars[i];
    // Posizione 1-based: i=0 è dispari (1ª posizione)
    if ((i + 1) % 2 !== 0) {
      somma += TABELLA_DISPARI[ch] ?? 0;
    } else {
      somma += TABELLA_PARI[ch] ?? 0;
    }
  }
  return TABELLA_RESTO[somma % 26];
}

export interface DatiCalcoloCodiceFiscale {
  nome: string;
  cognome: string;
  sesso: 'M' | 'F';
  dataNascita: string; // YYYY-MM-DD
  codiceCatastale: string; // es. D969 per Genova, C469 per Cento
}

/**
 * Calcola il codice fiscale completo a 16 caratteri
 */
export function calcolaCodiceFiscale(dati: DatiCalcoloCodiceFiscale): string | null {
  const { nome, cognome, sesso, dataNascita, codiceCatastale } = dati;

  if (!nome || !cognome || !sesso || !dataNascita || !codiceCatastale) {
    return null;
  }

  const codCognome = calcolaCodiceCognome(cognome);
  const codNome = calcolaCodiceNome(nome);

  const parts = dataNascita.split('-');
  if (parts.length < 3) return null;
  const anno = parseInt(parts[0], 10);
  const mese = parseInt(parts[1], 10);
  const giorno = parseInt(parts[2], 10);

  if (isNaN(anno) || isNaN(mese) || isNaN(giorno)) return null;

  const annoStr = String(anno).slice(-2).padStart(2, '0');
  const meseChar = MESI_CODICE[mese];
  if (!meseChar) return null;

  const giornoNum = sesso === 'F' ? giorno + 40 : giorno;
  const giornoStr = String(giornoNum).padStart(2, '0');

  const codComune = codiceCatastale.trim().toUpperCase();
  if (codComune.length !== 4) return null;

  const primi15 = `${codCognome}${codNome}${annoStr}${meseChar}${giornoStr}${codComune}`;
  const cin = calcolaCarattereControllo(primi15);

  return `${primi15}${cin}`;
}

/**
 * Valida un codice fiscale inserito rispetto ai dati anagrafici
 */
export function validaCodiceFiscale(
  cfInserito: string,
  dati: DatiCalcoloCodiceFiscale
): { valido: boolean; cfCalcolato?: string; errore?: string } {
  const pulito = (cfInserito || '').trim().toUpperCase();

  if (pulito.length !== 16) {
    return {
      valido: false,
      errore: 'Il codice fiscale deve essere esattamente di 16 caratteri alfanumerici.'
    };
  }

  const cfAtteso = calcolaCodiceFiscale(dati);
  if (!cfAtteso) {
    return {
      valido: false,
      errore: 'Dati anagrafici incompleti per il calcolo e la verifica del codice fiscale.'
    };
  }

  if (pulito !== cfAtteso) {
    return {
      valido: false,
      cfCalcolato: cfAtteso,
      errore: `Il codice fiscale inserito (${pulito}) non corrisponde ai dati anagrafici inseriti. Il codice fiscale calcolato è: ${cfAtteso}`
    };
  }

  return { valido: true, cfCalcolato: cfAtteso };
}
