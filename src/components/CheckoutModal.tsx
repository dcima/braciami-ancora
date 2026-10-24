import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { DeliveryMethod, PaymentMethod, Order } from '../types';
import {
  X,
  ShieldCheck,
  Smartphone,
  Mail,
  MapPin,
  Store,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  AlertCircle
} from 'lucide-react';
import { executeRecaptcha } from '../utils/recaptcha';
import { useI18n } from '../i18n/I18nContext';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    discountAmount,
    appliedPromo,
    createOrder,
    requestOtp,
    verifyOtp,
    isOtpVerified,
    generatedOtp,
    customers,
    activeCustomer,
    setActiveCustomer,
    setActivePage,
    processPaymentMethod
  } = useStore();

  const { t, uiText, estimatedDistanceKm, storeConfig, detectedCountryName } = useI18n();

  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  // Mode: guest OTP vs registered
  const [checkoutMode, setCheckoutMode] = useState<'guest_otp' | 'registered'>('guest_otp');
  const [otpChannel, setOtpChannel] = useState<'SMS' | 'Email'>('SMS');
  const [contactInput, setContactInput] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Customer info
  const [fullName, setFullName] = useState(activeCustomer?.fullName || '');
  const [email, setEmail] = useState(activeCustomer?.email || '');
  const [phone, setPhone] = useState(activeCustomer?.phone || '');
  const [address, setAddress] = useState(activeCustomer?.address || '');
  const [cityZone, setCityZone] = useState('Cento (Centro)');
  const [orderNotes, setOrderNotes] = useState('');

  // Delivery & Payment
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('ritiro_bottega');
  const [timeSlot, setTimeSlot] = useState('Oggi tra le 19:30 e le 20:00');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('satispay');

  // Confirmation screen
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const deliveryFee = deliveryMethod === 'ritiro_bottega' ? 0 : (cartSubtotal >= 40 ? 0 : 4.0);
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

  // Send OTP
  const handleSendOtp = () => {
    if (!contactInput.trim()) {
      setOtpError('Inserisci un recapito valido (cellulare o email)');
      return;
    }
    setOtpError('');
    requestOtp(contactInput.trim(), otpChannel);
    setOtpSent(true);

    if (otpChannel === 'SMS') {
      setPhone(contactInput.trim());
    } else {
      setEmail(contactInput.trim());
    }
  };

  // Verify OTP
  const handleVerifyOtp = () => {
    if (!enteredOtp.trim()) {
      setOtpError('Inserisci il codice ricevuto a 4 cifre');
      return;
    }
    const valid = verifyOtp(enteredOtp);
    if (!valid) {
      setOtpError('Codice non valido. Riprova con il codice indicato.');
    } else {
      setOtpError('');
    }
  };

  // Select registered profile
  const handleSelectCustomer = (customerId: string) => {
    const cust = customers.find((c) => c.id === customerId);
    if (cust) {
      setActiveCustomer(cust);
      setFullName(cust.fullName);
      setEmail(cust.email);
      setPhone(cust.phone);
      setAddress(cust.address);
    }
  };

  // Final submit
  const handleConfirmOrder = async () => {
    if (!fullName.trim()) {
      alert('Inserisci il tuo nome e cognome.');
      return;
    }

    if (checkoutMode === 'guest_otp' && !isOtpVerified) {
      alert('Completa la verifica rapida via OTP prima di confermare.');
      return;
    }

    const maxDistance = storeConfig?.max_fresh_delivery_km || 50;
    const hasUnfrozenFresh = cart.some(
      (item) => item.product.isFreshPerishable && !item.isFrozenRequested
    );

    if (deliveryMethod === 'consegna_cento' && estimatedDistanceKm > maxDistance && hasUnfrozenFresh) {
      alert(
        `Attenzione Normative HACCP & Deperibilità:\nIl tuo carrello include prodotti caldi o freschi non surgelati e la richiesta proviene da ${detectedCountryName} (${estimatedDistanceKm} km da Cento FE, limite massimo ${maxDistance} km).\n\nPer procedere, seleziona "Ritiro in Bottega a Cento" oppure attiva la "Spedizione Surgelata" dal carrello per i tagli idonei.`
      );
      return;
    }

    if (deliveryMethod === 'consegna_cento' && !address.trim()) {
      alert('Inserisci l indirizzo per la consegna a Cento o nelle frazioni.');
      return;
    }

    // Execute reCAPTCHA Enterprise
    await executeRecaptcha('checkout');

    // Process Payment Method simulation (PCI-DSS / Bancomat / PayPal / Satispay / Contanti)
    const paymentResult = processPaymentMethod(paymentMethod, finalTotal, {
      fullName,
      phone: phone || contactInput || '340 0000000',
      email: email || `${(phone || contactInput).replace(/\s+/g, '')}@guest-cento.it`
    });
    setPaymentInfo(paymentResult);

    const newOrder = createOrder({
      items: cart,
      subtotal: cartSubtotal,
      discount: discountAmount,
      deliveryFee,
      total: finalTotal,
      status: 'ricevuto',
      deliveryMethod,
      deliveryTimeSlot: timeSlot,
      paymentMethod,
      paymentStatus: paymentMethod === 'contanti' ? 'in_attesa_al_ritiro' : 'pagato',
      customer: {
        fullName,
        email: email || `${phone.replace(/\s+/g, '')}@guest-cento.it`,
        phone: phone || contactInput || '340 0000000',
        address: deliveryMethod === 'consegna_cento' ? `${address}, ${cityZone}` : undefined,
        city: 'Cento',
        postalCode: '44042',
        notes: orderNotes,
        isGuest: checkoutMode === 'guest_otp',
        isOtpVerified: true
      },
      appliedPromoCode: appliedPromo?.code
    });

    setCompletedOrder(newOrder);
  };

  const handleClose = () => {
    setCompletedOrder(null);
    setPaymentInfo(null);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-stone-900 text-stone-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold">
                {completedOrder ? 'Ordine Confermato!' : 'Cassa & Ordinazione Online'}
              </h2>
              <p className="text-xs text-stone-400">
                Bottega Braciami ancora · Cento (FE)
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            aria-label="Chiudi checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-stone-900">
          {completedOrder ? (
            /* Post-Order State (Order Confirmed) */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block">
                  Ricevuto in cucina & macelleria
                </span>
                <h3 className="font-display text-2xl font-bold text-stone-900 mt-1">
                  Grazie, {completedOrder.customer.fullName}!
                </h3>
                <p className="text-sm text-stone-600 mt-1">
                  Il tuo ordine <strong className="font-mono-nums text-amber-700">#{completedOrder.id}</strong> è stato preso in carico da Manuel e Samanta.
                </p>
              </div>

              {/* Order recap box */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-stone-500">Modalità:</span>
                  <span className="font-semibold text-stone-900">
                    {completedOrder.deliveryMethod === 'ritiro_bottega'
                      ? 'Ritiro in bottega: Via Penzale, 25 · 44042 Cento FE'
                      : 'Consegna a domicilio'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-stone-500">Orario concordato:</span>
                  <span className="font-semibold text-amber-700">{completedOrder.deliveryTimeSlot}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-stone-500">Metodo Pagamento:</span>
                  <span className="font-semibold uppercase text-stone-900">{completedOrder.paymentMethod} ({completedOrder.paymentStatus})</span>
                </div>
                {paymentInfo && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 space-y-0.5">
                    <div className="font-bold flex items-center justify-between">
                      <span>{paymentInfo.method}</span>
                      <span className="text-emerald-700 font-mono text-[10px]">{paymentInfo.statusText}</span>
                    </div>
                    <div className="font-mono text-[10px] text-stone-600">ID Transazione: {paymentInfo.transactionId}</div>
                    <div>{paymentInfo.receiptMessage}</div>
                  </div>
                )}
                <div className="flex justify-between py-1 text-sm font-bold pt-1">
                  <span>Totale pagato:</span>
                  <span className="font-mono-nums text-base text-stone-950">€{completedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Cooking / Preparation message from Manuel */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 max-w-md mx-auto text-xs text-amber-900 text-left">
                <strong>Messaggio dalla Brace di Manuel:</strong>
                <p className="mt-1 text-stone-700">
                  Stiamo accendendo i carboni di rovere. I tuoi tagli saranno preparati con cura artigianale. Riceverai un SMS quando l ordine sarà pronto!
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    handleClose();
                    setActivePage('ordini');
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm"
                >
                  Traccia il Tuo Ordine
                </button>
                <button
                  onClick={() => {
                    handleClose();
                    setActivePage('catalogo');
                  }}
                  className="px-4 py-2.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg"
                >
                  Torna al Catalogo
                </button>
              </div>
            </div>
          ) : (
            /* Standard Checkout Form */
            <>
              {/* Step 1: Customer Mode Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  1. Come desideri ordinare?
                </label>
                
                <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setCheckoutMode('guest_otp')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                      checkoutMode === 'guest_otp'
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    ⚡ Rapido Senza Registrazione (OTP)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutMode('registered')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                      checkoutMode === 'registered'
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    👤 Cliente Registrato / Punti
                  </button>
                </div>
              </div>

              {/* Guest OTP Mode */}
              {checkoutMode === 'guest_otp' && (
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-900">
                      Verifica istantanea via OTP (Zero password)
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpChannel('SMS');
                          setOtpSent(false);
                        }}
                        className={`px-2 py-0.5 text-[11px] rounded ${
                          otpChannel === 'SMS' ? 'bg-amber-200 text-amber-950 font-bold' : 'text-stone-500'
                        }`}
                      >
                        SMS
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpChannel('Email');
                          setOtpSent(false);
                        }}
                        className={`px-2 py-0.5 text-[11px] rounded ${
                          otpChannel === 'Email' ? 'bg-amber-200 text-amber-950 font-bold' : 'text-stone-500'
                        }`}
                      >
                        Email
                      </button>
                    </div>
                  </div>

                  {!isOtpVerified ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          {otpChannel === 'SMS' ? (
                            <Smartphone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                          ) : (
                            <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                          )}
                          <input
                            type={otpChannel === 'SMS' ? 'tel' : 'email'}
                            placeholder={otpChannel === 'SMS' ? 'Numero cellulare (es. 347 1234567)' : 'La tua email (es. mario@email.it)'}
                            value={contactInput}
                            onChange={(e) => setContactInput(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="px-3.5 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm whitespace-nowrap"
                        >
                          {otpSent ? 'Reinvia OTP' : 'Invia Codice'}
                        </button>
                      </div>

                      {/* Simulated OTP Notification Banner for testing */}
                      {generatedOtp && (
                        <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs space-y-1.5">
                          <div className="flex items-center justify-between font-medium text-amber-900">
                            <span>Codice di verifica inviato:</span>
                            <span className="font-mono-nums font-bold text-sm bg-white px-2 py-0.5 rounded border border-amber-300">
                              {generatedOtp.code}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-stone-600">
                            <span>Inserisci il codice per verificare il recapito:</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEnteredOtp(generatedOtp.code);
                              }}
                              className="text-amber-800 underline font-semibold"
                            >
                              Auto-compila {generatedOtp.code}
                            </button>
                          </div>
                        </div>
                      )}

                      {otpSent && (
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="Inserisci codice a 4 cifre"
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value)}
                            className="w-44 px-3 py-2 text-xs text-center font-mono-nums tracking-widest bg-white border border-stone-300 rounded-lg font-bold"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg"
                          >
                            Verifica OTP
                          </button>
                        </div>
                      )}

                      {otpError && (
                        <p className="text-xs text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{otpError}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Recapito ({contactInput}) verificato con successo via OTP!</span>
                    </div>
                  )}
                </div>
              )}

              {/* Registered Customer Quick Selector */}
              {checkoutMode === 'registered' && (
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-semibold text-stone-900 block">
                    Seleziona un profilo demo registrato a Cento:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {customers.slice(0, 4).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectCustomer(c.id)}
                        className={`p-2.5 text-left rounded-lg border text-xs transition-all ${
                          activeCustomer?.id === c.id
                            ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-400'
                            : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="font-semibold text-stone-900">{c.fullName}</div>
                        <div className="text-[11px] text-stone-500">{c.address}</div>
                        <div className="text-[10px] text-amber-700 font-medium mt-1">
                          {c.loyaltyPoints} Punti Brace · {c.segment}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Contact Details */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                  2. Dati di contatto
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-stone-600 block mb-1">Nome e Cognome *</span>
                    <input
                      type="text"
                      placeholder="Es. Mario Rossi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-stone-600 block mb-1">Telefono per aggiornamenti *</span>
                    <input
                      type="tel"
                      placeholder="347 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Delivery Method */}
              <div id="checkout_step_delivery" className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                    3. Modalità di Consegna / Ritiro
                  </label>
                  <span className="text-[11px] font-mono text-stone-500">
                    {detectedCountryName} · {estimatedDistanceKm} km
                  </span>
                </div>

                {estimatedDistanceKm > (storeConfig?.max_fresh_delivery_km || 50) && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Avviso Raggio di Consegna ({estimatedDistanceKm} km):</strong>
                      <span className="block mt-0.5 text-stone-700">
                        La consegna a domicilio locale è riservata a Cento e comuni limitrofi (entro {storeConfig?.max_fresh_delivery_km || 50} km). Per ordini da altre province o dall'estero ({detectedCountryName}), scegli il <strong>Ritiro in Bottega</strong> oppure ordini con spedizione refrigerata.
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    id="btn_delivery_pickup"
                    type="button"
                    onClick={() => setDeliveryMethod('ritiro_bottega')}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      deliveryMethod === 'ritiro_bottega'
                        ? 'bg-amber-50/70 border-amber-500 shadow-sm'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <Store className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Ritiro in Bottega (Cento)</div>
                      <div className="text-[11px] text-stone-500">Via Penzale, 25, 44042 Cento FE</div>
                      <div className="text-[11px] text-emerald-700 font-semibold mt-1">Gratuito · Salta la fila</div>
                    </div>
                  </button>

                  <button
                    id="btn_delivery_courier"
                    type="button"
                    onClick={() => setDeliveryMethod('consegna_cento')}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      deliveryMethod === 'consegna_cento'
                        ? 'bg-amber-50/70 border-amber-500 shadow-sm'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Consegna a Domicilio</div>
                      <div className="text-[11px] text-stone-500">Cento, Renazzo, Pieve di Cento, frazioni</div>
                      <div className="text-[11px] text-stone-600 font-medium mt-1">
                        {cartSubtotal >= 40 ? 'Gratuita (sopra 40€)' : '€4.00 (gratuita sopra 40€)'}
                      </div>
                    </div>
                  </button>
                </div>

                {deliveryMethod === 'consegna_cento' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div>
                      <span className="text-xs text-stone-600 block mb-1">Zona di consegna:</span>
                      <select
                        value={cityZone}
                        onChange={(e) => setCityZone(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900"
                      >
                        <option value="Cento (Centro Storico)">Cento (Centro Storico)</option>
                        <option value="Renazzo (Cento)">Renazzo (Cento)</option>
                        <option value="Pieve di Cento">Pieve di Cento</option>
                        <option value="Corporeno">Corporeno</option>
                        <option value="Dodici Morelli">Dodici Morelli</option>
                        <option value="Casumaro">Casumaro</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-xs text-stone-600 block mb-1">Via e Numero Civico:</span>
                      <input
                        type="text"
                        placeholder="Es. Via IV Novembre 14"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900"
                      />
                    </div>
                  </div>
                )}

                {/* Time slot picker */}
                <div>
                  <span className="text-xs text-stone-600 block mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Fascia oraria preferita:</span>
                  </span>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900"
                  >
                    <option value="Oggi a Pranzo (12:30 - 13:30)">Oggi a Pranzo (12:30 - 13:30)</option>
                    <option value="Oggi tra le 19:00 e le 19:45">Oggi tra le 19:00 e le 19:45</option>
                    <option value="Oggi tra le 19:45 e le 20:30">Oggi tra le 19:45 e le 20:30</option>
                    <option value="Domani a Pranzo (12:30 - 13:30)">Domani a Pranzo (12:30 - 13:30)</option>
                    <option value="Domenica Mattina - Ritiro Grigliata (11:30 - 13:00)">
                      Domenica Mattina - Ritiro Grigliata (11:30 - 13:00)
                    </option>
                  </select>
                </div>
              </div>

              {/* Step 4: Payment Selection */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                  4. Metodo di Pagamento
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('satispay')}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      paymentMethod === 'satispay'
                        ? 'bg-rose-50 border-rose-500 font-bold text-rose-900 ring-1 ring-rose-500'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-rose-600">Satispay</div>
                    <div className="text-[10px] text-stone-500">Istantaneo</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('carta')}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      paymentMethod === 'carta'
                        ? 'bg-amber-50 border-amber-500 font-bold text-stone-900 ring-1 ring-amber-500'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-0.5 text-stone-600" />
                    <div className="text-xs font-bold">Carta / POS</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      paymentMethod === 'paypal'
                        ? 'bg-blue-50 border-blue-500 font-bold text-blue-900 ring-1 ring-blue-500'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-blue-700">PayPal</div>
                    <div className="text-[10px] text-stone-500">Sicuro</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('contanti')}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      paymentMethod === 'contanti'
                        ? 'bg-amber-50 border-amber-500 font-bold text-stone-900 ring-1 ring-amber-500'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Banknote className="w-4 h-4 mx-auto mb-0.5 text-stone-600" />
                    <div className="text-xs font-bold">Al Ritiro</div>
                  </button>
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <span className="text-xs text-stone-600 block mb-1">Note opzionali per la preparazione:</span>
                <input
                  type="text"
                  placeholder="Es. Campanello sul retro, citofonare prima, allergia spezie..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              {/* Final Summary Strip */}
              <div className="bg-stone-900 text-stone-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-stone-400 block">Totale da pagare:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono-nums text-2xl font-bold text-amber-400">
                      €{finalTotal.toFixed(2)}
                    </span>
                    {deliveryFee > 0 && (
                      <span className="text-xs text-stone-400">(incl. €4 consegna)</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-end gap-1.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleConfirmOrder}
                    className="w-full sm:w-auto px-6 py-3 text-xs font-bold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Conferma e Invia Ordine</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Protetto da Google reCAPTCHA Enterprise</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
