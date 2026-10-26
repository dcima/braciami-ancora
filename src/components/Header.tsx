import React, { useState, useEffect } from 'react';
import { useStore, ActivePage, AdminTab } from '../context/StoreContext';
import { useI18n } from '../i18n/I18nContext';
import { useAuth } from '../firebase/AuthContext';
import {
  ShoppingCart,
  Settings,
  Menu,
  X,
  Gift,
  Bell,
  QrCode,
  ShoppingBag,
  PackageSearch,
  CheckCheck,
  AlertTriangle,
  Info,
  CreditCard,
  Headset,
  ClipboardList,
  History,
  Radar,
  Sliders,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { LanguageSelector } from './LanguageSelector';
import { ThemeSelector } from './ThemeSelector';
import { UserAuthButton } from './UserAuthButton';
import { HeaderSlidingRow } from './HeaderSlidingRow';

const FACEBOOK_STORE_URL =
  'https://www.facebook.com/p/Braciami-Ancora-Spaccio-carnisalumi-e-formaggi-100063911893005/?locale=it_IT';

export const Header: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const {
    activePage,
    setActivePage,
    adminActiveTab,
    setAdminActiveTab,
    cartCount,
    setIsCartOpen,
    setIsLoyaltyOpen,
    userPoints,
    handleOpenAdmin,
    theme,
    adminNotifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    pushAdminNotification
  } = useStore();
  const {
    language,
    setLanguage,
    t,
    currentLanguageOption,
    uiText,
    detectedCountry,
    estimatedDistanceKm
  } = useI18n();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const isLight = theme === 'chiaro';

  // Stato Login Amministratore vs Login Cliente
  const isEffectiveAdmin = Boolean(user && isAdmin);
  const isLoggedInCustomer = Boolean(user && !isEffectiveAdmin);

  // Per l'amministratore vale solo la lingua italiana
  useEffect(() => {
    if (isEffectiveAdmin && language !== 'it_IT') {
      setLanguage('it_IT');
    }
  }, [isEffectiveAdmin, language, setLanguage]);

  // 5 Tab Amministratore (in Italiano)
  const adminNavItems: { label: string; tab: AdminTab; icon: React.ComponentType<any> }[] = [
    { label: 'Ordini Attivi', tab: 'ordini_attivi', icon: ClipboardList },
    { label: 'Storico Ordini', tab: 'storico_ordini', icon: History },
    { label: 'Catalogo', tab: 'catalogo', icon: ShoppingBag },
    { label: 'Monitoraggio', tab: 'monitoraggio', icon: Radar },
    { label: 'Configurazione', tab: 'configurazione', icon: Sliders }
  ];

  // Menù principale (Requirement b):
  // - "Prodotti" (al posto di "Banco Brace & Gastronomia")
  // - "I Miei Ordini" appare SOLO dopo il login cliente (isLoggedInCustomer)
  // - "Assistenza" (al posto di "Assistenza & Meet")
  const clientNavItems: { labelKey: string; fallback: string; page: ActivePage }[] = [
    { labelKey: 'nav_home', fallback: 'Home', page: 'home' },
    { labelKey: 'nav_catalog', fallback: 'Prodotti', page: 'catalogo' },
    ...(isLoggedInCustomer
      ? [{ labelKey: 'nav_orders', fallback: 'I Miei Ordini', page: 'ordini' as ActivePage }]
      : []),
    { labelKey: 'nav_support', fallback: 'Assistenza', page: 'assistenza' },
    { labelKey: 'nav_about', fallback: 'Chi siamo', page: 'chi-siamo' },
    { labelKey: 'nav_fairs_events', fallback: 'Fiere & Eventi', page: 'fiere-eventi' },
    { labelKey: 'nav_contact', fallback: 'Contatti', page: 'come-raggiungerci' }
  ];

  return (
    <>
      <header
        id="main_app_header"
        className={`sticky top-0 z-40 backdrop-blur-md transition-colors duration-200 border-b select-none w-full max-w-[100vw] ${
          isLight
            ? 'bg-stone-50/95 text-stone-900 border-stone-200 shadow-xs'
            : 'bg-stone-950/95 text-stone-100 border-stone-850'
        }`}
      >
        {/* =====================================================================
            RIGA 1 (Top Utility Bar):
            Telefono, Email, Fila delle Bandierine Lingua + Pulsante Località/Distanza,
            Social Media, Icona Tema 2-Stati (senza nomi)
        ===================================================================== */}
        <div
          id="header_row_1_top_bar"
          className={`w-full border-b text-[11px] transition-colors ${
            isLight
              ? 'bg-stone-100/90 border-stone-200 text-stone-700'
              : 'bg-stone-900/90 border-stone-800/80 text-stone-300'
          }`}
        >
          <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1 flex flex-wrap items-center justify-between gap-2">
            {/* Left: Telefono & Email */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <a
                href="tel:+390516831000"
                className="inline-flex items-center gap-1.5 font-semibold hover:text-amber-500 transition-colors"
                title="Chiama il negozio Braciami Ancora (+39 051 6831000)"
              >
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>+39 051 6831000</span>
              </a>

              <span className="hidden sm:inline text-stone-400 dark:text-stone-700">|</span>

              <a
                href="mailto:info@braciamiancora.it"
                className="inline-flex items-center gap-1.5 font-semibold hover:text-amber-500 transition-colors"
                title="Scrivi a info@braciamiancora.it"
              >
                <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="hidden xs:inline sm:inline">info@braciamiancora.it</span>
              </a>
            </div>

            {/* Right: Fila delle bandierine corrispondenti + Località/Distanza, Social Media, Icona Tema 2-Stati */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-nowrap lg:flex-wrap justify-end">
              {/* Fila delle bandierine lingue + Pulsante Località di provenienza e distanza dal negozio (nascosto per Admin) */}
              {!isEffectiveAdmin ? (
                <div id="language_selector_wrapper" className="shrink-0">
                  <LanguageSelector />
                </div>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  🇮🇹 IT Admin
                </span>
              )}

              {/* Social Media Icons */}
              <div className="flex items-center gap-0.5 border-l border-stone-300 dark:border-stone-800 pl-1.5 lg:px-2">
                <a
                  href={FACEBOOK_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Pagina Facebook Ufficiale: Braciami Ancora Spaccio carni, salumi e formaggi"
                  aria-label="Facebook Braciami Ancora"
                  className="p-1 rounded-md hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.instagram.com/explore/tags/braciamiancora/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram Braciami Ancora"
                  aria-label="Instagram"
                  className="p-1 rounded-md hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn Braciami Ancora"
                  aria-label="LinkedIn"
                  className="p-1 rounded-md hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Canale YouTube Braciami Ancora"
                  aria-label="YouTube"
                  className="p-1 rounded-md hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                >
                  <Youtube className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Icona Tema Scuro/Chiaro (senza nomi, solo un'icona con due stati) */}
              <ThemeSelector />
            </div>
          </div>
        </div>

        {/* =====================================================================
            RIGA 2 (Brand su 3 righe con logo a sinistra spanned + Menù + Accesso Google):
            Menù: Home, Prodotti, (I Miei Ordini solo dopo login cliente), Assistenza, Chi siamo, Fiere & Eventi, Contatti, Accesso Google
        ===================================================================== */}
        <div id="header_row_2_main_menu" className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2 sm:gap-3 py-2 min-h-16 w-full min-w-0">
            {/* Left: Titolo su tre righe con il logo a sinistra spanned */}
            <button
              id="brand_logo_home_btn"
              onClick={() => {
                setActivePage('intro');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title={uiText(
                'brand_title_landing_tip',
                'Torna alla pagina di presentazione (Landing Page) · Braciami Ancora Cento (FE)'
              )}
              className="text-left group lg:shrink-0 min-w-0 max-w-full focus:outline-none cursor-pointer"
              aria-label="Torna alla presentazione Braciami Ancora"
            >
              <BrandLogo
                variant="full"
                theme={isLight ? 'light' : 'dark'}
                titleTooltip={uiText(
                  'brand_title_landing_tip',
                  'Torna alla pagina di presentazione (Landing Page) · Braciami Ancora Cento (FE)'
                )}
              />
            </button>

            {/* Center/Right: Menù di navigazione + Accesso Google */}
            <nav
              id="main_navigation_bar"
              className={`hidden lg:flex flex-wrap flex-1 min-w-0 items-center justify-end gap-1 xl:gap-1.5 px-1 ${
                isLight ? 'text-stone-700' : 'text-stone-300'
              }`}
            >
              {isEffectiveAdmin && activePage === 'admin-crm'
                ? adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = adminActiveTab === item.tab;
                    return (
                      <button
                        key={item.tab}
                        id={`nav_admin_tab_${item.tab}`}
                        onClick={() => {
                          setActivePage('admin-crm');
                          setAdminActiveTab(item.tab);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer text-center flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide leading-tight ${
                          isActive
                            ? isLight
                              ? 'text-amber-800 bg-amber-500/15 font-extrabold border-b-2 border-amber-800'
                              : 'text-amber-400 bg-amber-500/15 font-extrabold border-b-2 border-amber-500'
                            : isLight
                            ? 'hover:text-amber-900 hover:bg-stone-200/50'
                            : 'hover:text-stone-100 hover:bg-stone-900'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })
                : clientNavItems.map((item) => {
                    const isActive = activePage === item.page;
                    const label = uiText(item.labelKey, item.fallback);
                    return (
                      <button
                        key={item.page}
                        id={`nav_link_${item.page}`}
                        onClick={() => {
                          setActivePage(item.page);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        title={label}
                        className={`py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer text-center text-[11px] font-bold uppercase tracking-wide leading-tight ${
                          isActive
                            ? isLight
                              ? 'text-amber-800 bg-amber-500/15 font-extrabold border-b-2 border-amber-800'
                              : 'text-amber-400 bg-amber-500/15 font-extrabold border-b-2 border-amber-500'
                            : isLight
                            ? 'hover:text-amber-900 hover:bg-stone-200/50'
                            : 'hover:text-stone-100 hover:bg-stone-900'
                        }`}
                      >
                        <span>{label}</span>
                      </button>
                    );
                  })}

              {/* Voce di menù: Accesso Google */}
              <div className="pl-1">
                <UserAuthButton />
              </div>
            </nav>

            {/* Right Action Icons */}
            <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 min-w-0 lg:shrink-0 z-10">
              {/* Mobile/Tablet Google Auth Button */}
              <div className="lg:hidden mr-auto">
                <UserAuthButton />
              </div>

              {/* Requirement (c): Il pulsante con QR code e punti tessera appare SOLO dopo il login cliente */}
              {isLoggedInCustomer && (
                <button
                  id="btn_nav_loyalty"
                  onClick={() => setIsLoyaltyOpen(true)}
                  className={`inline-flex items-center gap-1 px-2 py-1.5 text-[11px] font-bold rounded-xl border transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                    isLight
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-stone-900 hover:bg-stone-800 text-amber-300 border-stone-700'
                  }`}
                  title={uiText('nav_loyalty', 'Tessera Fedeltà QRCode & Punti')}
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="hidden xs:inline sm:inline">{userPoints} pt</span>
                </button>
              )}

              {/* Requirement (c): La campanella con le notifiche live per amministratore appare SOLO dopo il login amministratore */}
              {isEffectiveAdmin && (
                <div className="relative shrink-0">
                  <button
                    id="btn_admin_notifications"
                    onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                    className={`relative p-2 rounded-xl border transition-colors flex items-center justify-center cursor-pointer ${
                      notifMenuOpen
                        ? 'bg-amber-500 text-stone-950 border-amber-600'
                        : isLight
                        ? 'bg-white text-stone-700 hover:text-stone-950 border-stone-300'
                        : 'bg-stone-900 text-stone-300 hover:text-white border-stone-800'
                    }`}
                    title={uiText('nav_notifications', 'Notifiche Live Amministratore')}
                    aria-label="Notifiche Live Amministratore"
                  >
                    <Bell className="w-4 h-4 shrink-0" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center font-mono animate-pulse">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  {notifMenuOpen && (
                    <div
                      className={`fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-24 sm:top-full sm:mt-2 sm:w-96 max-h-[75dvh] rounded-2xl border shadow-2xl z-50 flex flex-col overflow-hidden ${
                        isLight
                          ? 'bg-white border-stone-200 text-stone-900'
                          : 'bg-stone-900 border-stone-700 text-stone-100'
                      }`}
                    >
                      <div className="px-3.5 py-2.5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2 bg-amber-500/10">
                        <div className="min-w-0">
                          <span className="text-xs font-extrabold block truncate">
                            Notifiche Live Amministratore
                          </span>
                          <span className="text-[10px] text-stone-500 block truncate">
                            Ordini, Collegamenti Utenti, Pagamenti &amp; Contestazioni
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={markAllNotificationsAsRead}
                            className="px-2 py-1 text-[10px] font-bold rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/30 flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCheck className="w-3 h-3" />
                            <span>Letti</span>
                          </button>
                          <button
                            onClick={() => setNotifMenuOpen(false)}
                            className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="px-3 py-1.5 border-b border-stone-200 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
                        <span className="text-stone-400 font-semibold shrink-0">Simula evento:</span>
                        <button
                          onClick={() =>
                            pushAdminNotification({
                              type: 'PAYMENT_FAILED',
                              severity: 'critical',
                              title: 'Pagamento Non Riuscito (€76,40 · Carta)',
                              message:
                                'Transazione rifiutata da banca emittente per cliente da Parigi (FR). Inviare link recupero carrello.',
                              countryCode: 'FR',
                              deviceType: 'Smartphone',
                              customerName: 'Claire Dubois',
                              amountEur: 76.4
                            })
                          }
                          className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30 font-semibold shrink-0 cursor-pointer"
                        >
                          + Pagamento Fallito
                        </button>
                        <button
                          onClick={() =>
                            pushAdminNotification({
                              type: 'ORDER_DISPUTE',
                              severity: 'warning',
                              title: 'Contestazione Peso / Spedizione #BA-8902',
                              message:
                                'Segnalazione cliente su variazione peso trancio Parmigiano 30m. Richiesta verifica scontrino bilancia.',
                              countryCode: 'IT',
                              deviceType: 'Smartphone',
                              customerName: 'Roberto Ferri'
                            })
                          }
                          className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-semibold shrink-0 cursor-pointer"
                        >
                          + Contestazione
                        </button>
                      </div>

                      <div className="overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800 max-h-80">
                        {adminNotifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationAsRead(n.id)}
                            className={`p-3 text-xs transition-colors cursor-pointer ${
                              !n.read
                                ? isLight
                                  ? 'bg-amber-50/70'
                                  : 'bg-amber-500/5'
                                : 'opacity-75'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span
                                className={`font-bold flex items-center gap-1.5 ${
                                  n.severity === 'critical'
                                    ? 'text-rose-600 dark:text-rose-400'
                                    : n.severity === 'warning'
                                    ? 'text-amber-600 dark:text-amber-400'
                                    : n.severity === 'success'
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : ''
                                }`}
                              >
                                {n.severity === 'critical' ? (
                                  <CreditCard className="w-3.5 h-3.5 shrink-0" />
                                ) : n.severity === 'warning' ? (
                                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                ) : (
                                  <Info className="w-3.5 h-3.5 shrink-0" />
                                )}
                                <span>{n.title}</span>
                              </span>
                              {!n.read && (
                                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 leading-snug">
                              {n.message}
                            </p>
                            <div className="flex items-center justify-between mt-1.5 text-[10px] text-stone-400 font-mono">
                              <span>
                                {n.countryCode || 'IT'} · {n.deviceType || 'Mobile'}
                              </span>
                              <span>
                                {new Date(n.timestamp).toLocaleTimeString('it-IT', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cart Button (shown for customers/visitors) */}
              {!isEffectiveAdmin && (
                <button
                  id="btn_nav_cart"
                  onClick={() => setIsCartOpen(true)}
                  className={`relative p-2 rounded-xl font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center cursor-pointer shrink-0 ${
                    isLight
                      ? 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                      : 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                  }`}
                  aria-label={currentLanguageOption.cartLabel}
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-stone-950 shrink-0" />
                  {cartCount > 0 && (
                    <span
                      id="cart_badge_count"
                      className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 bg-rose-700 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md border border-stone-950 font-mono"
                    >
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* Mobile Hamburger */}
              <button
                id="btn_mobile_menu_toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-1.5 rounded-lg cursor-pointer ${
                  isLight ? 'text-stone-700 hover:text-stone-950' : 'text-stone-300 hover:text-white'
                }`}
                aria-label="Menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile_navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile_navigation"
            className={`lg:hidden border-t px-4 pt-3 pb-5 space-y-3 max-h-[calc(100dvh-15rem)] overflow-y-auto ${
              isLight ? 'border-stone-200 bg-stone-50' : 'border-stone-850 bg-stone-950'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <UserAuthButton />
                <span className="text-xs text-stone-500">
                  {detectedCountry} · {estimatedDistanceKm} km
                </span>
              </div>
              <ThemeSelector />
            </div>

            {isEffectiveAdmin && activePage === 'admin-crm' ? (
              <div className="grid grid-cols-2 gap-1.5">
                {adminNavItems.map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => {
                      setActivePage('admin-crm');
                      setAdminActiveTab(item.tab);
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      adminActiveTab === item.tab
                        ? 'bg-amber-500 text-stone-950'
                        : isLight
                        ? 'bg-white text-stone-800 border border-stone-200'
                        : 'bg-stone-900 text-stone-300 border border-stone-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5">
                {clientNavItems.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => {
                      setActivePage(item.page);
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      activePage === item.page
                        ? 'bg-amber-500 text-stone-950'
                        : isLight
                        ? 'bg-white text-stone-800 border border-stone-200'
                        : 'bg-stone-900 text-stone-300 border border-stone-800'
                    }`}
                  >
                    {uiText(item.labelKey, item.fallback)}
                  </button>
                ))}
              </div>
            )}

            <div
              className={`pt-2 border-t flex flex-wrap gap-2 items-center justify-between ${
                isLight ? 'border-stone-200' : 'border-stone-850'
              }`}
            >
              {isLoggedInCustomer ? (
                <button
                  onClick={() => {
                    setIsLoyaltyOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    isLight ? 'text-amber-800' : 'text-amber-300'
                  }`}
                >
                  <Gift className="w-4 h-4" />
                  <span>
                    {userPoints} pt · {uiText('btn_virtual_card', 'Tessera QR & Punti')}
                  </span>
                </button>
              ) : (
                <span className="text-[11px] text-stone-400">
                  {isEffectiveAdmin ? 'Modalità Amministratore' : 'Accedi come cliente per Punti & Ordini'}
                </span>
              )}

              {isEffectiveAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenAdmin();
                }}
                className={`px-3 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                  isLight ? 'text-stone-700' : 'text-stone-300'
                }`}
              >
                <Settings className="w-4 h-4 text-amber-500" />
                <span>{uiText('nav_admin', t('nav_admin'))}</span>
              </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* =====================================================================
          RIGA 3 (Sliding Dinamico NON fisso: scorre verso l'alto con il resto della pagina)
      ===================================================================== */}
      {activePage !== 'intro' && <HeaderSlidingRow />}

      {/* Fixed Bottom Mobile Navigation Bar */}
      <nav
        aria-label="Navigazione Mobile Rapida"
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-md px-1.5 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] flex items-center justify-around gap-1 select-none ${
          isLight
            ? 'bg-white/95 border-stone-200 text-stone-700 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]'
            : 'bg-stone-950/95 border-stone-800 text-stone-300 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]'
        }`}
      >
        {isEffectiveAdmin && activePage === 'admin-crm' ? (
          adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.tab}
                onClick={() => {
                  setActivePage('admin-crm');
                  setAdminActiveTab(item.tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-xl text-[9px] leading-tight text-center font-bold cursor-pointer ${
                  adminActiveTab === item.tab ? 'text-amber-500' : 'opacity-75'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })
        ) : (
          <>
            <button
              onClick={() => {
                setActivePage('catalogo');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[9px] sm:text-[10px] leading-tight text-center font-bold cursor-pointer ${
                activePage === 'catalogo' || activePage === 'home' ? 'text-amber-500' : 'opacity-75'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>{uiText('nav_catalog', 'Prodotti')}</span>
            </button>

            <button
              onClick={() => {
                setActivePage('fiere-eventi');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[9px] sm:text-[10px] leading-tight text-center font-bold cursor-pointer ${
                activePage === 'fiere-eventi' ? 'text-amber-500' : 'opacity-75'
              }`}
            >
              <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>{uiText('nav_fairs_short', 'Fiere & FB')}</span>
            </button>

            {/* "I Miei Ordini" appare SOLO dopo il login cliente */}
            {isLoggedInCustomer && (
              <button
                onClick={() => {
                  setActivePage('ordini');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[9px] sm:text-[10px] leading-tight text-center font-bold cursor-pointer ${
                  activePage === 'ordini' ? 'text-amber-500' : 'opacity-75'
                }`}
              >
                <PackageSearch className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>{uiText('nav_orders', 'I Miei Ordini')}</span>
              </button>
            )}

            <button
              onClick={() => {
                setActivePage('assistenza');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[9px] sm:text-[10px] leading-tight text-center font-bold cursor-pointer ${
                activePage === 'assistenza' ? 'text-amber-500' : 'opacity-75'
              }`}
            >
              <Headset className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>{uiText('nav_support', 'Assistenza')}</span>
            </button>

            {/* Pulsante QR code e punti tessera appare SOLO dopo il login cliente */}
            {isLoggedInCustomer && (
              <button
                onClick={() => setIsLoyaltyOpen(true)}
                className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[9px] sm:text-[10px] leading-tight text-center font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>{uiText('btn_virtual_card_short', 'Tessera')}</span>
              </button>
            )}
          </>
        )}
      </nav>
    </>
  );
};
