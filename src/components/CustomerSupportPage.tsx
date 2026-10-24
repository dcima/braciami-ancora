import React, { useState } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { useStore } from '../context/StoreContext';
import { useI18n } from '../i18n/I18nContext';
import { FirestoreService } from '../firebase/firestoreService';
import { CustomerSupportChatMessage } from '../types';
import { Language } from '../i18n/translations';
import {
  MessageSquare,
  Video,
  Send,
  PhoneCall,
  CheckCircle2,
  Lock,
  DoorOpen,
  Clock,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

const SUPPORT_RESTRICTED_I18N: Record<Language, { notice: string; sub: string; loginBtn: string }> = {
  it_IT: {
    notice: 'Chat e live Meet disponibili solo dopo la registrazione ed accesso',
    sub: "Per parlare direttamente con Manuel e Samanta o avviare una videochiamata Google Meet dal banco di Cento, completa l'accesso o la registrazione con il tuo provider.",
    loginBtn: 'Accedi con il tuo Provider'
  },
  en_US: {
    notice: 'Chat and live Meet are available only after registration and sign-in',
    sub: 'To chat directly with Manuel and Samanta or start a live Google Meet call from the Cento counter, please register or sign in with your provider.',
    loginBtn: 'Sign in with your Provider'
  },
  de_DE: {
    notice: 'Chat und Live-Meet sind erst nach Registrierung und Anmeldung verfügbar',
    sub: 'Um direkt mit Manuel und Samanta zu chatten oder ein Live-Google-Meet zu starten, melden Sie sich bitte mit Ihrem Anbieter an.',
    loginBtn: 'Mit Ihrem Anbieter anmelden'
  },
  fr_FR: {
    notice: 'Chat et live Meet disponibles uniquement après inscription et connexion',
    sub: 'Pour échanger directement avec Manuel et Samanta ou lancer un appel Google Meet, veuillez vous inscrire ou vous connecter avec votre fournisseur.',
    loginBtn: 'Se connecter avec votre fournisseur'
  },
  es_ES: {
    notice: 'Chat y live Meet disponibles solo después del registro e inicio de sesión',
    sub: 'Para chatear directamente con Manuel y Samanta o iniciar una videollamada Google Meet, inicia sesión o regístrate con tu proveedor.',
    loginBtn: 'Iniciar sesión con tu proveedor'
  },
  nl_NL: {
    notice: 'Chat en live Meet zijn alleen beschikbaar na registratie en inloggen',
    sub: 'Om direct te chatten met Manuel en Samanta of een live Google Meet-gesprek te starten, log in of registreer met uw provider.',
    loginBtn: 'Inloggen met uw provider'
  },
  sv_SE: {
    notice: 'Chatt och live Meet är endast tillgängliga efter registrering och inloggning',
    sub: 'För att chatta direkt med Manuel och Samanta eller starta ett Google Meet-videosamtal, vänligen logga in med din leverantör.',
    loginBtn: 'Logga in med din leverantör'
  },
  zh_CN: {
    notice: '在线聊天与 live Meet 仅在注册并登录后可用',
    sub: '若要与 Manuel 和 Samanta 实时沟通或开启 Google Meet 视频连线，请先通过第三方提供商注册并登录。',
    loginBtn: '通过您的提供商登录'
  },
  ja_JP: {
    notice: 'チャットとライブMeetは登録・ログイン後にのみご利用いただけます',
    sub: 'マヌエルやサマンタとのチャット相談やGoogle Meetでのビデオ通話をご利用いただくには、プロバイダーでログインまたは会員登録を行ってください。',
    loginBtn: 'プロバイダーでログイン'
  },
  ru_RU: {
    notice: 'Чат и live Meet доступны только после регистрации и входа',
    sub: 'Для прямой связи с Мануэлем и Самантой или видеозвонка Google Meet войдите через выбранного провайдера.',
    loginBtn: 'Войти через провайдера'
  },
  ar_SA: {
    notice: 'الدردشة ومكالمات Meet المباشرة متاحة فقط بعد التسجيل وتسجيل الدخول',
    sub: 'للتواصل المباشر مع مانويل وسامانثا أو بدء مكالمة Google Meet، يرجى تسجيل الدخول أو إنشاء حساب عبر مزودك.',
    loginBtn: 'تسجيل الدخول عبر المزود'
  }
};

export const CustomerSupportPage: React.FC = () => {
  const { user, profile, signInWithProvider } = useAuth();
  const { orders, pushAdminNotification, showToast, theme } = useStore();
  const { uiText, language } = useI18n();

  const isLight = theme === 'chiaro';
  const isLoggedIn = Boolean(user);
  const localized = SUPPORT_RESTRICTED_I18N[language] || SUPPORT_RESTRICTED_I18N.it_IT;

  const customerName =
    user?.displayName ||
    (profile ? `${profile.nome} ${profile.cognome}` : 'Cliente Registrato');
  const customerEmail = user?.email || profile?.email || 'cliente@braciamiancora.it';

  const [messages, setMessages] = useState<CustomerSupportChatMessage[]>([
    {
      id: 'welcome-bottega-1',
      customerEmail,
      customerName,
      sender: 'bottega',
      text: `Ciao ${customerName}! Benvenuto nell'Assistenza Diretta della Bottega di Cento (Via Penzale 25). Scrivici qui in chat oppure avvia un collegamento video Google Meet per scegliere i tagli direttamente al banco con Manuel e Samanta.`,
      timestamp: new Date().toISOString()
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [meetTopic, setMeetTopic] = useState<string>('Scelta taglio in diretta al banco carni');
  const [meetSlot, setMeetSlot] = useState<string>('Subito (In diretta ora)');
  const [activeMeetUrl, setActiveMeetUrl] = useState<string | null>(null);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const cleanText = selectedOrderId
      ? `[Rif. Ordine #${selectedOrderId}] ${inputText.trim()}`
      : inputText.trim();

    const customerMsg: CustomerSupportChatMessage = {
      id: `chat-${Date.now()}`,
      customerEmail,
      customerName,
      sender: 'cliente',
      text: cleanText,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, customerMsg]);
    setInputText('');

    FirestoreService.saveSupportChatMessage(customerMsg).catch(() => {});

    pushAdminNotification({
      type: 'USER_CONNECTED',
      severity: 'info',
      title: `Nuovo Messaggio Chat Assistenza (${customerName})`,
      message: cleanText,
      customerName,
      customerContact: customerEmail,
      relatedOrderId: selectedOrderId || undefined,
      deviceType: 'Smartphone'
    });

    // Automatic helpful confirmation from Bottega
    setTimeout(() => {
      const replyMsg: CustomerSupportChatMessage = {
        id: `chat-reply-${Date.now()}`,
        customerEmail,
        customerName,
        sender: 'bottega',
        text: `Grazie ${customerName.split(' ')[0]}! Manuel e Samanta hanno ricevuto la tua richiesta in bottega a Cento e ti rispondono subito. Se preferisci mostrarci o vedere il taglio dal vivo, clicca su "Avvia Collegamento Google Meet".`,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 900);
  };

  const handleRequestGoogleMeet = () => {
    const meetRoomCode = 'braciami-cento-live';
    const meetUrl = `https://meet.google.com/new`;
    setActiveMeetUrl(meetUrl);

    const meetMsg: CustomerSupportChatMessage = {
      id: `meet-${Date.now()}`,
      customerEmail,
      customerName,
      sender: 'cliente',
      text: `📹 Richiesta collegamento Google Meet (${meetSlot}) — Argomento: ${meetTopic}`,
      timestamp: new Date().toISOString(),
      meetLink: meetUrl
    };

    setMessages((prev) => [...prev, meetMsg]);
    FirestoreService.saveSupportChatMessage(meetMsg).catch(() => {});

    pushAdminNotification({
      type: 'USER_CONNECTED',
      severity: 'warning',
      title: `Richiesta Videochiamata Google Meet (${customerName})`,
      message: `Fascia: ${meetSlot} · Argomento: ${meetTopic} · Stanza: ${meetRoomCode}`,
      customerName,
      customerContact: customerEmail,
      deviceType: 'Smartphone'
    });

    showToast('Richiesta Google Meet inviata alla Bottega! Apertura stanza video...');
    window.open(meetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block">
          {uiText('support_badge', 'Filo Diretto Bottega di Cento · Via Penzale 25')}
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
          {uiText('nav_support', 'Assistenza Clienti · Chat Diretta & Google Meet')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          {uiText(
            'support_subtitle',
            'Parla in tempo reale con Manuel e Samanta per consigli sui tagli, modifiche agli ordini o avvia una videochiamata Google Meet dal banco.'
          )}
        </p>
      </div>

      {/* SE L'UTENTE NON È ANCORA REGISTRATO / AUTENTICATO CON IL PROPRIO PROVIDER:
          Segnala "Chat e live Meet disponibili solo dopo la registrazione ed accesso"
          e lascia il recapito telefonico */}
      {!isLoggedIn ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card Avviso Blocco: Chat e Live Meet riservati a clienti registrati */}
          <div
            className={`lg:col-span-8 rounded-3xl border p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-sm ${
              isLight ? 'bg-amber-50/50 border-amber-200' : 'bg-stone-900 border-stone-800'
            }`}
          >
            <div className="w-14 h-14 rounded-3xl bg-amber-500/20 text-amber-600 border border-amber-400/30 flex items-center justify-center shadow-xs">
              <Lock className="w-7 h-7" />
            </div>

            <div className="max-w-md space-y-1.5">
              <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100">
                {localized.notice}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {localized.sub}
              </p>
            </div>

            <button
              type="button"
              onClick={() => signInWithProvider('google')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              <DoorOpen className="w-4 h-4" />
              <span>{localized.loginBtn}</span>
            </button>
          </div>

          {/* Recapito Telefonico Diretto Bottega (sempre visibile) */}
          <div className="lg:col-span-4 space-y-4">
            <div
              className={`rounded-3xl border p-6 space-y-3.5 shadow-sm ${
                isLight ? 'bg-white border-stone-200' : 'bg-stone-900 border-stone-800'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">
                  Contatto Telefonico Diretto
                </span>
                <h3 className="font-display text-base font-bold mt-0.5">
                  Recapito Telefonico Diretto Bottega
                </h3>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">
                Siamo sempre a tua disposizione telefonicamente in bottega per qualsiasi informazione sui tagli freschi o prenotazioni:
              </p>

              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-200">
                  <span className="text-stone-500">Telefono:</span>
                  <a
                    href="tel:+390516831000"
                    className="text-amber-600 hover:underline font-mono text-sm"
                  >
                    +39 051 6831000
                  </a>
                </div>
                <div className="flex items-center gap-2 text-stone-500">
                  <span>Indirizzo:</span>
                  <span className="text-stone-700 dark:text-stone-300 font-medium">Via Penzale 25, 44042 Cento (FE)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 text-[11px] text-stone-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Dal Martedì alla Domenica (Orario continuato al banco)</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* SE L'UTENTE È REGISTRATO E HA EFFETTUATO L'ACCESSO: Mostra Chat e Live Meet */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Cols: Live Chat with Bottega */}
          <div
            className={`lg:col-span-7 rounded-3xl border shadow-sm flex flex-col overflow-hidden ${
              isLight ? 'bg-white border-stone-200' : 'bg-stone-900 border-stone-800'
            }`}
          >
            <div className="px-4 sm:px-5 py-3.5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-amber-500/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shadow-xs">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold flex items-center gap-1.5">
                    <span>{uiText('support_chat_title', 'Chat Diretta con la Bottega')}</span>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </h2>
                  <p className="text-[11px] text-stone-500">
                    Manuel & Samanta · Risposta immediata da Via Penzale 25, Cento (FE)
                  </p>
                </div>
              </div>

              {orders.length > 0 && (
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  aria-label="Seleziona ordine di riferimento"
                  className={`text-xs rounded-xl px-2.5 py-1.5 border font-semibold ${
                    isLight
                      ? 'bg-white border-stone-300 text-stone-800'
                      : 'bg-stone-950 border-stone-700 text-stone-200'
                  }`}
                >
                  <option value="">Nessun ordine allegato</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      Ordine #{o.id} (€{o.total.toFixed(2)})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[380px] min-h-[280px]">
              {messages.map((m) => {
                const isClient = m.sender === 'cliente';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        isClient
                          ? 'bg-amber-500 text-stone-950 font-medium rounded-br-xs'
                          : isLight
                          ? 'bg-stone-100 text-stone-800 border border-stone-200 rounded-bl-xs'
                          : 'bg-stone-800 text-stone-100 border border-stone-700 rounded-bl-xs'
                      }`}
                    >
                      <div className="text-[10px] font-bold opacity-75 mb-0.5">
                        {isClient ? customerName : '🔥 Bottega Braciami Ancora (Cento)'}
                      </div>
                      <p>{m.text}</p>
                      {m.meetLink && (
                        <a
                          href={m.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-950 text-amber-400 text-xs font-bold hover:underline"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Entra nella stanza Google Meet</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400 mt-0.5 px-1 font-mono">
                      {new Date(m.timestamp).toLocaleTimeString('it-IT', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Quick Chat Prompts */}
            <div className="px-4 py-2 border-t border-stone-200 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                'Vorrei un consiglio sul taglio Fiorentina Dry-Aged',
                'Posso richiedere il sottovuoto da viaggio?',
                'A che ora è pronto il mio ordine?'
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setInputText(q)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-100 hover:bg-amber-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 whitespace-nowrap cursor-pointer transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat Input Form */}
            <form
              onSubmit={handleSendChat}
              className="p-3 sm:p-4 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={uiText(
                  'support_chat_placeholder',
                  'Scrivi un messaggio a Manuel e Samanta...'
                )}
                className={`flex-1 min-w-0 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  isLight
                    ? 'bg-stone-50 border-stone-300 text-stone-900'
                    : 'bg-stone-950 border-stone-700 text-stone-100'
                }`}
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>{uiText('btn_send_chat', 'Invia')}</span>
              </button>
            </form>
          </div>

          {/* Right 5 Cols: Google Meet Live Video Consultation Card */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className={`rounded-3xl border p-5 sm:p-6 shadow-sm space-y-4 ${
                isLight ? 'bg-white border-stone-200' : 'bg-stone-900 border-stone-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                    Servizio Esclusivo Live Banco
                  </span>
                  <h2 className="font-display text-lg font-bold">
                    {uiText('support_meet_title', 'Collegamento Video Google Meet')}
                  </h2>
                </div>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Vuoi scegliere dal vivo la marezzatura della tua Costata o vedere i prodotti freschi di giornata sul banco di Via Penzale 25 a Cento? Avvia o prenota un collegamento <strong>Google Meet</strong> diretto con noi.
              </p>

              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Motivo del collegamento video
                  </label>
                  <select
                    value={meetTopic}
                    onChange={(e) => setMeetTopic(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border ${
                      isLight
                        ? 'bg-stone-50 border-stone-300 text-stone-900'
                        : 'bg-stone-950 border-stone-700 text-stone-100'
                    }`}
                  >
                    <option value="Scelta taglio in diretta al banco carni">
                      🥩 Scelta taglio in diretta al banco carni
                    </option>
                    <option value="Consulenza cottura su brace e preparazione">
                      🔥 Consulenza cottura su brace e preparazione
                    </option>
                    <option value="Composizione cesto regalo / spedizione Europa">
                      🎁 Composizione cesto regalo / spedizione Europa
                    </option>
                    <option value="Verifica ordine e assistenza post-vendita">
                      📦 Verifica ordine e assistenza post-vendita
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Quando vuoi collegarti?</span>
                  </label>
                  <select
                    value={meetSlot}
                    onChange={(e) => setMeetSlot(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border ${
                      isLight
                        ? 'bg-stone-50 border-stone-300 text-stone-900'
                        : 'bg-stone-950 border-stone-700 text-stone-100'
                    }`}
                  >
                    <option value="Subito (In diretta ora)">⚡ Subito (In diretta ora dal banco)</option>
                    <option value="Oggi 11:30 - 12:30">🕚 Oggi 11:30 - 12:30</option>
                    <option value="Oggi 17:00 - 18:30">🕔 Oggi 17:00 - 18:30</option>
                    <option value="Domani mattina 10:00 - 12:00">📅 Domani mattina 10:00 - 12:00</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleRequestGoogleMeet}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Video className="w-4 h-4 shrink-0" />
                  <span>{uiText('btn_video_consultation', 'Avvia Collegamento Google Meet')}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </button>

                {activeMeetUrl && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Stanza Google Meet pronta e notificata in Bottega!</span>
                    </div>
                    <a
                      href={activeMeetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-bold text-emerald-700 dark:text-emerald-300 shrink-0"
                    >
                      Riapri Meet
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Direct Phone & Address Card */}
            <div
              className={`rounded-3xl border p-5 space-y-2.5 ${
                isLight ? 'bg-amber-50/70 border-amber-200' : 'bg-stone-900/70 border-stone-800'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400">
                <PhoneCall className="w-4 h-4" />
                <span>Recapito Telefonico Diretto Bottega</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Via Penzale 25, 44042 Cento FE · Tel:{' '}
                <a href="tel:+390516831000" className="font-bold underline">
                  +39 051 6831000
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

