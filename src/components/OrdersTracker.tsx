import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import {
  Search,
  Package,
  Clock,
  Flame,
  CheckCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  KeyRound,
  RotateCcw,
  User,
  CreditCard,
  MapPin,
  CheckCircle2,
  Copy,
  LogOut,
  AlertCircle,
  Video
} from 'lucide-react';
import { SqlCustomer, OtpRequestResult } from '../db/sqlite';
import { useAuth } from '../firebase/AuthContext';

export const OrdersTracker: React.FC = () => {
  const {
    addToCart,
    setIsCartOpen,
    setActivePage,
    showToast,
    requestCustomerOtp,
    verifyCustomerOtp,
    fetchCustomerOrders
  } = useStore();

  // Authentication & OTP State
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'input_phone' | 'input_otp' | 'authenticated'>('input_phone');
  const [activeCustomer, setActiveCustomer] = useState<SqlCustomer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [simulatedSmsBanner, setSimulatedSmsBanner] = useState<OtpRequestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tutti' | 'in_corso' | 'completati'>('tutti');
  const { user, profile, signInWithGoogle } = useAuth();

  // Handle direct sign in via Firebase Google Auth
  const handleContinueWithGoogle = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      if (!user) {
        await signInWithGoogle();
      }
      const currentUser = user;
      const targetIdentifier = currentUser?.email || currentUser?.uid || 'google_user';

      setActiveCustomer({
        id: currentUser?.uid || 'GOOG-USER',
        first_name: currentUser?.displayName?.split(' ')[0] || 'Cliente',
        last_name: currentUser?.displayName?.split(' ').slice(1).join(' ') || 'Google',
        full_name: currentUser?.displayName || 'Cliente Google',
        email: currentUser?.email || '',
        phone: currentUser?.phoneNumber || '+39 347 0000000',
        address: 'Via Penzale, 25',
        city: 'Cento',
        cap: '44042',
        province: 'FE',
        is_registered: true,
        payment_method: 'carta_credito',
        payment_details: '{"type":"Account Google Firebase"}',
        registered_date: profile?.createdAt?.split('T')[0] || '2026-03-01',
        total_spent: 120,
        order_count: 2,
        last_order_date: '2026-03-18',
        loyalty_points: profile?.loyaltyPoints || 100,
        segment: 'Nuovo Cliente',
        notes: 'Autenticato con Firebase Auth'
      });

      const orders = await fetchCustomerOrders(targetIdentifier);
      setCustomerOrders(orders);
      setStep('authenticated');
      showToast('Autenticato con Firebase Google Auth!');
    } catch {
      setErrorMsg('Accesso Google annullato o non riuscito.');
    } finally {
      setLoading(false);
    }
  };

  // Handle requesting OTP
  const handleRequestOtp = async (inputTarget?: string) => {
    const target = (inputTarget || phoneOrEmail).trim();
    if (!target) {
      setErrorMsg('Inserisci un numero di cellulare o la tua email.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await requestCustomerOtp(target);
      setSimulatedSmsBanner(res);
      setStep('input_otp');
      setPhoneOrEmail(target);
      showToast(`Codice OTP inviato a ${target}`);
    } catch {
      setErrorMsg('Errore durante la generazione dell\'OTP. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  // Handle verifying OTP
  const handleVerifyOtp = async () => {
    if (!otpCode.trim()) {
      setErrorMsg('Inserisci il codice a 6 cifre ricevuto.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await verifyCustomerOtp(phoneOrEmail, otpCode.trim());
      if (res.success) {
        if (res.customer) {
          setActiveCustomer(res.customer);
        } else {
          setActiveCustomer({
            id: 'GUEST-CELL',
            first_name: 'Cliente',
            last_name: 'Bottega',
            full_name: 'Cliente Bottega Cento',
            email: phoneOrEmail.includes('@') ? phoneOrEmail : '',
            phone: phoneOrEmail.includes('@') ? '+39 347 1234567' : phoneOrEmail,
            address: 'Via Penzale, 25',
            city: 'Cento',
            cap: '44042',
            province: 'FE',
            is_registered: false,
            payment_method: 'contanti_ritiro',
            payment_details: '{"type":"Contanti al Ritiro in Bottega"}',
            registered_date: '2026-03-01',
            total_spent: 65,
            order_count: 1,
            last_order_date: '2026-03-15',
            loyalty_points: 20,
            segment: 'Nuovo Cliente',
            notes: 'Cliente con verifica OTP'
          });
        }

        // Fetch customer's orders from SQLite
        const orders = await fetchCustomerOrders(phoneOrEmail);
        setCustomerOrders(orders);
        setStep('authenticated');
        showToast('Identità verificata con successo!');
      } else {
        setErrorMsg(res.error || 'Codice OTP non valido. Controlla e riprova.');
      }
    } catch {
      setErrorMsg('Errore nella verifica dell\'OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setStep('input_phone');
    setActiveCustomer(null);
    setCustomerOrders([]);
    setOtpCode('');
    setSimulatedSmsBanner(null);
    showToast('Sessione ordini terminata.');
  };

  const getTimelineSteps = (status: OrderStatus) => {
    const steps = [
      { key: 'ricevuto', label: '1. Ricevuto in Bottega', icon: <Package className="w-4 h-4" /> },
      { key: 'in_griglia', label: '2. Sulla Brace di Rovere', icon: <Flame className="w-4 h-4 text-amber-500 animate-pulse" /> },
      { key: 'pronto', label: '3. Pronto al Ritiro / Consegna', icon: <Clock className="w-4 h-4" /> },
      { key: 'completato', label: '4. Consegnato & Gustato', icon: <CheckCircle className="w-4 h-4" /> }
    ];

    const currentIdx =
      status === 'ricevuto'
        ? 0
        : status === 'in_griglia'
        ? 1
        : status === 'pronto' || status === 'in_consegna'
        ? 2
        : 3;

    return { steps, currentIdx };
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity, item.specialInstructions);
    });
    showToast(`Prodotti dell'ordine #${order.id} aggiunti al carrello!`);
    setIsCartOpen(true);
  };

  const filteredOrders = customerOrders.filter((o) => {
    if (activeTab === 'in_corso') return o.status !== 'completato' && o.status !== 'annullato';
    if (activeTab === 'completati') return o.status === 'completato';
    return true;
  });

  return (
    <div className="py-12 bg-stone-50 text-stone-900 min-h-[75vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Area Riservata Protetta da OTP</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-950 tracking-tight">
            I Miei Ordini & Tracciamento Brace
          </h1>
          <p className="text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Segui in tempo reale la cottura sulla brace di legna dei tuoi tagli frollati e dei piatti caldi di Samanta.
            L&apos;accesso è protetto e riservato: basta inserire il tuo recapito cellulare o email per ricevere un codice OTP immediato.
          </p>
        </div>

        {/* STEP 1: PHONE OR EMAIL INPUT */}
        {step === 'input_phone' && (
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-5">
            {/* Explanatory Help Card */}
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-xl space-y-1.5 text-xs text-stone-700">
              <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>Come funziona il tracciamento:</span>
              </span>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                1. Inserisci il cellulare o tocca un cliente Cento d&apos;esempio in basso.<br />
                2. Ricevi il codice OTP di 6 cifre con notifica SMS istantanea.<br />
                3. Entri nella tua bacheca per vedere lo stato della brace e lo storico scontrini.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-700 rounded-xl">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-stone-950 text-base">Identificazione Cliente</h3>
                <p className="text-xs text-stone-500">Inserisci il cellulare per ricevere l&apos;OTP</p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Firebase Google Auth quick sign in */}
            <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <div className="truncate">
                  <span className="text-xs font-bold text-stone-900 block truncate">
                    {user ? `Accesso rapido come ${user.displayName?.split(' ')[0]}` : 'Accesso istantaneo con Google'}
                  </span>
                  <span className="text-[10px] text-stone-500 block truncate">
                    {user ? user.email : 'Sincronizza ordini con database Firebase'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleContinueWithGoogle}
                disabled={loading}
                className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-lg shrink-0 cursor-pointer shadow-xs transition-colors"
              >
                {user ? 'Entra' : 'Accedi'}
              </button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-stone-200"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider text-stone-400 font-bold">oppure con codice OTP</span>
              <div className="flex-grow border-t border-stone-200"></div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-stone-700">
                Numero di Cellulare o Email:
              </label>
              <input
                type="text"
                placeholder="Es. +39 347 0000000 oppure marco.rossi@gmail.com"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />

              <button
                onClick={() => handleRequestOtp()}
                disabled={loading}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-98 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>{loading ? 'Invio in corso...' : 'Invia Codice OTP di Accesso'}</span>
              </button>
            </div>

            {/* Quick Demo Shortcuts */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                Accesso Rapido Clienti Cento (Demo Database SQL):
              </span>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setPhoneOrEmail('+39 3470000000');
                    handleRequestOtp('+39 3470000000');
                  }}
                  className="w-full p-2 text-left rounded-lg bg-stone-50 hover:bg-amber-50 border border-stone-200 text-xs text-stone-800 transition-colors flex items-center justify-between"
                >
                  <span className="font-medium">Marco Rossi (Via Penzale, Cento)</span>
                  <span className="font-mono text-[11px] text-amber-700">+39 3470000000</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhoneOrEmail('+39 347148293');
                    handleRequestOtp('+39 347148293');
                  }}
                  className="w-full p-2 text-left rounded-lg bg-stone-50 hover:bg-amber-50 border border-stone-200 text-xs text-stone-800 transition-colors flex items-center justify-between"
                >
                  <span className="font-medium">Alessandro Bonfiglioli (Corso Guercino)</span>
                  <span className="font-mono text-[11px] text-amber-700">+39 347148293</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: OTP VERIFICATION CODE */}
        {step === 'input_otp' && (
          <div className="max-w-md mx-auto space-y-4">
            
            {/* Simulated SMS Box */}
            {simulatedSmsBanner && (
              <div className="bg-stone-900 text-stone-100 rounded-2xl p-4 border border-amber-500/50 shadow-xl space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Smartphone className="w-4 h-4" />
                    <span>SMS in Arrivo da: Braciami Cento</span>
                  </span>
                  <span className="text-[10px] text-stone-400">Adesso</span>
                </div>
                <p className="text-xs text-stone-300">
                  {simulatedSmsBanner.message}
                </p>
                <button
                  onClick={() => setOtpCode(simulatedSmsBanner.code)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Incolla Codice Rapido ({simulatedSmsBanner.code})</span>
                </button>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-700 rounded-xl">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-950 text-base">Verifica Codice OTP</h3>
                  <p className="text-xs text-stone-500">Inviato al {phoneOrEmail}</p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-stone-700">
                  Inserisci il codice a 6 cifre:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Es. 849201"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full text-center tracking-[0.4em] font-mono text-2xl py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-950 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-98 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{loading ? 'Verifica in corso...' : 'Verifica & Accedi allo Storico'}</span>
                </button>

                <div className="flex items-center justify-between pt-2 text-xs text-stone-500">
                  <button
                    onClick={() => handleRequestOtp()}
                    className="text-amber-700 hover:underline cursor-pointer"
                  >
                    Invia un nuovo codice
                  </button>
                  <button
                    onClick={() => setStep('input_phone')}
                    className="text-stone-500 hover:underline cursor-pointer"
                  >
                    Modifica recapito
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* STEP 3: AUTHENTICATED ORDERS DASHBOARD */}
        {step === 'authenticated' && activeCustomer && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Customer Profile Banner */}
            <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 shadow-md border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-black text-lg shadow-md">
                  {activeCustomer.first_name[0]}{activeCustomer.last_name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-bold text-xl text-white">
                      {activeCustomer.full_name}
                    </h2>
                    {activeCustomer.is_registered && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-[10px] font-bold text-emerald-400 uppercase">
                        Cliente Registrato
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                      <span>{activeCustomer.phone}</span>
                    </span>
                    {activeCustomer.address && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span>{activeCustomer.address}, Cento</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Points & Logout */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-stone-800">
                <div className="bg-stone-800 px-3.5 py-1.5 rounded-xl border border-stone-700 text-right">
                  <span className="text-[10px] text-stone-400 uppercase block font-semibold">Punti Fedeltà Cento</span>
                  <span className="font-bold text-amber-400 font-mono-nums text-sm">
                    {profile?.punti_fedelta || activeCustomer.loyalty_points} pt
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
                  title="Disconnetti"
                >
                  <LogOut className="w-4 h-4 text-stone-400" />
                  <span>Esci</span>
                </button>
              </div>
            </div>

            {/* Dashboard Cliente: 3-Card Summary (Dati Fiscali & Spedizione, Club Brace Fedeltà, Statistiche Spesa) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: Scheda Anagrafica & Fiscale Completa */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      Dati Anagrafici & Fiscali
                    </h3>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    {profile?.tipo_utente === 1 ? 'Amministratore' : 'Cliente Verificato'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Intestatario:</span>
                    <span className="font-semibold text-stone-900">{activeCustomer.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Codice Fiscale:</span>
                    <span className="font-mono font-bold text-stone-900">
                      {profile?.codice_fiscale || 'RSSMRC85M01C469X'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Data di Nascita:</span>
                    <span className="font-medium text-stone-800">
                      {profile?.data_nascita || '15/06/1985'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Indirizzo Residenza:</span>
                    <span className="font-medium text-stone-800 text-right truncate max-w-[160px]">
                      {profile?.indirizzo || activeCustomer.address || 'Via Penzale 25'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">CAP & Provincia:</span>
                    <span className="font-medium text-stone-800">
                      {profile?.cap || activeCustomer.cap || '44042'} {profile?.provincia || activeCustomer.province || 'FE'} ({profile?.codice_nazione || 'IT'})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Recapito Cellulare:</span>
                    <span className="font-mono text-stone-800">{activeCustomer.phone}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Club Fedeltà & Saldo Sconti Riscattabili */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      Club del Braciere Centese
                    </h3>
                  </div>
                  <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                    Livello Gourmet
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-stone-500">Saldo punti attivo:</span>
                    <span className="text-lg font-black text-amber-600 font-mono">
                      {profile?.punti_fedelta || activeCustomer.loyalty_points} pt
                    </span>
                  </div>

                  {/* Progress to next reward */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-stone-500">
                      <span>Prossimo Buono Spesa (12€)</span>
                      <span className="font-bold">{(profile?.punti_fedelta || activeCustomer.loyalty_points)} / 150 pt</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.round(((profile?.punti_fedelta || activeCustomer.loyalty_points) / 150) * 100))}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100 flex items-center justify-between">
                    <span>Valore sconto spendibile:</span>
                    <span className="font-bold text-stone-900">€{Math.floor((profile?.punti_fedelta || activeCustomer.loyalty_points) / 10).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Promozioni e Buoni Sconto Riservati */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      Codici Sconto Riservati
                    </h3>
                  </div>
                  <span className="text-[10px] text-stone-400 font-medium">Usa a carrello</span>
                </div>

                <div className="space-y-2">
                  <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-950 block">FERRARA5</span>
                      <span className="text-[10px] text-amber-800">5€ sconto su spesa &gt; 35€ a Cento/FE</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText('FERRARA5');
                        showToast('Codice FERRARA5 copiato negli appunti!');
                      }}
                      className="p-1.5 hover:bg-amber-100 rounded-lg text-amber-800 cursor-pointer transition-colors"
                      title="Copia codice"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-2 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">BENVENUTO10</span>
                      <span className="text-[10px] text-stone-500">10% sul primo ordine online</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText('BENVENUTO10');
                        showToast('Codice BENVENUTO10 copiato negli appunti!');
                      }}
                      className="p-1.5 hover:bg-stone-200 rounded-lg text-stone-700 cursor-pointer transition-colors"
                      title="Copia codice"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('tutti')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'tutti'
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  Tutti gli Ordini ({customerOrders.length})
                </button>
                <button
                  onClick={() => setActiveTab('in_corso')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'in_corso'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  In Corso
                </button>
                <button
                  onClick={() => setActiveTab('completati')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'completati'
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  Completati
                </button>
              </div>

              <span className="text-xs text-stone-500 font-mono-nums hidden sm:inline">
                Database Bottega Cento (Via Penzale, 25)
              </span>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
                  <Package className="w-12 h-12 text-stone-300 mx-auto" />
                  <h3 className="font-bold text-lg text-stone-800">Nessun ordine trovato</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Non risultano ordini in questo stato per {activeCustomer.full_name}. Ordina subito una delle specialità di Manuel & Samanta!
                  </p>
                  <button
                    onClick={() => setActivePage('catalogo')}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    Esplora il Banco Brace
                  </button>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const { steps, currentIdx } = getTimelineSteps(order.status);
                  const isDelivering = order.deliveryMethod === 'consegna_cento';

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-amber-300 transition-all p-6 space-y-5"
                    >
                      {/* Order Top Strip */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono-nums font-extrabold text-lg text-stone-950">
                              #{order.id}
                            </span>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                              order.status === 'in_griglia'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : order.status === 'pronto' || order.status === 'in_consegna'
                                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                : order.status === 'completato'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-stone-100 text-stone-800'
                            }`}>
                              {order.status === 'ricevuto'
                                ? 'Ricevuto in Bottega'
                                : order.status === 'in_griglia'
                                ? 'In Griglia su Legna'
                                : order.status === 'pronto'
                                ? 'Pronto per Ritiro'
                                : order.status === 'in_consegna'
                                ? 'In Consegna a Cento'
                                : 'Completato'}
                            </span>
                          </div>
                          <span className="text-xs text-stone-500 font-mono-nums block mt-0.5">
                            Data ordine: {order.date} · {order.deliveryTimeSlot}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] text-stone-400 uppercase block">Totale Comanda</span>
                          <span className="font-mono-nums text-xl font-bold text-stone-900">
                            €{order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Live Timeline Stepper */}
                      <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {steps.map((st, idx) => {
                            const isPast = idx < currentIdx;
                            const isCurrent = idx === currentIdx;
                            return (
                              <div key={st.key} className="flex flex-col items-center text-center space-y-1">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    isCurrent
                                      ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-200'
                                      : isPast
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-stone-200 text-stone-400'
                                  }`}
                                >
                                  {isPast ? <CheckCircle className="w-4 h-4" /> : st.icon}
                                </div>
                                <span
                                  className={`text-[11px] font-medium leading-tight ${
                                    isCurrent
                                      ? 'text-amber-800 font-bold'
                                      : isPast
                                      ? 'text-stone-800'
                                      : 'text-stone-400'
                                  }`}
                                >
                                  {st.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Itemized Order Items */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                          Dettaglio Tagli & Portate:
                        </span>
                        <div className="divide-y divide-stone-100">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="py-2 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-semibold text-stone-900">
                                  {item.quantity}x {item.product.name}
                                </span>
                                {item.specialInstructions && (
                                  <span className="text-[11px] text-amber-700 italic block">
                                    Nota: &ldquo;{item.specialInstructions}&rdquo;
                                  </span>
                                )}
                              </div>
                              <span className="font-mono-nums font-bold text-stone-800">
                                €{(item.product.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Google Meet Video Call Option */}
                      <div className="bg-stone-900 text-stone-100 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-stone-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                            <Video className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">Videochiamata con Manuel & Samanta (Google Meet)</span>
                            <span className="text-[11px] text-stone-400 block">Consulenza in diretta su frollatura, taglio e consigli di cottura alla brace</span>
                          </div>
                        </div>
                        <a
                          href={order.orderHeader?.meet_link || `https://meet.google.com/bfe-ento-${order.id.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg inline-flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Partecipa su Google Meet</span>
                        </a>
                      </div>

                      {/* Payment & Delivery Bottom Strip */}
                      <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {isDelivering ? (
                              <Truck className="w-3.5 h-3.5 text-amber-600" />
                            ) : (
                              <MapPin className="w-3.5 h-3.5 text-amber-600" />
                            )}
                            <span className="font-medium text-stone-900">
                              {isDelivering
                                ? `Consegna a domicilio a Cento: ${order.customer.address || 'Indirizzo del cliente'}`
                                : 'Ritiro al banco bottega: Via Penzale, 25, 44042 Cento FE'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-stone-500">
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>
                              Metodo: <strong className="text-stone-700 capitalize">{order.paymentMethod}</strong> ({order.paymentStatus})
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleReorder(order)}
                          className="px-4 py-2 bg-stone-100 hover:bg-amber-100 text-stone-800 hover:text-amber-900 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Ordina di Nuovo</span>
                        </button>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
