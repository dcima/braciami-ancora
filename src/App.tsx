/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider } from './firebase/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { I18nProvider, useI18n } from './i18n/I18nContext';
import { IntroLanding } from './components/IntroLanding';
import { Header } from './components/Header';
import { PromoBanner } from './components/PromoBanner';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LoyaltyModal } from './components/LoyaltyModal';
import { PromoModal } from './components/PromoModal';
import { AdminManager } from './components/AdminManager';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { OrdersTracker } from './components/OrdersTracker';
import { PrivacyPage } from './components/PrivacyPage';
import { GrillGuidePage } from './components/GrillGuidePage';
import { CustomerSupportPage } from './components/CustomerSupportPage';
import { FiereEventiPage } from './components/FiereEventiPage';
import { Footer } from './components/Footer';
import { CheckCircle2, Flame, Award, HeartHandshake, ShieldCheck } from 'lucide-react';

import { useAuth } from './firebase/AuthContext';

const MainLayout: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const {
    activePage,
    toastMessage,
    setActivePage,
    setAdminActiveTab,
    setIsPromoModalOpen,
    setIsLoyaltyOpen,
    recordAccessoAdmin,
    showToast,
    theme
  } = useStore();
  const { dir, t, uiText, language, setLanguage } = useI18n();

  const isLight = theme === 'chiaro';
  const prevUserAccessRef = React.useRef<string | null>(null);

  // Route automatically on login:
  // - Admin -> Dashboard 'admin-crm' (Tab principale: Ordini Attivi) + Lingua IT obbligatoria
  // - Cliente registrato -> Esce da intro e mostra direttamente il Catalogo (senza il blocco Hero in allegato)
  React.useEffect(() => {
    const currentUid = user ? `${user.uid}:${isAdmin ? 'admin' : 'customer'}` : null;
    if (currentUid && currentUid !== prevUserAccessRef.current) {
      prevUserAccessRef.current = currentUid;
      if (isAdmin) {
        setAdminActiveTab('ordini_attivi');
        setActivePage('admin-crm');
        if (language !== 'it_IT') {
          setLanguage('it_IT');
        }
        if (user?.email) {
          recordAccessoAdmin(user.email).catch((err) => console.warn('Errore salvataggio accessoAdmin:', err));
        }
        showToast('Accesso Amministratore verificato: apertura Ordini Attivi (Lingua Italiana).');
      } else {
        setActivePage('catalogo');
        showToast(`Benvenuto ${user?.displayName || ''}! Catalogo pronto per il tuo ordine.`);
      }
    } else if (!currentUid) {
      prevUserAccessRef.current = null;
    }
  }, [user, isAdmin, language, setLanguage, setAdminActiveTab, setActivePage, showToast]);

  React.useEffect(() => {
    if (activePage === 'admin-crm' && (!user || !isAdmin)) {
      setActivePage(user ? 'catalogo' : 'intro');
    }
  }, [activePage, user, isAdmin, setActivePage]);

  if (activePage === 'intro') {
    return (
      <div dir={dir}>
        <IntroLanding />
        <CartDrawer />
        <CheckoutModal />
        <LoyaltyModal />
        {toastMessage && (
          <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
            <div className="bg-stone-900 text-stone-100 border border-stone-700 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium">{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      dir={dir}
      className={`min-h-[100dvh] w-full max-w-[100vw] overflow-x-clip pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0 flex flex-col transition-colors duration-200 ${
        isLight
          ? 'bg-[#FAF8F5] text-stone-900 selection:bg-amber-400 selection:text-stone-950 font-sans'
          : 'bg-stone-50 text-stone-900 selection:bg-amber-500 selection:text-stone-950'
      }`}
    >
      {/* 1 Slim dismissible top promo banner */}
      <PromoBanner />

      {/* Top Bar 3-Zone Contract Header with Language & Theme Selectors */}
      <Header />

      {/* Page Content View Router */}
      <main className="flex-1">
        {activePage === 'home' && (
          <>
            {/* Il blocco Hero e la barra sottostante spariscono completamente dopo il login cliente */}
            {!user && (
              <>
                <Hero />

                {/* Quick Value Bar */}
                <section
                  className={`py-4 sm:py-6 border-b transition-colors duration-200 ${
                    isLight
                      ? 'bg-white text-stone-700 border-stone-200'
                      : 'bg-stone-900 text-stone-300 border-stone-800'
                  }`}
                >
                  <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <strong className={`truncate block font-bold text-[11px] sm:text-xs ${isLight ? 'text-stone-900' : 'text-stone-100'}`}>
                          {uiText('val_oak_grill_title', 'Vera Brace di Rovere')}
                        </strong>
                        <span className="text-[10px] sm:text-[11px] text-stone-500 block truncate">
                          {uiText('val_oak_grill_sub', 'Cottura espressa quotidiana')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <strong className={`truncate block font-bold text-[11px] sm:text-xs ${isLight ? 'text-stone-900' : 'text-stone-100'}`}>
                          {uiText('store_motto', t('store_motto'))}
                        </strong>
                        <span className="text-[10px] sm:text-[11px] text-stone-500 block truncate">
                          {uiText('val_direct_sub', 'Filiera Cento & Export UE')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <strong className={`truncate block font-bold text-[11px] sm:text-xs ${isLight ? 'text-stone-900' : 'text-stone-100'}`}>
                          {uiText('val_otp_title', 'Tessera Barcode & OTP')}
                        </strong>
                        <span className="text-[10px] sm:text-[11px] text-stone-500 block truncate">
                          {uiText('val_otp_sub', 'Compatibile Stocard & Wallet')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <strong className={`truncate block font-bold text-[11px] sm:text-xs ${isLight ? 'text-stone-900' : 'text-stone-100'}`}>
                          {uiText('val_pickup_title', 'Ritiro Cento o Spedizione UE')}
                        </strong>
                        <span className="text-[10px] sm:text-[11px] text-stone-500 block truncate">
                          {uiText('val_pickup_sub', 'Catena del freddo garantita')}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* Product Catalog */}
            <ProductCatalog />

            {/* Cento Community & Customer Loyalty Teaser */}
            <section
              className={`py-8 sm:py-14 border-b transition-colors duration-200 ${
                isLight ? 'bg-[#F5F2EB] border-stone-200' : 'bg-stone-100 border-stone-200'
              }`}
            >
              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-8 space-y-3">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest block">
                      {uiText('club_teaser_badge', 'Club del Braciere Centese · Tessera Virtuale GS1')}
                    </span>
                    <h2 className="font-display text-fluid-title font-bold text-stone-950">
                      {uiText('club_teaser_title', 'Tessera Fedeltà Barcode per Stocard, Apple & Google Wallet.')}
                    </h2>
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
                      {uiText(
                        'club_teaser_desc',
                        'Ogni acquisto genera Punti Brace, sblocca sconti immediati legati al tuo Barcode EAN-13 personale e ti invia informazioni sui lotti acquistati e ricette dedicate.'
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      <button
                        onClick={() => setIsLoyaltyOpen(true)}
                        className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        {uiText('btn_open_virtual_card', 'Apri Tessera Virtuale Barcode')}
                      </button>
                      <button
                        onClick={() => setIsPromoModalOpen(true)}
                        className="px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        {uiText('btn_view_active_promos', 'Vedi Codici Sconto Attivi')}
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-4 bg-stone-50 rounded-2xl p-5 border border-stone-200 text-center space-y-2.5">
                    <span className="text-[11px] uppercase font-bold text-stone-500">
                      {uiText('shop_location_badge', 'Bottega Storica a Cento')}
                    </span>
                    <div className="font-display text-xl sm:text-2xl font-bold text-stone-900">
                      Via Penzale, 25
                    </div>
                    <p className="text-xs text-stone-600">
                      {uiText('shop_location_sub', 'Vieni a trovarci a Cento (FE) o ordina con spedizione in tutta Europa.')}
                    </p>
                    <button
                      onClick={() => setActivePage('come-raggiungerci')}
                      className="w-full py-2 bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      {uiText('nav_contact', t('nav_contact'))}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activePage === 'catalogo' && (
          <div className="pt-2">
            <ProductCatalog />
          </div>
        )}

        {activePage === 'chi-siamo' && <AboutPage />}

        {activePage === 'fiere-eventi' && <FiereEventiPage />}

        {activePage === 'come-raggiungerci' && <ContactPage />}

        {activePage === 'ordini' && <OrdersTracker />}

        {activePage === 'assistenza' && <CustomerSupportPage />}

        {activePage === 'privacy' && <PrivacyPage />}

        {activePage === 'guida-brace' && <GrillGuidePage />}

        {activePage === 'admin-crm' && user && isAdmin && <AdminManager />}
      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <LoyaltyModal />
      <PromoModal />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-stone-900 text-stone-100 border border-stone-700 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <StoreProvider>
          <MainLayout />
        </StoreProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
