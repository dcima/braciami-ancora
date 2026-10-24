import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useI18n } from '../i18n/I18nContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingCart,
  Snowflake,
  AlertTriangle,
  MapPin,
  Check
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    toggleFrozenRequested,
    cartSubtotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    discountAmount,
    setIsCheckoutOpen,
    showToast,
    theme
  } = useStore();
  const { t, uiText, estimatedDistanceKm, storeConfig, detectedCountryName } = useI18n();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isCartOpen) return null;

  const total = Math.max(0, cartSubtotal - discountAmount);
  const isLight = theme === 'chiaro';
  const maxDistance = storeConfig?.max_fresh_delivery_km || 50;

  // Check if any fresh perishable item cannot be shipped over distance
  const unfreezableFreshCount = cart.filter(
    (item) => item.product.isFreshPerishable && !item.product.canBeFrozen && estimatedDistanceKm > maxDistance
  ).length;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError('');
      setPromoInput('');
      showToast(res.message);
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div id="cart_drawer_root" className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        id="cart_drawer_backdrop"
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart_drawer_panel"
          className={`w-screen max-w-md shadow-2xl flex flex-col justify-between border-l ${
            isLight
              ? 'bg-[#FAF8F5] text-stone-900 border-stone-200'
              : 'bg-stone-50 text-stone-900 border-stone-200'
          }`}
        >
          {/* Header */}
          <div id="cart_header" className="p-5 border-b border-stone-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/10 text-amber-700 rounded-xl">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h2 id="cart_title_text" className="font-display text-lg font-bold text-stone-900">
                  {uiText('cart_drawer_title', t('cart_drawer_title'))}
                </h2>
                <div className="flex items-center gap-1 text-[11px] text-stone-500 font-mono">
                  <MapPin className="w-3 h-3 text-amber-500" />
                  <span>{detectedCountryName} · {estimatedDistanceKm} km da Cento FE</span>
                </div>
              </div>
            </div>
            <button
              id="btn_close_cart_drawer"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label={t('close_modal')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div id="cart_items_container" className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div id="cart_empty_state" className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <ShoppingCart className="w-12 h-12 text-stone-300 mb-3" />
                <p className="text-base font-semibold text-stone-800">{uiText('cart_empty_title', t('cart_empty_title'))}</p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  {uiText('cart_empty_desc', t('cart_empty_desc'))}
                </p>
                <button
                  id="btn_cart_empty_continue"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 px-5 py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  {uiText('cart_continue_shopping', t('cart_continue_shopping'))}
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const isOverDistance = estimatedDistanceKm > maxDistance;
                const isFresh = Boolean(item.product.isFreshPerishable);
                const canFreeze = Boolean(item.product.canBeFrozen);

                return (
                  <div
                    key={item.product.id}
                    id={`cart_row_${item.product.id}`}
                    className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-stone-900 text-sm">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-stone-500 font-mono-nums mt-0.5">
                          €{item.product.price.toFixed(2)} / {item.product.portion}
                        </p>
                        {item.product.wineDenomination && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                            {item.product.wineDenomination} · {item.product.alcoholByVolume}% Vol.
                          </span>
                        )}
                      </div>

                      <button
                        id={`btn_remove_${item.product.id}`}
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Rimuovi prodotto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Fresh Perishability & Cold-Chain Shipping Switch */}
                    {isFresh && isOverDistance && (
                      <div className="rounded-xl p-2.5 border text-xs space-y-2 bg-stone-50 border-stone-200">
                        {canFreeze ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-sky-800 font-semibold text-[11px]">
                              <Snowflake className="w-4 h-4 text-sky-600 shrink-0" />
                              <span>Catena del Freddo ({estimatedDistanceKm} km da Cento):</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleFrozenRequested(item.product.id)}
                              className={`w-full py-1.5 px-2.5 rounded-lg border text-left text-[11px] font-medium flex items-center justify-between cursor-pointer transition-colors ${
                                item.isFrozenRequested
                                  ? 'bg-sky-100 border-sky-400 text-sky-950 font-bold'
                                  : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                              }`}
                            >
                              <span className="flex items-center gap-1.5">
                                <Snowflake className="w-3.5 h-3.5 text-sky-600" />
                                {item.isFrozenRequested
                                  ? '✓ Spedizione Criogenica Surgelata (-18°C) Attiva'
                                  : 'Attiva Spedizione Surgelata a Bassa Temperatura'}
                              </span>
                              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-200/60 text-sky-900">
                                HACCP
                              </span>
                            </button>
                            {!item.isFrozenRequested && (
                              <p className="text-[10px] text-amber-800 leading-tight">
                                Consiglio per mete lontane: attiva la spedizione surgelata per garantire massima freschezza e igiene durante il trasporto.
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-start gap-2 text-rose-800 text-[11px] leading-tight">
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block font-bold">Piatto Espresso Non Surgelabile:</strong>
                              Distanza {estimatedDistanceKm} km superiore al limite HACCP ({maxDistance} km).
                              Disponibile solo con <strong>Ritiro in Bottega a Cento</strong> o consegna locale.
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <div className="text-[11px] text-amber-950 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg">
                        {item.specialInstructions}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-lg">
                        <button
                          id={`btn_qty_minus_${item.product.id}`}
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded transition-colors text-stone-700 cursor-pointer"
                          aria-label="Diminuisci quantità"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold font-mono-nums px-2 text-stone-900 min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          id={`btn_qty_plus_${item.product.id}`}
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded transition-colors text-stone-700 cursor-pointer"
                          aria-label="Aumenta quantità"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-mono-nums font-bold text-sm text-stone-900">
                        €{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div id="cart_footer_section" className="p-5 border-t border-stone-200 bg-white space-y-4">
              {/* Distance Warning Banner if non-freezable fresh goods are present */}
              {unfreezableFreshCount > 0 && (
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-[11px] text-amber-950 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Avviso Norme Deperibilità ({detectedCountryName}):</strong>
                    <span className="block mt-0.5 text-stone-700">
                      I piatti caldi espressi non possono viaggiare per {estimatedDistanceKm} km. Potrai ordinare selezionando il <strong>Ritiro in Bottega</strong> a Cento FE, oppure sostituirli con tagli surgelabili o vini DOP/IGP.
                    </span>
                  </div>
                </div>
              )}

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    id="input_cart_promo"
                    type="text"
                    placeholder={uiText('cart_promo_code', t('cart_promo_code'))}
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    id="btn_cart_apply_promo"
                    type="submit"
                    className="px-4 py-2 bg-stone-900 text-stone-100 hover:bg-stone-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {uiText('cart_apply_code', t('cart_apply_code'))}
                  </button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-rose-600 pl-1">{promoError}</p>
                )}
                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <span>{appliedPromo.title} (-€{discountAmount.toFixed(2)})</span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-emerald-700 underline text-[11px] cursor-pointer"
                    >
                      Rimuovi
                    </button>
                  </div>
                )}
              </form>

              {/* Subtotal, Discount & Total */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>{uiText('cart_subtotal', t('cart_subtotal'))}</span>
                  <span className="font-mono-nums">€{cartSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>{uiText('cart_discount', t('cart_discount'))}</span>
                    <span className="font-mono-nums">-€{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-500 text-[11px]">
                  <span>{uiText('cart_delivery', t('cart_delivery'))}</span>
                  <span>{uiText('cart_free_pickup', t('cart_free_pickup'))}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>{uiText('cart_total', t('cart_total'))}</span>
                  <span className="font-mono-nums text-lg text-amber-700">€{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Proceed to checkout button */}
              <button
                id="btn_cart_proceed_checkout"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 active:scale-98 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{uiText('cart_proceed_checkout', t('cart_proceed_checkout'))}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
