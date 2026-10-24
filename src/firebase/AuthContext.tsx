import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {
  User,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import { auth, db, OAuthProviderId } from './firebase';
import { handleFirestoreError, OperationType } from './errors';
import { UserData } from '../types';
import { SEED_USERS } from '../data/seedData';
import { inMemSql } from '../db/sqlite';
import { useI18n } from '../i18n/I18nContext';
import { Language } from '../i18n/translations';
import { ComuneIstat, COMUNI_ISTAT } from '../data/comuniIstatData';
import { ComuneIstatPicker } from '../components/ComuneIstatPicker';
import {
  calcolaCodiceFiscale,
  validaCodiceFiscale
} from '../utils/codiceFiscale';
import { X, CheckCircle2, AlertCircle, Clock, Mail, ArrowRight, ShieldCheck, UserPlus, Sparkles } from 'lucide-react';

interface PendingOtpSession {
  email: string;
  providerId: OAuthProviderId;
  providerName: string;
  otpCode: string; // 5 digits
  token: string;
  expiresAt: number; // Date.now() + 5 * 60 * 1000 (5 minutes)
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  profile: UserData | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithProvider: (providerId: OAuthProviderId) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  updateProfileData: (data: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_AUTH_STORAGE_KEY = 'braciami_google_auth_session_v1';
const REGISTERED_USERS_REGISTRY_KEY = 'braciami_registered_users_registry_v1';
const PENDING_OTP_SESSION_KEY = 'braciami_pending_oauth_otp_v1';

export const ADMIN_EMAILS = [
  'diego.cimarosa@gmail.com',
  'diegocimarosa@gmail.com',
  'samantamanderioli083@gmail.com',
  'manuel.cannata@braciamiancora.it'
];

interface ProviderBrandConfig {
  id: OAuthProviderId;
  name: string;
  accentColor: string;
  defaultDomain: string;
  logoSvg: string;
}

const PROVIDER_BRANDS: Record<OAuthProviderId, ProviderBrandConfig> = {
  google: {
    id: 'google',
    name: 'Google',
    accentColor: '#1a73e8',
    defaultDomain: 'gmail.com',
    logoSvg: `<svg width="26" height="26" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>`
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    accentColor: '#1877F2',
    defaultDomain: 'gmail.com',
    logoSvg: `<svg width="26" height="26" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
  },
  apple: {
    id: 'apple',
    name: 'Apple',
    accentColor: '#111111',
    defaultDomain: 'icloud.com',
    logoSvg: `<svg width="26" height="26" viewBox="0 0 24 24"><path fill="#111111" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>`
  },
  microsoft: {
    id: 'microsoft',
    name: 'Microsoft',
    accentColor: '#0067b8',
    defaultDomain: 'outlook.com',
    logoSvg: `<svg width="24" height="24" viewBox="0 0 24 24"><path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#7FBA00" d="M13 1h10v10H13z"/><path fill="#00A4EF" d="M1 13h10v10H1z"/><path fill="#FFB900" d="M13 13h10v10H13z"/></svg>`
  },
  twitter: {
    id: 'twitter',
    name: 'X (Twitter)',
    accentColor: '#0f1419',
    defaultDomain: 'gmail.com',
    logoSvg: `<svg width="24" height="24" viewBox="0 0 24 24"><path fill="#0f1419" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
  },
  yahoo: {
    id: 'yahoo',
    name: 'Yahoo',
    accentColor: '#6001D2',
    defaultDomain: 'yahoo.it',
    logoSvg: `<svg width="26" height="26" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#6001D2"/><path fill="#FFFFFF" d="M7.2 6.8h2.6l2.1 4.4 2.1-4.4h2.5l-3.4 6.7v4.1h-2.4v-4.1L7.2 6.8zm9.7 8.5a1.4 1.4 0 110 2.8 1.4 1.4 0 010-2.8z"/></svg>`
  },
  github: {
    id: 'github',
    name: 'GitHub',
    accentColor: '#24292f',
    defaultDomain: 'gmail.com',
    logoSvg: `<svg width="26" height="26" viewBox="0 0 24 24"><path fill="#24292f" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 015.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.27 5.67.41.36.78 1.07.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.51 11.51 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>`
  }
};

export const EUROPEAN_COUNTRY_CODES = new Set([
  'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 
  'FR', 'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 
  'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK',
  'IS', 'LI', 'NO', 'CH', 'GB', 'AL', 'AD', 'BA', 'ME', 'MK', 'RS', 'SM', 'VA', 'MC'
]);

interface OtpFlowI18nStrings {
  otpEmailSubject: (provider: string) => string;
  otpMessagePrefix: (provider: string) => string;
  otpMessageLinkText: string;
  otpMessageSuffix: string;
  enterOtpTitle: string;
  otpExpired: string;
  otpMismatch: string;
  panelTitle: (provider: string) => string;
  enterEmailTitle: (provider: string) => string;
  continueBtn: string;
  verifyOtpBtn: string;
  registerAndLoginBtn: string;
  timeRemainingLabel: string;
  genderLabel: string;
  genderMale: string;
  genderFemale: string;
  passportLabel: string;
  extraEuTaxIdLabel: string;
  calculateCfBtn: string;
}

const OTP_I18N: Record<Language, OtpFlowI18nStrings> = {
  it_IT: {
    otpEmailSubject: (p) => `Conferma registrazione con ${p} - Braciami Ancora Cento`,
    otpMessagePrefix: (p) => `Per confermare registrazione con ${p} clicca `,
    otpMessageLinkText: 'QUI',
    otpMessageSuffix: ' per inserire il codice OTP',
    enterOtpTitle: 'Inserisci il codice OTP ricevuto',
    otpExpired: 'Codice OTP o link scaduto (tempo massimo 5 minuti). Richiedi un nuovo codice.',
    otpMismatch: 'Codice OTP errato. Inserisci esattamente le 5 cifre ricevute.',
    panelTitle: (p) => `Accedi con ${p}`,
    enterEmailTitle: (p) => `Inserisci la tua email per autenticarti con ${p}`,
    continueBtn: 'Continua',
    verifyOtpBtn: 'Verifica Codice OTP',
    registerAndLoginBtn: 'Registra su Firebase ed Accedi',
    timeRemainingLabel: 'Tempo rimanente:',
    genderLabel: 'Sesso (M/F)',
    genderMale: 'M (Maschio)',
    genderFemale: 'F (Femmina)',
    passportLabel: 'Numero passaporto',
    extraEuTaxIdLabel: 'Codice Fiscale Extra-UE (Fisso)',
    calculateCfBtn: 'Calcola Codice Fiscale dai dati'
  },
  en_US: {
    otpEmailSubject: (p) => `Confirm registration with ${p} - Braciami Ancora Cento`,
    otpMessagePrefix: (p) => `To confirm registration with ${p} click `,
    otpMessageLinkText: 'HERE',
    otpMessageSuffix: ' to enter the OTP code',
    enterOtpTitle: 'Enter the received OTP code',
    otpExpired: 'OTP code or link expired (5 minutes limit). Please request a new code.',
    otpMismatch: 'Incorrect OTP code. Please enter the exact 5 digits received.',
    panelTitle: (p) => `Sign in with ${p}`,
    enterEmailTitle: (p) => `Enter your email to authenticate with ${p}`,
    continueBtn: 'Continue',
    verifyOtpBtn: 'Verify OTP Code',
    registerAndLoginBtn: 'Register on Firebase & Sign in',
    timeRemainingLabel: 'Time remaining:',
    genderLabel: 'Gender (M/F)',
    genderMale: 'M (Male)',
    genderFemale: 'F (Female)',
    passportLabel: 'Passport number',
    extraEuTaxIdLabel: 'Extra-EU Tax Code (Fixed)',
    calculateCfBtn: 'Calculate Tax Code from data'
  },
  de_DE: {
    otpEmailSubject: (p) => `Registrierung mit ${p} bestätigen - Braciami Ancora`,
    otpMessagePrefix: (p) => `Um die Registrierung mit ${p} zu bestätigen, klicken Sie `,
    otpMessageLinkText: 'HIER',
    otpMessageSuffix: ', um den OTP-Code einzugeben',
    enterOtpTitle: 'Geben Sie den erhaltenen OTP-Code ein',
    otpExpired: 'OTP-Code oder Link abgelaufen (Gültigkeit 5 Minuten). Neuen Code anfordern.',
    otpMismatch: 'Falscher OTP-Code. Bitte geben Sie genau die 5 Ziffern ein.',
    panelTitle: (p) => `Anmelden mit ${p}`,
    enterEmailTitle: (p) => `Geben Sie Ihre E-Mail ein, um sich mit ${p} zu authentifizieren`,
    continueBtn: 'Weiter',
    verifyOtpBtn: 'OTP-Code überprüfen',
    registerAndLoginBtn: 'Auf Firebase registrieren & Anmelden',
    timeRemainingLabel: 'Verbleibende Zeit:',
    genderLabel: 'Geschlecht (M/W)',
    genderMale: 'M (Männlich)',
    genderFemale: 'W (Weiblich)',
    passportLabel: 'Passnummer',
    extraEuTaxIdLabel: 'Nicht-EU-Steuernummer (Fest)',
    calculateCfBtn: 'Steuercode aus Daten berechnen'
  },
  fr_FR: {
    otpEmailSubject: (p) => `Confirmer l'inscription avec ${p} - Braciami Ancora`,
    otpMessagePrefix: (p) => `Pour confirmer l'inscription avec ${p} cliquez `,
    otpMessageLinkText: 'ICI',
    otpMessageSuffix: ' pour saisir le code OTP',
    enterOtpTitle: 'Saisissez le code OTP reçu',
    otpExpired: 'Code OTP ou lien expiré (délai de 5 minutes). Demandez un nouveau code.',
    otpMismatch: 'Code OTP incorrect. Veuillez entrer exactement les 5 chiffres reçus.',
    panelTitle: (p) => `Se connecter avec ${p}`,
    enterEmailTitle: (p) => `Entrez votre e-mail pour vous authentifier avec ${p}`,
    continueBtn: 'Continuer',
    verifyOtpBtn: 'Vérifier le code OTP',
    registerAndLoginBtn: 'Enregistrer sur Firebase & Se connecter',
    timeRemainingLabel: 'Temps restant :',
    genderLabel: 'Genre (M/F)',
    genderMale: 'M (Homme)',
    genderFemale: 'F (Femme)',
    passportLabel: 'Numéro de passeport',
    extraEuTaxIdLabel: 'Code Fiscal Hors-UE (Fixe)',
    calculateCfBtn: 'Calculer le code fiscal'
  },
  es_ES: {
    otpEmailSubject: (p) => `Confirmar registro con ${p} - Braciami Ancora`,
    otpMessagePrefix: (p) => `Para confirmar el registro con ${p} haz clic `,
    otpMessageLinkText: 'AQUÍ',
    otpMessageSuffix: ' para introducir el código OTP',
    enterOtpTitle: 'Introduce el código OTP recibido',
    otpExpired: 'Código o enlace OTP caducado (límite de 5 minutos). Solicita un nuevo código.',
    otpMismatch: 'Código OTP incorrecto. Introduce exactamente los 5 dígitos recibidos.',
    panelTitle: (p) => `Iniciar sesión con ${p}`,
    enterEmailTitle: (p) => `Introduce tu correo para autenticarte con ${p}`,
    continueBtn: 'Continuar',
    verifyOtpBtn: 'Verificar código OTP',
    registerAndLoginBtn: 'Registrar en Firebase e Iniciar sesión',
    timeRemainingLabel: 'Tiempo restante:',
    genderLabel: 'Sexo (M/F)',
    genderMale: 'M (Masculino)',
    genderFemale: 'F (Femenino)',
    passportLabel: 'Número de pasaporte',
    extraEuTaxIdLabel: 'Código Fiscal Extra-UE (Fijo)',
    calculateCfBtn: 'Calcular código fiscal'
  },
  nl_NL: {
    otpEmailSubject: (p) => `Bevestig registratie met ${p} - Braciami Ancora`,
    otpMessagePrefix: (p) => `Om de registratie met ${p} te bevestigen, klik `,
    otpMessageLinkText: 'HIER',
    otpMessageSuffix: ' om de OTP-code in te voeren',
    enterOtpTitle: 'Voer de ontvangen OTP-code in',
    otpExpired: 'OTP-code of link verlopen (5 minuten limiet). Vraag een nieuwe code aan.',
    otpMismatch: 'Onjuiste OTP-code. Voer exact de 5 ontvangen cijfers in.',
    panelTitle: (p) => `Inloggen met ${p}`,
    enterEmailTitle: (p) => `Voer uw e-mailadres in om in te loggen met ${p}`,
    continueBtn: 'Doorgaan',
    verifyOtpBtn: 'OTP-code verifiëren',
    registerAndLoginBtn: 'Registreren op Firebase & Inloggen',
    timeRemainingLabel: 'Resterende tijd:',
    genderLabel: 'Geslacht (M/V)',
    genderMale: 'M (Man)',
    genderFemale: 'V (Vrouw)',
    passportLabel: 'Paspoortnummer',
    extraEuTaxIdLabel: 'Niet-EU Fiscaal Nummer (Vast)',
    calculateCfBtn: 'Bereken fiscaal nummer'
  },
  sv_SE: {
    otpEmailSubject: (p) => `Bekräfta registrering med ${p} - Braciami Ancora`,
    otpMessagePrefix: (p) => `För att bekräfta registreringen med ${p} klicka `,
    otpMessageLinkText: 'HÄR',
    otpMessageSuffix: ' för att ange OTP-koden',
    enterOtpTitle: 'Ange den mottagna OTP-koden',
    otpExpired: 'OTP-kod eller länk har gått ut (5 minuters giltighet). Begär en ny kod.',
    otpMismatch: 'Felaktig OTP-kod. Ange exakt de 5 mottagna siffrorna.',
    panelTitle: (p) => `Logga in med ${p}`,
    enterEmailTitle: (p) => `Ange din e-post för att logga in med ${p}`,
    continueBtn: 'Fortsätt',
    verifyOtpBtn: 'Verifiera OTP-kod',
    registerAndLoginBtn: 'Registrera på Firebase & Logga in',
    timeRemainingLabel: 'Återstående tid:',
    genderLabel: 'Kön (M/K)',
    genderMale: 'M (Man)',
    genderFemale: 'K (Kvinna)',
    passportLabel: 'Passnummer',
    extraEuTaxIdLabel: 'Icke-EU Skattekod (Fast)',
    calculateCfBtn: 'Beräkna skattekod'
  },
  zh_CN: {
    otpEmailSubject: (p) => `确认通过 ${p} 注册 - Braciami Ancora`,
    otpMessagePrefix: (p) => `要确认通过 ${p} 注册，请点击`,
    otpMessageLinkText: '此处',
    otpMessageSuffix: '输入 OTP 验证码',
    enterOtpTitle: '输入收到的 OTP 验证码',
    otpExpired: '验证码或链接已过期（限时 5 分钟）。请重新获取验证码。',
    otpMismatch: '验证码不正确。请输入收到的 5 位数字。',
    panelTitle: (p) => `通过 ${p} 登录`,
    enterEmailTitle: (p) => `输入您的邮箱以通过 ${p} 登录`,
    continueBtn: '继续',
    verifyOtpBtn: '验证 OTP 验证码',
    registerAndLoginBtn: '在 Firebase 上注册并登录',
    timeRemainingLabel: '剩余时间：',
    genderLabel: '性别 (男/女)',
    genderMale: '男 (M)',
    genderFemale: '女 (F)',
    passportLabel: '护照号码',
    extraEuTaxIdLabel: '非欧盟税务代码（固定）',
    calculateCfBtn: '根据数据计算税号'
  },
  ja_JP: {
    otpEmailSubject: (p) => `${p} での登録確認 - Braciami Ancora`,
    otpMessagePrefix: (p) => `${p} での登録を確認するには、`,
    otpMessageLinkText: 'ここをクリック',
    otpMessageSuffix: 'してOTPコードを入力してください',
    enterOtpTitle: '受信したOTPコードを入力してください',
    otpExpired: 'OTPコードまたはリンクの有効期限（5分）が切れました。再リクエストしてください。',
    otpMismatch: 'OTPコードが一致しません。5桁の番号を正しく入力してください。',
    panelTitle: (p) => `${p} でログイン`,
    enterEmailTitle: (p) => `${p} でログインするためのメールアドレスを入力`,
    continueBtn: '次へ',
    verifyOtpBtn: 'OTPコードを確認',
    registerAndLoginBtn: 'Firebaseに本登録してログイン',
    timeRemainingLabel: '残り時間：',
    genderLabel: '性別 (男/女)',
    genderMale: '男 (M)',
    genderFemale: '女 (F)',
    passportLabel: 'パスポート番号',
    extraEuTaxIdLabel: 'EU外納税者番号（固定）',
    calculateCfBtn: 'データから納税番号を計算'
  },
  ru_RU: {
    otpEmailSubject: (p) => `Подтверждение регистрации через ${p} - Braciami Ancora`,
    otpMessagePrefix: (p) => `Для подтверждения регистрации через ${p} нажмите `,
    otpMessageLinkText: 'ЗДЕСЬ',
    otpMessageSuffix: ', чтобы ввести код OTP',
    enterOtpTitle: 'Введите полученный код OTP',
    otpExpired: 'Срок действия кода или ссылки OTP истек (5 минут). Запросите новый код.',
    otpMismatch: 'Неверный код OTP. Введите ровно 5 полученных цифр.',
    panelTitle: (p) => `Войти через ${p}`,
    enterEmailTitle: (p) => `Введите ваш email для входа через ${p}`,
    continueBtn: 'Продолжить',
    verifyOtpBtn: 'Проверить код OTP',
    registerAndLoginBtn: 'Зарегистрироваться в Firebase и войти',
    timeRemainingLabel: 'Оставшееся время:',
    genderLabel: 'Пол (М/Ж)',
    genderMale: 'М (Мужской)',
    genderFemale: 'Ж (Женский)',
    passportLabel: 'Номер паспорта',
    extraEuTaxIdLabel: 'Налоговый код вне ЕС (Фиксированный)',
    calculateCfBtn: 'Рассчитать налоговый код'
  },
  ar_SA: {
    otpEmailSubject: (p) => `تأكيد التسجيل عبر ${p} - Braciami Ancora`,
    otpMessagePrefix: (p) => `لتأكيد التسجيل عبر ${p} انقر `,
    otpMessageLinkText: 'هنا',
    otpMessageSuffix: ' لإدخال رمز OTP',
    enterOtpTitle: 'أدخل رمز OTP المستلم',
    otpExpired: 'انتهت صلاحية رمز OTP أو الرابط (5 دقائق). يرجى طلب رمز جديد.',
    otpMismatch: 'رمز OTP غير صحيح. يرجى إدخال الأرقام الـ 5 بدقة.',
    panelTitle: (p) => `تسجيل الدخول عبر ${p}`,
    enterEmailTitle: (p) => `أدخل بريدك الإلكتروني لتسجيل الدخول عبر ${p}`,
    continueBtn: 'متابعة',
    verifyOtpBtn: 'التحقق من رمز OTP',
    registerAndLoginBtn: 'التسجيل في Firebase وتسجيل الدخول',
    timeRemainingLabel: 'الوقت المتبقي:',
    genderLabel: 'الجنس (ذكر/أنثى)',
    genderMale: 'ذكر (M)',
    genderFemale: 'أنثى (F)',
    passportLabel: 'رقم جواز السفر',
    extraEuTaxIdLabel: 'الرمز الضريبي خارج الاتحاد الأوروبي (ثابت)',
    calculateCfBtn: 'حساب الرقم الضريبي'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, detectedCountry } = useI18n();
  const i18n = OTP_I18N[language] || OTP_I18N.it_IT;

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Flow State: null | 'enter_email' | 'message_sent' | 'verify_otp'
  const [activeProviderId, setActiveProviderId] = useState<OAuthProviderId | null>(null);
  const [flowStep, setFlowStep] = useState<'enter_email' | 'message_sent' | 'verify_otp' | null>(null);
  const [inputEmail, setInputEmail] = useState('');
  const [pendingOtp, setPendingOtp] = useState<PendingOtpSession | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(300);

  // Registration Form State (rendered EMPTY ONLY after OTP is confirmed)
  const [isOtpConfirmed, setIsOtpConfirmed] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('IT');

  // Fields:
  const [formNome, setFormNome] = useState('');
  const [formCognome, setFormCognome] = useState('');
  const [formSesso, setFormSesso] = useState<'M' | 'F'>('M');
  const [formDataNascita, setFormDataNascita] = useState('');
  const [formCodiceFiscale, setFormCodiceFiscale] = useState('');
  const [formNumeroPassaporto, setFormNumeroPassaporto] = useState('');

  // Italy specific:
  const [formComuneNascita, setFormComuneNascita] = useState('');
  const [formProvinciaNascita, setFormProvinciaNascita] = useState('');
  const [formCodiceCatastaleNascita, setFormCodiceCatastaleNascita] = useState('');
  const [formIndirizzoResidenza, setFormIndirizzoResidenza] = useState('');
  const [formComuneResidenza, setFormComuneResidenza] = useState('');
  const [formProvinciaResidenza, setFormProvinciaResidenza] = useState('');
  const [formCapResidenza, setFormCapResidenza] = useState('');
  const [availableCaps, setAvailableCaps] = useState<string[]>([]);

  // Foreign specific:
  const [formForeignCitta, setFormForeignCitta] = useState('');
  const [formForeignStato, setFormForeignStato] = useState('');

  const pendingResolveRef = useRef<(() => void) | null>(null);

  // URL check for link "QUI" opened from external mail client
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const verifyToken = params.get('oauth_otp_token');
    const tokenEmail = params.get('email');
    const tokenProvider = params.get('provider') as OAuthProviderId | null;

    if (verifyToken && tokenEmail) {
      try {
        let raw = sessionStorage.getItem(PENDING_OTP_SESSION_KEY);
        if (!raw) {
          raw = localStorage.getItem(PENDING_OTP_SESSION_KEY);
        }
        if (raw) {
          const session: PendingOtpSession = JSON.parse(raw);
          if (
            session &&
            (session.token === verifyToken || session.email.toLowerCase() === tokenEmail.toLowerCase())
          ) {
            if (Date.now() <= session.expiresAt) {
              setPendingOtp(session);
              setActiveProviderId(session.providerId || tokenProvider || 'google');
              setInputEmail(session.email);
              setFlowStep('verify_otp');
            }
          }
        }
      } catch {}
    }
  }, []);

  // 5-minute Countdown Timer
  useEffect(() => {
    if (!pendingOtp || flowStep === null) return;
    const interval = setInterval(() => {
      const remainingMs = pendingOtp.expiresAt - Date.now();
      const sec = Math.max(0, Math.floor(remainingMs / 1000));
      setTimeLeftSec(sec);
      if (sec <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [pendingOtp, flowStep]);

  const buildLocalProfile = (uid: string, email: string, displayName: string): UserData => {
    const isEmailAdmin = ADMIN_EMAILS.some((adm) => adm.toLowerCase() === email.toLowerCase());
    const nameParts = (displayName || 'Cliente Centese').split(' ');
    const nome = nameParts[0] || 'Cliente';
    const cognome = nameParts.slice(1).join(' ') || 'Centese';
    return {
      uid,
      nome,
      cognome,
      data_nascita: '1988-05-14',
      codice_fiscale: 'CENTO' + Math.floor(1000000000 + Math.random() * 9000000000),
      indirizzo: 'Via Penzale',
      numero_civico: '25',
      cap: '44042',
      provincia: 'FE',
      codice_nazione: 'IT',
      email,
      telefono: '+39 340 0000000',
      note: isEmailAdmin ? 'Amministratore di sistema e gestione bottega' : 'Cliente registrato online',
      tipo_utente: isEmailAdmin ? 1 : 0,
      punti_fedelta: isEmailAdmin ? 950 : 250,
      loyaltyPoints: isEmailAdmin ? 950 : 250,
      totale_speso: isEmailAdmin ? 1200.0 : 145.0,
      numero_ordini: isEmailAdmin ? 15 : 3,
      is_otp_guest: false,
      createdAt: new Date().toISOString()
    };
  };

  // Restore authenticated session on boot
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const path = `users/${currentUser.uid}`;

        const isEmailAdmin = Boolean(
          currentUser.email &&
          ADMIN_EMAILS.some((adm) => adm.toLowerCase() === currentUser.email!.toLowerCase())
        );

        try {
          const snapshot = await getDoc(userDocRef);
          if (snapshot.exists()) {
            const data = snapshot.data() as UserData;
            if (isEmailAdmin && data.tipo_utente !== 1) {
              data.tipo_utente = 1;
              await setDoc(userDocRef, { tipo_utente: 1 }, { merge: true });
            }
            setProfile(data);
          } else {
            const newProfile = buildLocalProfile(
              currentUser.uid,
              currentUser.email || '',
              currentUser.displayName || 'Cliente Centese'
            );
            await setDoc(userDocRef, newProfile);
            if (isEmailAdmin) {
              const adminRef = doc(db, 'admins', currentUser.uid);
              await setDoc(adminRef, { uid: currentUser.uid, email: currentUser.email, role: 'admin' }, { merge: true });
            }
            setProfile(newProfile);
          }
        } catch {
          setProfile(
            buildLocalProfile(
              currentUser.uid,
              currentUser.email || '',
              currentUser.displayName || 'Cliente Centese'
            )
          );
        }

        const unsubscribeProfile = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setProfile(docSnap.data() as UserData);
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, path);
          }
        );

        setLoading(false);
        return () => unsubscribeProfile();
      } else {
        try {
          const savedRaw = localStorage.getItem(LOCAL_AUTH_STORAGE_KEY);
          if (savedRaw) {
            const saved = JSON.parse(savedRaw);
            if (saved && saved.email) {
              const fakeUser = {
                uid: saved.uid || 'google_' + saved.email.replace(/[^a-zA-Z0-9]/g, '_'),
                email: saved.email,
                displayName: saved.displayName || saved.email.split('@')[0],
                photoURL: saved.photoURL || null
              } as User;
              setUser(fakeUser);
              setProfile(saved.profile || buildLocalProfile(fakeUser.uid, saved.email, fakeUser.displayName || ''));
              setLoading(false);
              return;
            }
          }
        } catch {}

        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  /**
   * Helper strictly in READ-ONLY mode:
   * Checks whether the email is already registered anywhere in the system.
   * NO writes to Firebase in this function!
   */
  const checkIfEmailAlreadyRegistered = async (
    email: string
  ): Promise<{ registered: boolean; profile?: UserData }> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check Seed Users
    const seedMatch = SEED_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
    if (seedMatch) return { registered: true, profile: seedMatch };

    // 2. Check Admin Emails
    if (ADMIN_EMAILS.some((adm) => adm.toLowerCase() === cleanEmail)) {
      const adminProfile = buildLocalProfile('admin_' + cleanEmail.replace(/[^a-z0-9]/g, '_'), cleanEmail, cleanEmail.split('@')[0]);
      adminProfile.tipo_utente = 1;
      return { registered: true, profile: adminProfile };
    }

    // 3. Check SQLite CRM Customers
    const sqlCust = inMemSql.findCustomer(cleanEmail);
    if (sqlCust && sqlCust.is_registered) {
      const p = buildLocalProfile(sqlCust.id, cleanEmail, sqlCust.full_name);
      p.telefono = sqlCust.phone;
      p.indirizzo = sqlCust.address;
      p.cap = sqlCust.cap;
      p.provincia = sqlCust.province;
      return { registered: true, profile: p };
    }

    // 4. Check Local Registry of Verified Users
    try {
      const regRaw = localStorage.getItem(REGISTERED_USERS_REGISTRY_KEY);
      if (regRaw) {
        const regList: UserData[] = JSON.parse(regRaw);
        const match = regList.find((u) => u.email.toLowerCase() === cleanEmail);
        if (match) return { registered: true, profile: match };
      }
    } catch {}

    // 5. Check Firebase Firestore (Read-only query)
    try {
      const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docData = snap.docs[0].data() as UserData;
        return { registered: true, profile: docData };
      }
    } catch {}

    return { registered: false };
  };

  /**
   * Completes sign in with an already registered profile.
   */
  const logInWithExistingRegisteredProfile = async (
    providerId: OAuthProviderId,
    existingProfile: UserData
  ) => {
    const simulatedUser = {
      uid: existingProfile.uid,
      email: existingProfile.email,
      displayName: `${existingProfile.nome} ${existingProfile.cognome}`.trim(),
      photoURL: null
    } as User;

    setUser(simulatedUser);
    setProfile(existingProfile);
    closeFlow();

    try {
      localStorage.setItem(
        LOCAL_AUTH_STORAGE_KEY,
        JSON.stringify({
          uid: existingProfile.uid,
          email: existingProfile.email,
          displayName: simulatedUser.displayName,
          providerId,
          profile: existingProfile
        })
      );
    } catch {}

    if (pendingResolveRef.current) {
      pendingResolveRef.current();
      pendingResolveRef.current = null;
    }
  };

  /**
   * STEP 1 -> STEP 2:
   * The user enters their email for the chosen provider.
   * If already registered: proceed with OAuth directly.
   * If not registered: generate 5-digit OTP (expires in 5 minutes) and send REAL email.
   * ZERO writes to Firebase in this step (anti-hacker protection)!
   */
  const handleEmailSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = inputEmail.trim().toLowerCase();
    if (!cleanEmail || !activeProviderId) return;

    const brand = PROVIDER_BRANDS[activeProviderId];

    // Check if already registered
    const { registered, profile: existingProfile } = await checkIfEmailAlreadyRegistered(cleanEmail);

    if (registered && existingProfile) {
      // Step 2: Already registered -> proceed with OAuth directly
      await logInWithExistingRegisteredProfile(activeProviderId, existingProfile);
      return;
    }

    // Step 3: Not registered yet -> Generate random 5-digit OTP
    const randomOtp = Math.floor(10000 + Math.random() * 90000).toString(); // 5 digits
    const token = `tok_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    const session: PendingOtpSession = {
      email: cleanEmail,
      providerId: activeProviderId,
      providerName: brand.name,
      otpCode: randomOtp,
      token,
      expiresAt,
      createdAt: Date.now()
    };

    setPendingOtp(session);
    setTimeLeftSec(300);
    setOtpError(null);
    setEnteredOtp('');
    setIsOtpConfirmed(false);

    // Reset registration form fields to empty and pre-set country from request
    setFormNome('');
    setFormCognome('');
    setFormSesso('M');
    setFormDataNascita('');
    setFormCodiceFiscale('');
    setFormNumeroPassaporto('');
    setFormComuneNascita('');
    setFormProvinciaNascita('');
    setFormCodiceCatastaleNascita('');
    setFormIndirizzoResidenza('');
    setFormComuneResidenza('');
    setFormProvinciaResidenza('');
    setFormCapResidenza('');
    setAvailableCaps([]);
    setFormForeignCitta('');
    setFormForeignStato('');

    // Pre-set country based on request
    const initCountry = detectedCountry && detectedCountry.length === 2 ? detectedCountry.toUpperCase() : 'IT';
    setSelectedCountry(initCountry);
    if (!EUROPEAN_COUNTRY_CODES.has(initCountry) && initCountry !== 'IT') {
      setFormCodiceFiscale('0099999999999');
    }

    // Save in sessionStorage and localStorage for multi-tab/mail-link continuity
    try {
      sessionStorage.setItem(PENDING_OTP_SESSION_KEY, JSON.stringify(session));
      localStorage.setItem(PENDING_OTP_SESSION_KEY, JSON.stringify(session));
    } catch {}

    const verifyUrl = `${window.location.origin}/?oauth_otp_token=${token}&provider=${activeProviderId}&email=${encodeURIComponent(cleanEmail)}`;

    // 1. Fetch text template from Firebase collection "config", document "otp", field "testo"
    const DEFAULT_OTP_TEMPLATE = "Caro $email, per confermare l'accesso con il tuo provider $provider, inserisci il codice nnnnn";
    let otpTemplate = DEFAULT_OTP_TEMPLATE;
    try {
      const otpConfigRef = doc(db, 'config', 'otp');
      const otpSnap = await getDoc(otpConfigRef);
      if (otpSnap.exists() && otpSnap.data()?.testo) {
        otpTemplate = String(otpSnap.data().testo)
          .replace(/\s*cliccando\s*QUI/gi, '')
          .replace(/\s*cliccando\s*\[QUI\]/gi, '');
      }
      await setDoc(
        otpConfigRef,
        {
          testo: DEFAULT_OTP_TEMPLATE,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Notice loading config/otp from Firestore:', err);
    }

    // Sostituzione variabili: $email, $provider, nnnnn (SENZA LINK CLICCANDO QUI)
    const emailBodyFormatted = otpTemplate
      .replace(/\$email/g, cleanEmail)
      .replace(/\$provider/g, brand.name)
      .replace(/nnnnn/g, randomOtp)
      .replace(/\$otp/g, randomOtp)
      .replace(/\s*cliccando\s*QUI/gi, '')
      .replace(/\s*cliccando\s*\[QUI\]/gi, '');

    // Real Email Dispatch via /api/send-oauth-otp-email using Authenticated Gmail SMTP
    const subject = i18n.otpEmailSubject(brand.name);
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Conferma Accesso Braciami Ancora</title>
      </head>
      <body style="margin:0;padding:24px;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
          <div style="background:linear-gradient(135deg,#78350f,#b45309);padding:22px;text-align:center;color:#ffffff;">
            <h2 style="margin:0;font-size:22px;font-weight:800;letter-spacing:0.5px;">Braciami Ancora · Cento (FE)</h2>
            <p style="margin:4px 0 0 0;font-size:13px;opacity:0.9;">Spaccio Carni, Salumi e Formaggi di Filiera</p>
          </div>
          <div style="padding:28px 24px;">
            <div style="font-size:16px;color:#1e293b;line-height:1.7;background:#fffbeb;border:1px solid #fde68a;border-radius:14px;padding:22px;">
              ${emailBodyFormatted}
            </div>
            <div style="margin-top:22px;text-align:center;font-size:12px;color:#64748b;line-height:1.5;">
              Questo codice è valido per <strong>5 minuti</strong>.<br/>
              Se non hai effettuato tu questa richiesta, puoi ignorare questo messaggio.
            </div>
          </div>
          <div style="background:#f1f5f9;padding:12px 20px;text-align:center;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;">
            Braciami Ancora · Via Penzale 25, 44042 Cento (FE) · Tel. +39 051 683 1234
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await fetch('/api/send-oauth-otp-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: cleanEmail,
          subject,
          html: htmlBody,
          providerName: brand.name,
          otpCode: randomOtp,
          verifyUrl
        })
      });
    } catch (err) {
      console.warn('Notice email dispatch via local endpoint:', err);
    }

    setFlowStep('message_sent');
  };

  /**
   * STEP 4A:
   * Verify the 5-digit OTP code.
   * If correct and within 5 minutes -> make empty registration form visible!
   */
  const handleVerifyOtpCode = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    if (!pendingOtp) {
      setOtpError(i18n.otpExpired);
      return;
    }

    if (Date.now() > pendingOtp.expiresAt) {
      setOtpError(i18n.otpExpired);
      return;
    }

    if (enteredOtp.trim() !== pendingOtp.otpCode) {
      setOtpError(i18n.otpMismatch);
      return;
    }

    // OTP Code is correct and valid! Reveal the empty registration form
    setIsOtpConfirmed(true);
  };

  /**
   * STEP 4B:
   * Registration form submission:
   * NOW and ONLY now, register ALL DATA to Firebase Firestore!
   */
  const handleSaveRegistrationAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    if (!pendingOtp || !isOtpConfirmed) {
      setOtpError(i18n.otpExpired);
      return;
    }

    if (Date.now() > pendingOtp.expiresAt) {
      setOtpError(i18n.otpExpired);
      return;
    }

    const cleanEmail = pendingOtp.email.toLowerCase();
    const uid = `${pendingOtp.providerId}_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const isEmailAdmin = ADMIN_EMAILS.some((adm) => adm.toLowerCase() === cleanEmail);

    const isItaly = selectedCountry === 'IT';
    const isEuropean = EUROPEAN_COUNTRY_CODES.has(selectedCountry);
    const isExtraEuropean = !isItaly && !isEuropean;

    let finalCodiceFiscale = '';
    let finalPassport: string | undefined = undefined;

    if (isItaly) {
      let codCat = formCodiceCatastaleNascita;
      if (!codCat && formComuneNascita) {
        const match = COMUNI_ISTAT.find(
          (c) => c.nome.toLowerCase() === formComuneNascita.trim().toLowerCase()
        );
        if (match) codCat = match.codiceCatastale;
      }

      if (!codCat) {
        setOtpError('Seleziona un comune di nascita valido dall\'elenco ISTAT per verificare il Codice Fiscale.');
        return;
      }

      // Validazione e calcolo correttezza del codice fiscale rispetto ai dati anagrafici
      const checkCf = validaCodiceFiscale(formCodiceFiscale, {
        nome: formNome,
        cognome: formCognome,
        sesso: formSesso,
        dataNascita: formDataNascita,
        codiceCatastale: codCat
      });

      if (!checkCf.valido) {
        setOtpError(checkCf.errore || 'Codice Fiscale non corrispondente ai dati anagrafici.');
        return;
      }

      finalCodiceFiscale = formCodiceFiscale.trim().toUpperCase();
    } else if (isEuropean) {
      if (!formNumeroPassaporto.trim()) {
        setOtpError('Il Numero di passaporto è obbligatorio per cittadini europei.');
        return;
      }
      finalPassport = formNumeroPassaporto.trim().toUpperCase();
      finalCodiceFiscale = finalPassport;
    } else {
      // Per gli utenti extraeuropei: fisso non modificabile "0099999999999"
      finalCodiceFiscale = '0099999999999';
    }

    const fullUserData: UserData = {
      uid,
      nome: formNome.trim() || 'Cliente',
      cognome: formCognome.trim() || 'Centese',
      sesso: formSesso,
      dataNascita: formDataNascita || '1990-01-01',
      data_nascita: formDataNascita || '1990-01-01',
      codice_fiscale: finalCodiceFiscale,
      numero_passaporto: finalPassport,
      indirizzo: formIndirizzoResidenza.trim(),
      numero_civico: '1',
      cap: isItaly ? formCapResidenza.trim() : formCapResidenza.trim(),
      provincia: isItaly ? formProvinciaResidenza.trim().toUpperCase() : formForeignStato.trim(),
      codice_nazione: selectedCountry,
      email: cleanEmail,
      telefono: '+39 340 0000000',
      note: isItaly
        ? `Sesso: ${formSesso} | Nato a: ${formComuneNascita} (${formProvinciaNascita}) | Residente a: ${formComuneResidenza} (${formProvinciaResidenza})`
        : `Sesso: ${formSesso} | Residente a: ${formForeignCitta} (${formForeignStato}) | ID: ${finalCodiceFiscale}`,
      tipo_utente: isEmailAdmin ? 1 : 0,
      punti_fedelta: isEmailAdmin ? 950 : 250,
      loyaltyPoints: isEmailAdmin ? 950 : 250,
      totale_speso: 0.0,
      numero_ordini: 0,
      is_otp_guest: false,
      createdAt: new Date().toISOString()
    };

    // REGISTER ALL DATA TO FIREBASE FIRESTORE (ONLY NOW!)
    try {
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, fullUserData);
      if (isEmailAdmin) {
        const adminRef = doc(db, 'admins', uid);
        await setDoc(adminRef, { uid, email: cleanEmail, role: 'admin' }, { merge: true });
      }
    } catch (err) {
      console.warn('Notice saving verified user to Firestore:', err);
    }

    // Save in verified users local registry
    try {
      const regRaw = localStorage.getItem(REGISTERED_USERS_REGISTRY_KEY);
      const regList: UserData[] = regRaw ? JSON.parse(regRaw) : [];
      const updatedList = [fullUserData, ...regList.filter((u) => u.email.toLowerCase() !== cleanEmail)];
      localStorage.setItem(REGISTERED_USERS_REGISTRY_KEY, JSON.stringify(updatedList));
    } catch {}

    // Complete authentication with the selected provider
    const simulatedUser = {
      uid,
      email: cleanEmail,
      displayName: `${fullUserData.nome} ${fullUserData.cognome}`.trim(),
      photoURL: null
    } as User;

    setUser(simulatedUser);
    setProfile(fullUserData);

    try {
      localStorage.setItem(
        LOCAL_AUTH_STORAGE_KEY,
        JSON.stringify({
          uid,
          email: cleanEmail,
          displayName: simulatedUser.displayName,
          providerId: pendingOtp.providerId,
          profile: fullUserData
        })
      );
      sessionStorage.removeItem(PENDING_OTP_SESSION_KEY);
    } catch {}

    closeFlow();

    if (pendingResolveRef.current) {
      pendingResolveRef.current();
      pendingResolveRef.current = null;
    }
  };

  const closeFlow = () => {
    setActiveProviderId(null);
    setFlowStep(null);
    setInputEmail('');
    setEnteredOtp('');
    setOtpError(null);
    setPendingOtp(null);
    setIsOtpConfirmed(false);
  };

  const signInWithProvider = async (providerId: OAuthProviderId): Promise<void> => {
    return new Promise<void>((resolve) => {
      pendingResolveRef.current = resolve;
      setActiveProviderId(providerId);
      setInputEmail('');
      setFlowStep('enter_email');
    });
  };

  const signInWithGoogle = async () => {
    await signInWithProvider('google');
  };

  const logOut = async () => {
    try {
      localStorage.removeItem(LOCAL_AUTH_STORAGE_KEY);
      sessionStorage.clear();
      if (typeof window !== 'undefined' && 'caches' in window) {
        const cacheNames = await window.caches.keys();
        await Promise.all(cacheNames.map((name) => window.caches.delete(name)));
      }
    } catch {}
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
    setProfile(null);
  };

  const updateProfileData = async (data: Partial<UserData>) => {
    if (!user) return;
    setProfile((prev) => {
      const updated = prev ? { ...prev, ...data } : null;
      try {
        const savedRaw = localStorage.getItem(LOCAL_AUTH_STORAGE_KEY);
        if (savedRaw && updated) {
          const parsed = JSON.parse(savedRaw);
          parsed.profile = updated;
          localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(parsed));
        }
      } catch {}
      return updated;
    });
    try {
      const ref = doc(db, 'users', user.uid);
      await setDoc(ref, data, { merge: true });
    } catch {}
  };

  const isAdmin = Boolean(
    profile?.tipo_utente === 1 ||
    (user?.email && ADMIN_EMAILS.some((adm) => adm.toLowerCase() === user.email!.toLowerCase()))
  );

  const activeBrand = activeProviderId ? PROVIDER_BRANDS[activeProviderId] : null;

  const minutesRemaining = Math.floor(timeLeftSec / 60);
  const secondsRemaining = (timeLeftSec % 60).toString().padStart(2, '0');

  // Handle Comune di Nascita select (senza proporre codice/cap)
  const handleSelectComuneNascita = (c: ComuneIstat) => {
    setFormComuneNascita(c.nome);
    setFormProvinciaNascita(c.sigla);
    setFormCodiceCatastaleNascita(c.codiceCatastale);
  };

  // Helper per calcolare automaticamente il codice fiscale
  const handleAutoCalcolaCodiceFiscale = () => {
    let codCat = formCodiceCatastaleNascita;
    if (!codCat && formComuneNascita) {
      const match = COMUNI_ISTAT.find(
        (c) => c.nome.toLowerCase() === formComuneNascita.trim().toLowerCase()
      );
      if (match) {
        codCat = match.codiceCatastale;
        setFormCodiceCatastaleNascita(codCat);
      }
    }
    if (!formNome || !formCognome || !formDataNascita || !codCat) {
      setOtpError('Compila Nome, Cognome, Sesso, Data e Comune di nascita per calcolare il Codice Fiscale.');
      return;
    }
    const cf = calcolaCodiceFiscale({
      nome: formNome,
      cognome: formCognome,
      sesso: formSesso,
      dataNascita: formDataNascita,
      codiceCatastale: codCat
    });
    if (cf) {
      setFormCodiceFiscale(cf);
      setOtpError(null);
    }
  };

  // Handle Comune di Residenza select
  const handleSelectComuneResidenza = (c: ComuneIstat) => {
    setFormComuneResidenza(c.nome);
    setFormProvinciaResidenza(c.sigla);
    if (c.cap && c.cap.length === 1) {
      setFormCapResidenza(c.cap[0]);
      setAvailableCaps([]);
    } else if (c.cap && c.cap.length > 1) {
      setAvailableCaps(c.cap);
      setFormCapResidenza(c.cap[0]);
    } else {
      setAvailableCaps([]);
      setFormCapResidenza('');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        loading,
        signInWithProvider,
        signInWithGoogle,
        logOut,
        updateProfileData
      }}
    >
      {children}

      {/* MODAL OAUTH & VERIFICA OTP 5 CIFRE (CLOSES ONLY WITH THE 'X' BUTTON) */}
      {flowStep !== null && activeBrand && (
        <div
          className="fixed inset-0 z-[500] bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          /* Modal does NOT close on backdrop click */
        >
          <div
            className="bg-white text-stone-900 w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92dvh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Provider branding & CLOSE BUTTON 'X' ONLY */}
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-xs border border-stone-200 shrink-0"
                  dangerouslySetInnerHTML={{ __html: activeBrand.logoSvg }}
                />
                <div>
                  <h3 className="text-sm font-bold text-stone-900 leading-tight">
                    {i18n.panelTitle(activeBrand.name)}
                  </h3>
                  <span className="text-[10px] text-stone-500 font-medium">
                    Autenticazione OAuth 2.0 · Braciami Ancora
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={closeFlow}
                className="p-1.5 rounded-xl hover:bg-stone-200 text-stone-400 hover:text-stone-700 cursor-pointer transition-colors"
                aria-label="Chiudi"
                title="Chiudi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-4 flex-1">
              {/* PASSO 1: L'UTENTE COMPILA LA SUA EMAIL */}
              {flowStep === 'enter_email' && (
                <form onSubmit={handleEmailSubmitted} className="space-y-4">
                  <div className="text-center space-y-1">
                    <h4 className="text-base font-bold text-stone-900">
                      {i18n.enterEmailTitle(activeBrand.name)}
                    </h4>
                  </div>

                  <div className="space-y-1.5">
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        autoFocus
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        placeholder={`nome@${activeBrand.defaultDomain}`}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl text-white font-bold text-sm cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: activeBrand.accentColor }}
                  >
                    <span>{i18n.continueBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* PASSO 3 (SCHERMATA SCREENSHOT): PULITO CON SOLO IL TESTO E IL LINK "QUI" */}
              {flowStep === 'message_sent' && pendingOtp && (
                <div className="space-y-4">
                  {/* Banner Verde di invio */}
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">Messaggio di conferma inviato a {pendingOtp.email}!</p>
                      <p className="text-[11px] text-emerald-700">Controlla la tua casella di posta per trovare il codice OTP a 5 cifre.</p>
                    </div>
                  </div>

                  {/* BOX CENTRALE CON IL LINK "QUI" SENZA IL CODICE NUMERICO */}
                  <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-stone-900 space-y-3">
                    <p className="text-sm font-semibold leading-relaxed">
                      {i18n.otpMessagePrefix(activeBrand.name)}
                      <button
                        type="button"
                        onClick={() => {
                          if (Date.now() <= pendingOtp.expiresAt) {
                            try {
                              const currUrl = new URL(window.location.href);
                              currUrl.searchParams.set('oauth_otp_token', pendingOtp.token);
                              currUrl.searchParams.set('provider', pendingOtp.providerId);
                              currUrl.searchParams.set('email', pendingOtp.email);
                              window.history.pushState({}, '', currUrl.toString());
                            } catch {}
                            setFlowStep('verify_otp');
                          } else {
                            setOtpError(i18n.otpExpired);
                          }
                        }}
                        className="inline-flex items-center gap-1 mx-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm shadow-xs underline cursor-pointer transition-transform hover:scale-105"
                      >
                        <span>{i18n.otpMessageLinkText}</span>
                      </button>
                      {i18n.otpMessageSuffix}
                    </p>

                    <div className="pt-2 border-t border-amber-500/20 flex items-center justify-end">
                      <div className="flex items-center gap-1.5 text-xs text-stone-600 font-mono bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{i18n.timeRemainingLabel} {minutesRemaining}:{secondsRemaining}</span>
                      </div>
                    </div>
                  </div>

                  {otpError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* PASSO 4: PANNELLO CHE SI APRE CLICCANDO "QUI" */}
              {flowStep === 'verify_otp' && pendingOtp && (
                <div className="space-y-4">
                  {/* Se il codice non è ancora stato confermato: mostra solo l'inserimento dell'OTP */}
                  {!isOtpConfirmed ? (
                    <form onSubmit={handleVerifyOtpCode} className="space-y-4">
                      {/* Countdown Timer Badge */}
                      <div className="flex items-center justify-center">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                            timeLeftSec > 60
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{i18n.timeRemainingLabel} {minutesRemaining}:{secondsRemaining}</span>
                        </div>
                      </div>

                      {/* 5-Digit OTP Code Input */}
                      <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-400/60 space-y-2">
                        <label className="block text-xs font-bold text-stone-800 text-center uppercase tracking-wider">
                          {i18n.enterOtpTitle}
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          autoFocus
                          pattern="[0-9]{5}"
                          value={enteredOtp}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 5);
                            setEnteredOtp(digits);
                            setOtpError(null);
                          }}
                          placeholder="12345"
                          className="w-full text-center tracking-[12px] text-2xl font-black font-mono py-2.5 rounded-xl border-2 border-amber-500 bg-white text-stone-950 focus:outline-none focus:ring-4 focus:ring-amber-500/30"
                        />
                      </div>

                      {otpError && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-700 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{otpError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={enteredOtp.length !== 5 || timeLeftSec <= 0}
                        className={`w-full py-2.5 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                          enteredOtp.length === 5 && timeLeftSec > 0
                            ? 'opacity-100 cursor-pointer hover:brightness-110'
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                        style={{ backgroundColor: activeBrand.accentColor }}
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{i18n.verifyOtpBtn}</span>
                      </button>
                    </form>
                  ) : (
                    /* OTP CONFERMATO: FORM DI REGISTRAZIONE VUOTA CON PAESE PREIMPOSTATO IN BASE ALLA PROVENIENZA */
                    <form onSubmit={handleSaveRegistrationAndLogin} className="space-y-4">
                      <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <p className="font-bold">Codice OTP confermato con successo!</p>
                          <p className="text-[11px] text-emerald-700">Compila tutti i dati per completare la registrazione su Firebase.</p>
                        </div>
                      </div>

                      {/* Country Selector (Pre-set based on request origin) */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                          Paese di provenienza / Nazionalità
                        </label>
                        <select
                          value={selectedCountry}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedCountry(val);
                            setOtpError(null);
                            if (!EUROPEAN_COUNTRY_CODES.has(val) && val !== 'IT') {
                              setFormCodiceFiscale('0099999999999');
                            } else if (val === 'IT') {
                              setFormCodiceFiscale('');
                            }
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                        >
                          <option value="IT">Italia (IT)</option>
                          <option value="DE">Germania (DE)</option>
                          <option value="FR">Francia (FR)</option>
                          <option value="ES">Spagna (ES)</option>
                          <option value="NL">Paesi Bassi (NL)</option>
                          <option value="SE">Svezia (SE)</option>
                          <option value="GB">Regno Unito (GB)</option>
                          <option value="US">Stati Uniti (US)</option>
                          <option value="CH">Svizzera (CH)</option>
                        </select>
                      </div>

                      {/* CAMPIONI SPECIFICI PER L'ITALIA */}
                      {selectedCountry === 'IT' ? (
                        <div className="space-y-3 border border-stone-200 rounded-2xl p-4 bg-stone-50/70">
                          {/* Nome e Cognome */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                                Nome <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={formNome}
                                onChange={(e) => setFormNome(e.target.value)}
                                placeholder="Nome"
                                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                                Cognome <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={formCognome}
                                onChange={(e) => setFormCognome(e.target.value)}
                                placeholder="Cognome"
                                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                              />
                            </div>
                          </div>

                          {/* 2. DOPO I CAMPI NOME E COGNOME: SESSO (M/F) E DATA DI NASCITA */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                                {i18n.genderLabel} <span className="text-rose-500">*</span>
                              </label>
                              <div className="flex items-center gap-4 py-1.5 px-3 rounded-xl border border-stone-300 bg-white shadow-xs">
                                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-stone-800">
                                  <input
                                    type="radio"
                                    name="sessoIt"
                                    value="M"
                                    checked={formSesso === 'M'}
                                    onChange={() => setFormSesso('M')}
                                    className="accent-amber-600"
                                  />
                                  <span>{i18n.genderMale}</span>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-stone-800">
                                  <input
                                    type="radio"
                                    name="sessoIt"
                                    value="F"
                                    checked={formSesso === 'F'}
                                    onChange={() => setFormSesso('F')}
                                    className="accent-amber-600"
                                  />
                                  <span>{i18n.genderFemale}</span>
                                </label>
                              </div>
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                                Data di nascita <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="date"
                                required
                                value={formDataNascita}
                                onChange={(e) => setFormDataNascita(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                              />
                            </div>
                          </div>

                          {/* 1. COMUNE DI NASCITA: SENZA PROPORRE CODICE/CAP (showCap={false}) */}
                          <ComuneIstatPicker
                            label="Comune di Nascita"
                            value={formComuneNascita}
                            provinceSigla={formProvinciaNascita}
                            onSelect={handleSelectComuneNascita}
                            showCap={false}
                            placeholder="Cerca comune di nascita (es. Cento, Ferrara, Bologna, Genova...)"
                            required
                          />

                          {/* 3. CODICE FISCALE: CON CALCOLO E VERIFICA */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                                Codice Fiscale <span className="text-rose-500">*</span>
                              </label>
                              {formNome && formCognome && formDataNascita && (formComuneNascita || formCodiceCatastaleNascita) && (
                                <button
                                  type="button"
                                  onClick={handleAutoCalcolaCodiceFiscale}
                                  className="text-[10px] font-bold text-amber-700 hover:text-amber-900 underline flex items-center gap-1 cursor-pointer"
                                  title="Calcola codice fiscale dai dati anagrafici e codice ISTAT"
                                >
                                  <Sparkles className="w-3 h-3 text-amber-600" />
                                  <span>{i18n.calculateCfBtn}</span>
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              required
                              maxLength={16}
                              value={formCodiceFiscale}
                              onChange={(e) => {
                                setFormCodiceFiscale(e.target.value.toUpperCase());
                                setOtpError(null);
                              }}
                              placeholder="RSSMRA80A01C469X"
                              className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                            />
                            <p className="text-[10px] text-stone-500 mt-0.5">
                              Viene calcolato e verificato con codice ISTAT catastale del comune selezionato (es. D969 per Genova).
                            </p>
                          </div>

                          {/* Indirizzo Residenza */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                              Indirizzo di Residenza (Via/Piazza e civico) <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={formIndirizzoResidenza}
                              onChange={(e) => setFormIndirizzoResidenza(e.target.value)}
                              placeholder="es. Via Penzale 25"
                              className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                            />
                          </div>

                          {/* Comune e Provincia di Residenza con Autocomplete ISTAT */}
                          <ComuneIstatPicker
                            label="Comune di Residenza"
                            value={formComuneResidenza}
                            provinceSigla={formProvinciaResidenza}
                            onSelect={handleSelectComuneResidenza}
                            showCap={true}
                            placeholder="Cerca comune di residenza (es. Cento, Bologna...)"
                            required
                          />

                          {/* CAP di Residenza: se multiplo select, altrimenti input/auto-impostato */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                              CAP di Residenza <span className="text-rose-500">*</span>
                            </label>
                            {availableCaps.length > 1 ? (
                              <select
                                required
                                value={formCapResidenza}
                                onChange={(e) => setFormCapResidenza(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                              >
                                {availableCaps.map((cap) => (
                                  <option key={cap} value={cap}>
                                    {cap} ({formComuneResidenza})
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                required
                                value={formCapResidenza}
                                onChange={(e) => setFormCapResidenza(e.target.value)}
                                placeholder="44042"
                                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                              />
                            )}
                          </div>
                        </div>
                      ) : (
                        /* CAMPI PER PAESI ESTERI */
                        <div className="space-y-3 border border-stone-200 rounded-2xl p-4 bg-stone-50/70">
                          {/* Nome e Cognome */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                                Nome <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={formNome}
                                onChange={(e) => setFormNome(e.target.value)}
                                placeholder="First Name"
                                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                                Cognome <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={formCognome}
                                onChange={(e) => setFormCognome(e.target.value)}
                                placeholder="Last Name"
                                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                              />
                            </div>
                          </div>

                          {/* 2. SESSO (M/F) E DATA DI NASCITA */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                                {i18n.genderLabel} <span className="text-rose-500">*</span>
                              </label>
                              <div className="flex items-center gap-4 py-1.5 px-3 rounded-xl border border-stone-300 bg-white shadow-xs">
                                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-stone-800">
                                  <input
                                    type="radio"
                                    name="sessoEstero"
                                    value="M"
                                    checked={formSesso === 'M'}
                                    onChange={() => setFormSesso('M')}
                                    className="accent-amber-600"
                                  />
                                  <span>{i18n.genderMale}</span>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-stone-800">
                                  <input
                                    type="radio"
                                    name="sessoEstero"
                                    value="F"
                                    checked={formSesso === 'F'}
                                    onChange={() => setFormSesso('F')}
                                    className="accent-amber-600"
                                  />
                                  <span>{i18n.genderFemale}</span>
                                </label>
                              </div>
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                                Data di nascita <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="date"
                                required
                                value={formDataNascita}
                                onChange={(e) => setFormDataNascita(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                              />
                            </div>
                          </div>

                          {/* 3. UTENTI STRANIERI EUROPEI: "NUMERO PASSAPORTO" IN LINGUA | EXTRAEUROPEI: 0099999999999 FISSO */}
                          {EUROPEAN_COUNTRY_CODES.has(selectedCountry) ? (
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                                {i18n.passportLabel} <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={formNumeroPassaporto}
                                onChange={(e) => {
                                  setFormNumeroPassaporto(e.target.value.toUpperCase());
                                  setOtpError(null);
                                }}
                                placeholder={i18n.passportLabel}
                                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                              />
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                                  {i18n.extraEuTaxIdLabel} <span className="text-stone-400 font-normal">(Fisso non modificabile)</span>
                                </label>
                              </div>
                              <input
                                type="text"
                                readOnly
                                disabled
                                value="0099999999999"
                                className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-100 text-xs text-stone-500 font-mono tracking-widest cursor-not-allowed shadow-xs select-all"
                              />
                            </div>
                          )}

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                              Indirizzo di Residenza <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={formIndirizzoResidenza}
                              onChange={(e) => setFormIndirizzoResidenza(e.target.value)}
                              placeholder="Address, Street & Number"
                              className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                                Città <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={formForeignCitta}
                                onChange={(e) => setFormForeignCitta(e.target.value)}
                                placeholder="City"
                                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                                CAP / Postal Code <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={formCapResidenza}
                                onChange={(e) => setFormCapResidenza(e.target.value)}
                                placeholder="Postal Code"
                                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                              Stato / Regione / Provincia
                            </label>
                            <input
                              type="text"
                              value={formForeignStato}
                              onChange={(e) => setFormForeignStato(e.target.value)}
                              placeholder="State / Region / Province"
                              className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                            />
                          </div>
                        </div>
                      )}

                      {otpError && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-700 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{otpError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:brightness-110 cursor-pointer"
                        style={{ backgroundColor: activeBrand.accentColor }}
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>{i18n.registerAndLoginBtn}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
