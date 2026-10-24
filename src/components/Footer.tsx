import React, { useState } from 'react';
import { useStore, ActivePage } from '../context/StoreContext';
import { useI18n } from '../i18n/I18nContext';
import { Language } from '../i18n/translations';
import { Mail, CheckCircle2, MapPin, Phone, ShieldCheck, X, ExternalLink } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { executeRecaptcha } from '../utils/recaptcha';

interface NewsletterConfirmTranslations {
  badgeSent: string;
  subject: string;
  toLabel: string;
  fromLabel: string;
  storeSubtitle: string;
  greetingPrefix: string;
  welcomeLead: string;
  welcomeSub: string;
  bonusTitle: string;
  bonusItem1: string;
  bonusItem2Prefix: string;
  bonusItem2Suffix: string;
  bonusItem3: string;
  visitNote: string;
  legalTitle: string;
  legalText: (email: string) => string;
  unsubscribeCta: string;
  privacyCta: string;
  revokeEmailCta: string;
  closeBtn: string;
  inlineSuccess: string;
  recaptchaNote: string;
}

const NEWSLETTER_I18N: Record<Language, NewsletterConfirmTranslations> = {
  it_IT: {
    badgeSent: 'EMAIL DI CONFERMA INVIATA',
    subject: "Grazie per l'iscrizione alla newsletter di Braciami Ancora - Cento",
    toLabel: 'A:',
    fromLabel: 'Da:',
    storeSubtitle: 'Braciami Ancora · Spaccio Carni, Salumi, Formaggi',
    greetingPrefix: 'Caro cliente',
    welcomeLead: "Grazie per l'iscrizione alla newsletter di Braciami Ancora - Cento!",
    welcomeSub: 'Manuel e Samanta ti danno il benvenuto ufficiale nella famiglia della nostra bottega.',
    bonusTitle: '🎁 Il tuo Bonus di Benvenuto è già attivo:',
    bonusItem1: '+25 Punti Fedeltà Brace accreditati subito sul tuo profilo;',
    bonusItem2Prefix: 'Codice Sconto Benvenuto:',
    bonusItem2Suffix: '(-10% sul prossimo ordine online o al banco);',
    bonusItem3: 'Anteprime esclusive sulle frollature Dry-Aged, serate degustazione birra & grigliata e offerte settimanali dello Spaccio in Via Penzale 25.',
    visitNote: 'Ti aspettiamo in bottega in Via Penzale 25, 44042 Cento (FE) dal Martedì alla Domenica oppure sul nostro catalogo online.',
    legalTitle: 'Informativa di Legge (Art. 13, 7 e 21 GDPR UE 2016/679 e D.Lgs. 196/2003):',
    legalText: (email) =>
      `Ricevi questa comunicazione di conferma perché l'indirizzo ${email} è stato iscritto alla newsletter di Braciami Ancora - Via Penzale 25, 44042 Cento (FE).`,
    unsubscribeCta: 'Disiscriviti immediatamente dalla Newsletter (Link di Legge One-Click)',
    privacyCta: 'Informativa Privacy & Diritti GDPR',
    revokeEmailCta: 'Revoca Consenso via Email (info@braciamiancora.it)',
    closeBtn: 'Chiudi Ricevuta Email',
    inlineSuccess: "Grazie per l'iscrizione alla newsletter di Braciami Ancora - Cento! Email di conferma inviata.",
    recaptchaNote: 'Protetto da Google reCAPTCHA Enterprise · Disiscrizione garantita a norma GDPR'
  },
  en_US: {
    badgeSent: 'CONFIRMATION EMAIL SENT',
    subject: 'Thank you for subscribing to the Braciami Ancora - Cento newsletter',
    toLabel: 'To:',
    fromLabel: 'From:',
    storeSubtitle: 'Braciami Ancora · Prime Meats, Cured Meats & Cheeses',
    greetingPrefix: 'Dear customer',
    welcomeLead: 'Thank you for subscribing to the Braciami Ancora - Cento newsletter!',
    welcomeSub: 'Manuel and Samanta officially welcome you to our butcher & deli family.',
    bonusTitle: '🎁 Your Welcome Bonus is now active:',
    bonusItem1: '+25 Grill Loyalty Points credited immediately to your profile;',
    bonusItem2Prefix: 'Welcome Discount Code:',
    bonusItem2Suffix: '(-10% on your next online or in-store order);',
    bonusItem3: 'Exclusive previews on Dry-Aged cuts, beer & grill tasting nights, and weekly specials at Via Penzale 25.',
    visitNote: 'We look forward to seeing you at Via Penzale 25, 44042 Cento (FE) Tuesday through Sunday or on our online catalog.',
    legalTitle: 'Legal Notice (Art. 13, 7 & 21 EU GDPR 2016/679):',
    legalText: (email) =>
      `You are receiving this confirmation email because ${email} subscribed to the newsletter of Braciami Ancora - Via Penzale 25, 44042 Cento (FE).`,
    unsubscribeCta: 'Unsubscribe immediately from the Newsletter (One-Click Legal Link)',
    privacyCta: 'Privacy Policy & GDPR Rights',
    revokeEmailCta: 'Withdraw Consent via Email (info@braciamiancora.it)',
    closeBtn: 'Close Email Receipt',
    inlineSuccess: 'Thank you for subscribing to the Braciami Ancora - Cento newsletter! Confirmation email sent.',
    recaptchaNote: 'Protected by Google reCAPTCHA Enterprise · Guaranteed GDPR one-click unsubscribe'
  },
  de_DE: {
    badgeSent: 'BESTÄTIGUNGS-E-MAIL GESENDET',
    subject: 'Vielen Dank für Ihre Anmeldung zum Newsletter von Braciami Ancora - Cento',
    toLabel: 'An:',
    fromLabel: 'Von:',
    storeSubtitle: 'Braciami Ancora · Fleisch, Wurstwaren & Käse Spezialitäten',
    greetingPrefix: 'Lieber Kunde',
    welcomeLead: 'Vielen Dank für Ihre Anmeldung zum Newsletter von Braciami Ancora - Cento!',
    welcomeSub: 'Manuel und Samanta heißen Sie herzlich in unserer Bottega-Familie willkommen.',
    bonusTitle: '🎁 Ihr Willkommensbonus ist bereits aktiv:',
    bonusItem1: '+25 Grill-Treuepunkte sofort Ihrem Profil gutgeschrieben;',
    bonusItem2Prefix: 'Willkommens-Rabattcode:',
    bonusItem2Suffix: '(-10% auf Ihre nächste Online- oder Ladenbestellung);',
    bonusItem3: 'Exklusive Vorschauen auf Dry-Aged-Zuschnitte, Bier- & Grill-Verkostungsabende und Wochenangebote in der Via Penzale 25.',
    visitNote: 'Wir erwarten Sie in der Via Penzale 25, 44042 Cento (FE) von Dienstag bis Sonntag oder in unserem Online-Katalog.',
    legalTitle: 'Rechtlicher Hinweis (Art. 13, 7 und 21 EU-DSGVO 2016/679):',
    legalText: (email) =>
      `Sie erhalten diese Bestätigung, weil die Adresse ${email} für den Newsletter von Braciami Ancora - Via Penzale 25, 44042 Cento (FE) registriert wurde.`,
    unsubscribeCta: 'Sofort vom Newsletter abmelden (Gesetzlicher One-Click-Link)',
    privacyCta: 'Datenschutzerklärung & DSGVO-Rechte',
    revokeEmailCta: 'Einwilligung per E-Mail widerrufen (info@braciamiancora.it)',
    closeBtn: 'E-Mail-Beleg schließen',
    inlineSuccess: 'Vielen Dank für Ihre Anmeldung zum Newsletter von Braciami Ancora - Cento! Bestätigungs-E-Mail gesendet.',
    recaptchaNote: 'Geschützt durch Google reCAPTCHA Enterprise · Garantierte DSGVO-Abmeldung'
  },
  fr_FR: {
    badgeSent: 'E-MAIL DE CONFIRMATION ENVOYÉ',
    subject: "Merci pour votre inscription à la newsletter de Braciami Ancora - Cento",
    toLabel: 'À :',
    fromLabel: 'De :',
    storeSubtitle: 'Braciami Ancora · Boucherie, Charcuterie & Fromages',
    greetingPrefix: 'Cher client',
    welcomeLead: "Merci pour votre inscription à la newsletter de Braciami Ancora - Cento !",
    welcomeSub: 'Manuel et Samanta vous souhaitent la bienvenue dans la famille de notre boutique.',
    bonusTitle: '🎁 Votre Bonus de Bienvenue est déjà actif :',
    bonusItem1: '+25 Points Fidélité Braise crédités immédiatement sur votre profil ;',
    bonusItem2Prefix: 'Code Promo de Bienvenue :',
    bonusItem2Suffix: '(-10% sur votre prochaine commande en ligne ou en boutique) ;',
    bonusItem3: 'Avant-premières exclusives sur les viandes maturées Dry-Aged, soirées dégustation bière & grillades et offres hebdomadaires Via Penzale 25.',
    visitNote: 'Nous vous attendons en boutique Via Penzale 25, 44042 Cento (FE) du mardi au dimanche ou sur notre catalogue en ligne.',
    legalTitle: 'Mentions Légales (Art. 13, 7 et 21 RGPD UE 2016/679) :',
    legalText: (email) =>
      `Vous recevez cet e-mail de confirmation car l'adresse ${email} a été inscrite à la newsletter de Braciami Ancora - Via Penzale 25, 44042 Cento (FE).`,
    unsubscribeCta: 'Se désinscrire immédiatement de la Newsletter (Lien légal en un clic)',
    privacyCta: 'Politique de Confidentialité & Droits RGPD',
    revokeEmailCta: 'Révoquer le consentement par E-mail (info@braciamiancora.it)',
    closeBtn: 'Fermer le reçu E-mail',
    inlineSuccess: "Merci pour votre inscription à la newsletter de Braciami Ancora - Cento ! E-mail de confirmation envoyé.",
    recaptchaNote: 'Protégé par Google reCAPTCHA Enterprise · Désinscription garantie conforme RGPD'
  },
  es_ES: {
    badgeSent: 'CORREO DE CONFIRMACIÓN ENVIADO',
    subject: 'Gracias por suscribirte al boletín de Braciami Ancora - Cento',
    toLabel: 'Para:',
    fromLabel: 'De:',
    storeSubtitle: 'Braciami Ancora · Carnicería, Embutidos y Quesos',
    greetingPrefix: 'Estimado cliente',
    welcomeLead: '¡Gracias por suscribirte al boletín de Braciami Ancora - Cento!',
    welcomeSub: 'Manuel y Samanta te dan la bienvenida oficial a la familia de nuestra tienda.',
    bonusTitle: '🎁 Tu Bono de Bienvenida ya está activo:',
    bonusItem1: '+25 Puntos de Fidelidad Brasa acreditados de inmediato en tu perfil;',
    bonusItem2Prefix: 'Código de Descuento de Bienvenida:',
    bonusItem2Suffix: '(-10% en tu próximo pedido online o en tienda);',
    bonusItem3: 'Avances exclusivos sobre maduraciones Dry-Aged, noches de degustación de cerveza y parrilla y ofertas semanales en Via Penzale 25.',
    visitNote: 'Te esperamos en Via Penzale 25, 44042 Cento (FE) de martes a domingo o en nuestro catálogo online.',
    legalTitle: 'Aviso Legal (Art. 13, 7 y 21 RGPD UE 2016/679):',
    legalText: (email) =>
      `Recibes esta confirmación porque la dirección ${email} se ha suscrito al boletín de Braciami Ancora - Via Penzale 25, 44042 Cento (FE).`,
    unsubscribeCta: 'Darse de baja inmediatamente del Boletín (Enlace legal en un clic)',
    privacyCta: 'Política de Privacidad y Derechos RGPD',
    revokeEmailCta: 'Revocar consentimiento por Email (info@braciamiancora.it)',
    closeBtn: 'Cerrar Recibo de Correo',
    inlineSuccess: '¡Gracias por suscribirte al boletín de Braciami Ancora - Cento! Correo de confirmación enviado.',
    recaptchaNote: 'Protegido por Google reCAPTCHA Enterprise · Baja garantizada según RGPD'
  },
  nl_NL: {
    badgeSent: 'BEVESTIGINGSMAIL VERZONDEN',
    subject: 'Bedankt voor uw inschrijving op de nieuwsbrief van Braciami Ancora - Cento',
    toLabel: 'Aan:',
    fromLabel: 'Van:',
    storeSubtitle: 'Braciami Ancora · Slagerij, Vleeswaren & Kazen',
    greetingPrefix: 'Beste klant',
    welcomeLead: 'Bedankt voor uw inschrijving op de nieuwsbrief van Braciami Ancora - Cento!',
    welcomeSub: 'Manuel en Samanta heten u van harte welkom in onze winkel-familie.',
    bonusTitle: '🎁 Uw Welkomstbonus is nu actief:',
    bonusItem1: '+25 Grill-spaarpunten direct bijgeschreven op uw profiel;',
    bonusItem2Prefix: 'Welkomstkortingscode:',
    bonusItem2Suffix: '(-10% op uw volgende bestelling online of in de winkel);',
    bonusItem3: 'Exclusieve previews van Dry-Aged vlees, bier- & grillproeverijen en wekelijkse aanbiedingen op Via Penzale 25.',
    visitNote: 'Wij verwelkomen u graag in Via Penzale 25, 44042 Cento (FE) van dinsdag t/m zondag of in onze online catalogus.',
    legalTitle: 'Wettelijke kennisgeving (Art. 13, 7 en 21 AVG/GDPR EU 2016/679):',
    legalText: (email) =>
      `U ontvangt deze bevestiging omdat het adres ${email} is aangemeld voor de nieuwsbrief van Braciami Ancora - Via Penzale 25, 44042 Cento (FE).`,
    unsubscribeCta: 'Direct uitschrijven voor de Nieuwsbrief (Wettelijke One-Click-link)',
    privacyCta: 'Privacybeleid & AVG-rechten',
    revokeEmailCta: 'Toestemming intrekken per E-mail (info@braciamiancora.it)',
    closeBtn: 'E-mailbewijs sluiten',
    inlineSuccess: 'Bedankt voor uw inschrijving op de nieuwsbrief van Braciami Ancora - Cento! Bevestigingsmail verzonden.',
    recaptchaNote: 'Beschermd door Google reCAPTCHA Enterprise · Gegarandeerde AVG-uitschrijving'
  },
  sv_SE: {
    badgeSent: 'BEKRÄFTELSEMEJL SKICKAT',
    subject: 'Tack för din prenumeration på nyhetsbrevet från Braciami Ancora - Cento',
    toLabel: 'Till:',
    fromLabel: 'Från:',
    storeSubtitle: 'Braciami Ancora · Kött, Charkuterier &ostar',
    greetingPrefix: 'Bästa kund',
    welcomeLead: 'Tack för din prenumeration på nyhetsbrevet från Braciami Ancora - Cento!',
    welcomeSub: 'Manuel och Samanta hälsar dig varmt välkommen till vår gårdsbutiksfamilj.',
    bonusTitle: '🎁 Din Välkomstbonus är nu aktiv:',
    bonusItem1: '+25 Grill-bonuspoäng krediterade direkt på din profil;',
    bonusItem2Prefix: 'Välkomstrabattkod:',
    bonusItem2Suffix: '(-10% på din nästa beställning online eller i butik);',
    bonusItem3: 'Exklusiva förhandsvisningar av Dry-Aged-kött, öl- & grillprovningar och veckoerbjudanden på Via Penzale 25.',
    visitNote: 'Vi ser fram emot ditt besök på Via Penzale 25, 44042 Cento (FE) tisdag till söndag eller i vår onlinekatalog.',
    legalTitle: 'Juridisk information (Art. 13, 7 och 21 EU GDPR 2016/679):',
    legalText: (email) =>
      `Du får denna bekräftelse eftersom adressen ${email} har anmälts till nyhetsbrevet från Braciami Ancora - Via Penzale 25, 44042 Cento (FE).`,
    unsubscribeCta: 'Avsluta prenumerationen omedelbart (Lagstadgad One-Click-länk)',
    privacyCta: 'Integritetspolicy & GDPR-rättigheter',
    revokeEmailCta: 'Återkalla samtycke via E-post (info@braciamiancora.it)',
    closeBtn: 'Stäng E-postkvitto',
    inlineSuccess: 'Tack för din prenumeration på nyhetsbrevet från Braciami Ancora - Cento! Bekräftelsemejl skickat.',
    recaptchaNote: 'Skyddad av Google reCAPTCHA Enterprise · Garanterad GDPR-avregistrering'
  },
  zh_CN: {
    badgeSent: '确认邮件已发送',
    subject: '感谢您订阅 Braciami Ancora - Cento 新闻通讯',
    toLabel: '收件人：',
    fromLabel: '发件人：',
    storeSubtitle: 'Braciami Ancora · 精品鲜肉、萨拉米与奶酪直营店',
    greetingPrefix: '尊敬的客户',
    welcomeLead: '感谢您订阅 Braciami Ancora - Cento 新闻通讯！',
    welcomeSub: 'Manuel 和 Samanta 正式欢迎您加入我们的精品肉铺大家庭。',
    bonusTitle: '🎁 您的欢迎礼遇已激活：',
    bonusItem1: '+25 炭火会员积分已立即充入您的账户；',
    bonusItem2Prefix: '欢迎折扣码：',
    bonusItem2Suffix: '（下次线上或门店订单享 9 折优惠）；',
    bonusItem3: '干式熟成牛排（Dry-Aged）、精酿啤酒与烧烤品鉴之夜及 Via Penzale 25 每周特惠抢先看。',
    visitNote: '欢迎周二至周日莅临 Via Penzale 25, 44042 Cento (FE) 门店或浏览我们的在线目录。',
    legalTitle: '法律声明（欧盟 GDPR 2016/679 第 13、7 和 21 条）：',
    legalText: (email) =>
      `您收到此确认邮件是因为 ${email} 已订阅 Braciami Ancora（地址：Via Penzale 25, 44042 Cento FE）的新闻通讯。`,
    unsubscribeCta: '立即退订新闻通讯（法定一键退订链接）',
    privacyCta: '隐私政策与 GDPR 权利',
    revokeEmailCta: '通过电子邮件撤回同意 (info@braciamiancora.it)',
    closeBtn: '关闭邮件回执',
    inlineSuccess: '感谢您订阅 Braciami Ancora - Cento 新闻通讯！确认邮件已发送。',
    recaptchaNote: '受 Google reCAPTCHA Enterprise 保护 · 符合 GDPR 保证一键退订'
  },
  ja_JP: {
    badgeSent: '確認メール送信済み',
    subject: 'Braciami Ancora - Cento ニュースレターへのご登録ありがとうございます',
    toLabel: '宛先:',
    fromLabel: '差出人:',
    storeSubtitle: 'Braciami Ancora · 精肉・サラミ・チーズ直売所',
    greetingPrefix: 'お客様',
    welcomeLead: 'Braciami Ancora - Cento のニュースレターにご登録いただきありがとうございます！',
    welcomeSub: 'マヌエルとサマンタより、当店ファミリーへのご参加を心より歓迎いたします。',
    bonusTitle: '🎁 ウェルカムボーナスが有効になりました：',
    bonusItem1: '+25 グリルロイヤルティポイントがプロフィールに即時付与されました；',
    bonusItem2Prefix: 'ウェルカム割引コード:',
    bonusItem2Suffix: '（次回のオンラインまたは店頭注文が10%OFF）；',
    bonusItem3: 'ドライエイジング熟成肉、クラフトビール＆グリル試食会、Via Penzale 25 店舗の週替わり特典を先行ご案内。',
    visitNote: '火曜〜日曜に Via Penzale 25, 44042 Cento (FE) の店舗、またはオンラインカタログにてお待ちしております。',
    legalTitle: '法的通知（EU GDPR 2016/679 第13・7・21条）：',
    legalText: (email) =>
      `この確認メールは、${email} が Braciami Ancora（Via Penzale 25, 44042 Cento FE）のニュースレターに登録されたため送信されています。`,
    unsubscribeCta: 'ニュースレターを直ちに配信停止する（法定ワンクリック解除リンク）',
    privacyCta: 'プライバシーポリシーとGDPRの権利',
    revokeEmailCta: 'メールで同意を撤回する (info@braciamiancora.it)',
    closeBtn: 'メール控えを閉じる',
    inlineSuccess: 'Braciami Ancora - Cento ニュースレターへのご登録ありがとうございます！確認メールを送信しました。',
    recaptchaNote: 'Google reCAPTCHA Enterprise による保護 · GDPR準拠の配信停止保証'
  },
  ru_RU: {
    badgeSent: 'ПИСЬМО С ПОДТВЕРЖДЕНИЕМ ОТПРАВЛЕНО',
    subject: 'Спасибо за подписку на рассылку Braciami Ancora - Cento',
    toLabel: 'Кому:',
    fromLabel: 'От:',
    storeSubtitle: 'Braciami Ancora · Лавка мяса, салями и сыров',
    greetingPrefix: 'Уважаемый клиент',
    welcomeLead: 'Спасибо за подписку на рассылку Braciami Ancora - Cento!',
    welcomeSub: 'Мануэль и Саманта официально приветствуют вас в семье нашей мясной лавки.',
    bonusTitle: '🎁 Ваш приветственный бонус уже активен:',
    bonusItem1: '+25 бонусных баллов сразу зачислены на ваш профиль;',
    bonusItem2Prefix: 'Приветственный промокод:',
    bonusItem2Suffix: '(-10% на следующий заказ онлайн или в лавке);',
    bonusItem3: 'Эксклюзивные анонсы выдержанного мяса Dry-Aged, дегустаций пива и гриля, а также еженедельные акции на Via Penzale 25.',
    visitNote: 'Ждем вас в лавке по адресу Via Penzale 25, 44042 Cento (FE) со вторника по воскресенье или в нашем онлайн-каталоге.',
    legalTitle: 'Юридическое уведомление (ст. 13, 7 и 21 GDPR ЕС 2016/679):',
    legalText: (email) =>
      `Вы получили это письмо с подтверждением, так как адрес ${email} был подписан на рассылку Braciami Ancora - Via Penzale 25, 44042 Cento (FE).`,
    unsubscribeCta: 'Мгновенно отписаться от рассылки (Законная ссылка в один клик)',
    privacyCta: 'Политика конфиденциальности и права GDPR',
    revokeEmailCta: 'Отозвать согласие по Email (info@braciamiancora.it)',
    closeBtn: 'Закрыть квитанцию письма',
    inlineSuccess: 'Спасибо за подписку на рассылку Braciami Ancora - Cento! Письмо с подтверждением отправлено.',
    recaptchaNote: 'Защищено Google reCAPTCHA Enterprise · Гарантированная отписка по GDPR'
  },
  ar_SA: {
    badgeSent: 'تم إرسال بريد التأكيد الإلكتروني',
    subject: 'شكراً لاشتراكك في النشرة الإخبارية لـ Braciami Ancora - Cento',
    toLabel: 'إلى:',
    fromLabel: 'من:',
    storeSubtitle: 'Braciami Ancora · متجر اللحوم والسلامي والأجبان الفاخرة',
    greetingPrefix: 'عزيزي العميل',
    welcomeLead: 'شكراً لاشتراكك في النشرة الإخبارية لـ Braciami Ancora - Cento!',
    welcomeSub: 'يرحب بك مانويل وسامانثا رسمياً في عائلة متجرنا.',
    bonusTitle: '🎁 مكافأة الترحيب الخاصة بك نشطة الآن:',
    bonusItem1: '+25 نقطة ولاء تمت إضافتها فوراً إلى حسابك؛',
    bonusItem2Prefix: 'كود خصم الترحيب:',
    bonusItem2Suffix: '(خصم 10% على طلبك القادم عبر الإنترنت أو في المتجر)؛',
    bonusItem3: 'عروض حصرية للحوم المعتقة Dry-Aged وأمسيات التذوق والعروض الأسبوعية في Via Penzale 25.',
    visitNote: 'نحن بانتظارك في متجرنا في Via Penzale 25, 44042 Cento (FE) من الثلاثاء إلى الأحد أو عبر الكتالوج الإلكتروني.',
    legalTitle: 'إشعار قانوني (المواد 13 و7 و21 من اللائحة الأوروبية لحماية البيانات GDPR 2016/679):',
    legalText: (email) =>
      `تتلقى رسالة التأكيد هذه لأن العنوان ${email} قد تم تسجيله في النشرة الإخبارية لـ Braciami Ancora - Via Penzale 25, 44042 Cento (FE).`,
    unsubscribeCta: 'إلغاء الاشتراك فوراً من النشرة الإخبارية (رابط قانوني بنقرة واحدة)',
    privacyCta: 'سياسة الخصوصية وحقوق GDPR',
    revokeEmailCta: 'سحب الموافقة عبر البريد الإلكتروني (info@braciamiancora.it)',
    closeBtn: 'إغلاق إيصال البريد',
    inlineSuccess: 'شكراً لاشتراكك في النشرة الإخبارية لـ Braciami Ancora - Cento! تم إرسال بريد التأكيد.',
    recaptchaNote: 'محمي بواسطة Google reCAPTCHA Enterprise · إلغاء اشتراك مضمون وفقاً لـ GDPR'
  }
};

export const Footer: React.FC = () => {
  const {
    setActivePage,
    subscribeNewsletter,
    unsubscribeNewsletterByEmail,
    lastSentNewsletterRecord,
    setLastSentNewsletterRecord,
    handleOpenAdmin,
    theme
  } = useStore();
  const { t, language } = useI18n();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const isLight = theme === 'chiaro';
  const nlText = NEWSLETTER_I18N[language] || NEWSLETTER_I18N.it_IT;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim();
    if (!cleanEmail) return;

    // Execute reCAPTCHA Enterprise
    await executeRecaptcha('newsletter');

    // Clean email field immediately upon clicking Iscriviti
    setEmailInput('');

    const ok = subscribeNewsletter(cleanEmail);
    if (ok) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
      }, 6500);
    }
  };

  const navLinks: { label: string; page: ActivePage }[] = [
    { label: t('nav_catalog'), page: 'catalogo' },
    { label: t('nav_about'), page: 'chi-siamo' },
    { label: t('nav_contact'), page: 'come-raggiungerci' },
    { label: t('footer_guide_brace'), page: 'guida-brace' },
    { label: t('footer_privacy'), page: 'privacy' }
  ];

  return (
    <footer
      className={`border-t transition-colors duration-200 ${
        isLight
          ? 'bg-[#1C1816] text-stone-200 border-stone-800'
          : 'bg-stone-950 text-stone-200 border-stone-850'
      }`}
    >
      {/* Newsletter Section */}
      <div
        className={
          isLight
            ? 'border-b border-stone-800/80 bg-stone-900/60'
            : 'border-b border-stone-850 bg-stone-900/40'
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-gradient-to-r from-stone-900 to-stone-950 border border-stone-800 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center lg:text-left">
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-widest">
                {t('footer_newsletter_tag')}
              </span>
              <h3 className="font-display text-2xl font-bold text-white">
                {t('footer_newsletter_title')}
              </h3>
              <p className="text-xs text-stone-400 max-w-lg">{t('footer_newsletter_desc')}</p>
            </div>

            <div className="w-full lg:w-auto">
              {subscribed ? (
                <div className="flex flex-col gap-2 p-3.5 bg-emerald-950/90 border border-emerald-700 rounded-xl text-xs text-emerald-200">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{nlText.inlineSuccess}</span>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-2 max-w-md w-full"
                >
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                    <input
                      id="newsletter_email_input"
                      type="email"
                      required
                      placeholder={t('footer_newsletter_placeholder')}
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                  </div>
                  <button
                    id="btn_newsletter_subscribe"
                    type="submit"
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {t('footer_newsletter_btn')}
                  </button>
                </form>
              )}
              <div className="flex items-center gap-1.5 text-[10px] text-stone-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{nlText.recaptchaNote}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Bottega Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Motto */}
          <div className="space-y-3">
            <BrandLogo variant="full" theme="dark" />

            <p className="text-xs text-amber-400 font-serif italic pt-1">
              &ldquo;{t('store_motto')}&rdquo;
            </p>

            <p className="text-xs text-stone-400 leading-relaxed">{t('footer_about_desc')}</p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              {t('nav_catalog')}
            </h4>
            <ul className="space-y-2 text-xs">
              {navLinks.slice(0, 3).map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => {
                      setActivePage(link.page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Bottega &amp; Trasparenza
            </h4>
            <ul className="space-y-2 text-xs">
              {navLinks.slice(3).map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => {
                      setActivePage(link.page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleOpenAdmin()}
                  className="text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t('nav_admin')}
                </button>
              </li>
            </ul>
          </div>

          {/* Bottega Cento Coordinates */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              {t('nav_contact')}
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <a
                  href="https://maps.google.com/?q=Via+Penzale+25+44042+Cento+FE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 hover:underline transition-colors cursor-pointer"
                  title="Apri su Google Maps"
                >
                  {t('store_address_full')}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="tel:+390516831000" className="hover:text-amber-400 transition-colors">
                  +39 051 6831000
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1 text-[11px] text-stone-500">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{t('store_hours_summary')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Braciami Ancora · {t('footer_rights')}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setActivePage('privacy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              {t('footer_privacy')}
            </button>
            <span>·</span>
            <span>Cento (FE)</span>
          </div>
        </div>
      </div>

      {/* Modal di Conferma Email di Benvenuto Newsletter con Link di Legge per la Disiscrizione */}
      {lastSentNewsletterRecord && (
        <div
          className="fixed inset-0 z-[260] bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setLastSentNewsletterRecord(null)}
        >
          <div
            className="bg-stone-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full max-h-[90dvh] overflow-y-auto p-4 sm:p-6 shadow-2xl space-y-4 text-stone-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                    {nlText.badgeSent}
                  </span>
                  <h3 className="font-display text-base sm:text-lg font-bold text-white">
                    {nlText.subject}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLastSentNewsletterRecord(null)}
                className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
                aria-label={nlText.closeBtn}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-stone-300 flex flex-wrap items-center justify-between gap-2 bg-stone-950/80 px-3.5 py-2 rounded-xl border border-stone-800 font-mono">
              <span>
                <strong>{nlText.toLabel}</strong> {lastSentNewsletterRecord.email}
              </span>
              <span>
                <strong>{nlText.fromLabel}</strong> Braciami Ancora Cento &lt;samantamanderioli083@gmail.com&gt;
              </span>
            </div>

            {/* Contenuto Email di Benvenuto con Link di Legge in Fondo */}
            <div className="rounded-2xl overflow-hidden border border-stone-700 bg-stone-950">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-5 text-stone-950">
                <p className="text-[10px] font-black uppercase tracking-widest">
                  {nlText.storeSubtitle}
                </p>
                <h4 className="font-display text-lg sm:text-xl font-black mt-1">
                  {nlText.welcomeLead}
                </h4>
                <p className="text-xs font-bold mt-0.5">
                  Via Penzale 25, 44042 Cento (FE) · Tel. +39 051 6831000 · info@braciamiancora.it
                </p>
              </div>

              <div className="p-5 space-y-3.5 text-xs sm:text-sm text-stone-200 leading-relaxed">
                <p>
                  {nlText.greetingPrefix} (<strong>{lastSentNewsletterRecord.email}</strong>),
                </p>
                <p>
                  <strong>{nlText.welcomeLead}</strong> {nlText.welcomeSub}
                </p>

                <div className="p-4 rounded-2xl bg-stone-900 border border-amber-500/40 space-y-1.5">
                  <p className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                    {nlText.bonusTitle}
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-stone-200">
                    <li>{nlText.bonusItem1}</li>
                    <li>
                      {nlText.bonusItem2Prefix}{' '}
                      <strong className="text-amber-400 font-mono">BENVENUTO10</strong>{' '}
                      {nlText.bonusItem2Suffix}
                    </li>
                    <li>{nlText.bonusItem3}</li>
                  </ul>
                </div>

                <p className="text-xs text-stone-400">{nlText.visitNote}</p>
              </div>

              {/* Footer con i Link di Legge per la Disiscrizione */}
              <div className="bg-black/80 p-4 border-t border-stone-800 text-[11px] text-stone-400 space-y-2">
                <p>
                  <strong>{nlText.legalTitle}</strong>{' '}
                  {nlText.legalText(lastSentNewsletterRecord.email)}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={async () => {
                      await unsubscribeNewsletterByEmail(lastSentNewsletterRecord.email);
                      setLastSentNewsletterRecord(null);
                    }}
                    className="text-amber-400 hover:text-amber-300 underline font-bold cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>{nlText.unsubscribeCta}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <span>|</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLastSentNewsletterRecord(null);
                      setActivePage('privacy');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-stone-300 hover:text-white underline cursor-pointer"
                  >
                    {nlText.privacyCta}
                  </button>
                  <span>|</span>
                  <a
                    href={`mailto:info@braciamiancora.it?subject=Unsubscribe%20Newsletter%20${encodeURIComponent(
                      lastSentNewsletterRecord.email
                    )}`}
                    className="text-stone-300 hover:text-white underline"
                  >
                    {nlText.revokeEmailCta}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setLastSentNewsletterRecord(null)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs cursor-pointer"
              >
                {nlText.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
