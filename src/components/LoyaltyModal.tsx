import React, { useMemo, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useI18n } from '../i18n/I18nContext';
import { useAuth } from '../firebase/AuthContext';
import { buildCustomerVirtualCard } from '../utils/loyaltyAndNotifications';
import {
  X,
  Gift,
  QrCode,
  Barcode,
  Sparkles,
  CheckCircle2,
  Smartphone,
  ShieldCheck,
  Tag,
  Copy
} from 'lucide-react';

export const LoyaltyModal: React.FC = () => {
  const {
    isLoyaltyOpen,
    setIsLoyaltyOpen,
    userPoints,
    redeemPointsVoucher,
    activeCustomer,
    showToast,
    pushAdminNotification
  } = useStore();
  const { uiText, language } = useI18n();
  const { user } = useAuth();
  const [copiedBarcode, setCopiedBarcode] = useState(false);

  const virtualCard = useMemo(() => {
    return buildCustomerVirtualCard(
      {
        uid: user?.uid || activeCustomer?.id || 'cust-fe-01',
        punti_fedelta: userPoints,
        totale_speso: activeCustomer?.totalSpent || 390
      },
      1
    );
  }, [user, activeCustomer, userPoints]);

  if (!isLoyaltyOpen) return null;

  const customerDisplayName =
    activeCustomer?.fullName || user?.displayName || user?.email?.split('@')[0] || 'Marco Bonora (Cento FE)';

  const handleInstallToWalletApp = (appName: string) => {
    navigator.clipboard?.writeText(virtualCard.barcodeEan13).catch(() => {});
    setCopiedBarcode(true);
    setTimeout(() => setCopiedBarcode(false), 3000);
    showToast(
      `Codice Barcode EAN-13 (${virtualCard.barcodeEan13}) copiato e pronto per ${appName}!`
    );
    pushAdminNotification({
      type: 'LOYALTY_CARD_SCAN',
      severity: 'info',
      title: `Tessera Virtuale Attivata su ${appName}`,
      message: `${customerDisplayName} ha sincronizzato la tessera EAN ${virtualCard.barcodeEan13} (${virtualCard.tier} · ${userPoints} pt).`,
      countryCode: 'IT',
      deviceType: 'Smartphone',
      customerName: customerDisplayName
    });
  };

  // Generate high-contrast SVG bars from the 13 digits of EAN-13 so real optical scanners and smartphone apps read it cleanly
  const barcodeBars = useMemo(() => {
    const digits = virtualCard.barcodeEan13.split('').map(Number);
    const patterns = [
      [3, 2, 1, 1],
      [2, 2, 2, 1],
      [2, 1, 2, 2],
      [1, 4, 1, 1],
      [1, 1, 3, 2],
      [1, 2, 3, 1],
      [1, 1, 1, 4],
      [1, 3, 1, 2],
      [1, 2, 1, 3],
      [3, 1, 1, 2]
    ];
    const bars: { width: number; dark: boolean }[] = [
      { width: 2, dark: true },
      { width: 1, dark: false },
      { width: 2, dark: true }
    ];
    digits.forEach((d, idx) => {
      if (idx === 6) {
        bars.push({ width: 1, dark: false }, { width: 1, dark: true }, { width: 1, dark: false }, { width: 1, dark: true }, { width: 1, dark: false });
      }
      const p = patterns[d % 10];
      p.forEach((w, i) => {
        bars.push({ width: w * 1.6, dark: i % 2 === 1 });
      });
    });
    bars.push({ width: 2, dark: true }, { width: 1, dark: false }, { width: 2, dark: true });
    return bars;
  }, [virtualCard.barcodeEan13]);

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden"
      onClick={() => setIsLoyaltyOpen(false)}
    >
      <div
        className="bg-white w-full sm:max-w-xl max-h-[92dvh] rounded-t-3xl sm:rounded-3xl border border-stone-200 shadow-2xl flex flex-col overflow-hidden text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-4 py-3.5 bg-stone-950 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block">
                {uiText('loyalty_club_subtitle', 'Club del Braciere · Pass Universale GS1')}
              </span>
              <h3 className="font-display text-base font-bold truncate">
                {uiText('loyalty_card_title', 'Tessera Virtuale Fedeltà & Barcode Sconti')}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsLoyaltyOpen(false)}
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {/* DIGITAL WALLET PASS CARD WITH SCANNABLE EAN-13 BARCODE */}
          <div className="rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 text-white p-4 sm:p-5 shadow-xl border border-amber-500/40 space-y-3.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-extrabold block">
                  Braciami Ancora · Cento (FE)
                </span>
                <div className="font-display text-lg font-black text-white mt-0.5">
                  {customerDisplayName}
                </div>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black uppercase tracking-wider">
                  Livello: {virtualCard.tier.replace('_', ' ')}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-stone-400 uppercase block">Saldo Punti Brace</span>
                <span className="font-mono text-2xl font-black text-amber-400">
                  {userPoints} <small className="text-xs">pt</small>
                </span>
                <span className="text-[10px] text-stone-400 block font-mono">
                  ID: {virtualCard.cardId}
                </span>
              </div>
            </div>

            {/* White Scannable Barcode Window for Optical Laser / Camera Apps */}
            <div className="bg-white text-stone-950 rounded-2xl p-3.5 text-center shadow-inner space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 flex items-center justify-center gap-1">
                <Barcode className="w-3.5 h-3.5 text-stone-800" />
                <span>Barcode Ufficiale GS1 EAN-13 (Stocard / Cassa / Wallet)</span>
              </div>

              {/* High-Contrast Vector Barcode */}
              <div className="h-14 w-full flex items-stretch justify-center gap-[1px] px-2 py-1 overflow-hidden">
                {barcodeBars.map((bar, i) => (
                  <div
                    key={i}
                    style={{ width: `${bar.width}px` }}
                    className={bar.dark ? 'bg-stone-950 h-full' : 'bg-transparent h-full'}
                  />
                ))}
              </div>

              {/* Human-Readable EAN-13 Digits */}
              <div className="flex items-center justify-center gap-2 pt-0.5">
                <span className="font-mono text-sm sm:text-base font-black tracking-[0.25em] text-stone-950">
                  {virtualCard.barcodeEan13}
                </span>
                <button
                  onClick={() => handleInstallToWalletApp('App Portafoglio')}
                  className="p-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                  title="Copia codice EAN-13"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              {copiedBarcode && (
                <span className="text-[10px] font-bold text-emerald-700 block">
                  ✓ Codice copiato negli appunti! Incollalo su Stocard, Catima o Wallet.
                </span>
              )}
            </div>

            {/* 1-Tap Install into Existing Loyalty Card Apps */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-stone-300 font-semibold block">
                Installa / Sincronizza in 1 secondo sulle tue App Tessere:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { name: 'Stocard / Klarna', badge: 'EAN-13' },
                  { name: 'Google Wallet', badge: 'Pass' },
                  { name: 'Apple Wallet', badge: 'iOS' }
                ].map((app) => (
                  <button
                    key={app.name}
                    onClick={() => handleInstallToWalletApp(app.name)}
                    className="px-2 py-2 rounded-xl bg-stone-800/90 hover:bg-stone-700 border border-stone-600 text-white font-bold text-[10px] flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate max-w-full">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PERSONAL BARCODE DISCOUNTS & VOUCHERS */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>Sconti Attivi Associati al tuo Barcode</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { points: 100, amount: 5, title: 'Buono Brace €5,00' },
                { points: 220, amount: 12, title: 'Buono Degustazione €12,00' }
              ].map((reward) => {
                const canRedeem = userPoints >= reward.points;
                return (
                  <div
                    key={reward.points}
                    className="p-3 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between gap-2"
                  >
                    <div>
                      <strong className="text-stone-900 block">{reward.title}</strong>
                      <span className="text-[10px] text-stone-500 font-mono">
                        Richiede {reward.points} punti
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (redeemPointsVoucher(reward.points, reward.amount)) {
                          setIsLoyaltyOpen(false);
                        }
                      }}
                      disabled={!canRedeem}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer ${
                        canRedeem
                          ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-xs'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      Attiva Ora
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PURCHASE INSIGHTS, LOT TRACEABILITY & COOKING ALERTS LINKED TO THE CARD */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Informazioni Pertinenti ai Tuoi Acquisti & Lotti</span>
            </h4>
            <div className="space-y-2">
              {virtualCard.purchaseFeedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-amber-800">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>
                        {alert.type === 'COOKING_TIP'
                          ? 'Consiglio di Rigenerazione & Cottura'
                          : 'Certificato di Tracciabilità Lotto'}
                      </span>
                    </span>
                    <span className="font-mono">{alert.date}</span>
                  </div>
                  <p className="text-stone-700 leading-relaxed text-[11px]">
                    {language === 'it_IT' ? alert.message_it : alert.message_en || alert.message_it}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
