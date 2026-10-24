import {
  UserData,
  VirtualLoyaltyCard,
  AdminNotificationEvent,
  CustomerProfile
} from '../types';

/**
 * Calcola la 13ª cifra di controllo (Check Digit) ufficiale GS1 per un Barcode EAN-13.
 * Permette a qualsiasi app portafoglio (Stocard, Apple Wallet, Google Wallet, Catima)
 * e a qualsiasi lettore laser da banco di riconoscere istantaneamente la tessera fedeltà.
 */
export function generateGs1Ean13Barcode(customerNumericSeed: number): string {
  // Prefisso 209 = Standard GS1 per Tessere Fedeltà & Coupon Interni + 44042 (CAP di Cento)
  const base12 = `20944042${customerNumericSeed.toString().padStart(4, '0').slice(-4)}`;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(base12[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return `${base12}${checkDigit}`;
}

/**
 * Genera o arricchisce la Tessera Virtuale Fedeltà per un cliente
 */
export function buildCustomerVirtualCard(
  user: Partial<UserData & CustomerProfile>,
  index = 1
): VirtualLoyaltyCard {
  const points = user.punti_fedelta ?? user.loyaltyPoints ?? 180;
  const totalSpent = user.totale_speso ?? user.totalSpent ?? 240;
  const ean13 = generateGs1Ean13Barcode(index + 100);
  const cleanId = (user.uid || user.id || `00${index}`).replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(-6);

  const tier: VirtualLoyaltyCard['tier'] =
    totalSpent >= 800 || points >= 700
      ? 'AMBASCIATORE_CENTO'
      : totalSpent >= 350 || points >= 350
      ? 'ORO_ESTENSE'
      : totalSpent >= 120 || points >= 120
      ? 'ARGENTO'
      : 'BRONZO';

  return {
    cardId: `BA-44042-${cleanId}`,
    barcodeEan13: ean13,
    barcodeCode128: `BA44042${cleanId}`,
    qrPayloadUrl: `https://braciamiancora.it/fid/${ean13}`,
    tier,
    pointsBalance: points,
    lifetimePoints: points + 150,
    walletPassInstalled: ['STOCARD', 'GOOGLE_WALLET'],
    activeCardVouchers: [
      {
        code: `CARD-${cleanId}-10`,
        label: 'Sconto 10% Esclusivo Titolare Tessera su Carne Dry-Aged & Vini DOCG',
        discountType: 'PERCENT',
        value: 10,
        expiresAt: '2026-12-31'
      },
      ...(points >= 150
        ? [
            {
              code: `BRACE5-${cleanId}`,
              label: 'Buono Fedeltà €5,00 Immediato alla Cassa o Checkout',
              discountType: 'FIXED_EUR' as const,
              value: 5,
              expiresAt: '2026-12-31'
            }
          ]
        : [])
    ],
    purchaseFeedAlerts: [
      {
        id: `alert-${cleanId}-1`,
        date: '2026-10-24',
        relatedProductId: 'prod-fe-salamina-sugo',
        type: 'COOKING_TIP',
        message_it: 'Consiglio dello Chef Manuel per il tuo ultimo acquisto (Salamina da Sugo IGP): immergi la busta sottovuoto in acqua sobbollente per 12 minuti prima di servire sul purè.',
        message_en: 'Chef Manuel Tip for your recent purchase (Salamina da Sugo PGI): simmer the vacuum pouch in hot water for 12 minutes before serving over warm purée.'
      },
      {
        id: `alert-${cleanId}-2`,
        date: '2026-10-23',
        relatedProductId: 'prod-costata-frollata',
        type: 'LOT_TRACEABILITY',
        message_it: 'Tracciabilità Garantita: Il Lotto #LOT-2026-18-FE dei tuoi acquisti proviene da Allevamenti Certificati Alto Reno (distanza 12 km da Cento).',
        message_en: 'Guaranteed Traceability: Batch #LOT-2026-18-FE from your purchases originates from Certified Emilia Farms (12 km from Cento).'
      }
    ]
  };
}

/**
 * Notifiche Amministratore (generate da eventi reali e sincronizzate con Firebase)
 */
export const SEED_ADMIN_NOTIFICATIONS: AdminNotificationEvent[] = [];
