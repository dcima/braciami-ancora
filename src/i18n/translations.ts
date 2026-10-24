import { LanguageCode } from './types';

export interface Translations {
  // Navigation & Header
  nav_intro: string;
  nav_home: string;
  nav_catalog: string;
  nav_about: string;
  nav_contact: string;
  nav_orders: string;
  nav_admin: string;
  nav_loyalty: string;
  nav_cart: string;
  cart_tooltip: string;

  // Themes
  theme_label: string;
  theme_braciami: string;
  theme_chiaro: string;

  // Language & Reset
  lang_select_title: string;
  lang_reset_locale: string;
  lang_detected_notice: string;

  // Brand Motto & Store Info
  store_name: string;
  store_motto: string;
  store_motto_quote: string;
  store_address_short: string;
  store_address_full: string;
  store_hours_summary: string;

  // Hero & Showcase
  hero_tag: string;
  hero_title_manuel: string;
  hero_subtitle_manuel: string;
  hero_quote_manuel: string;
  hero_specialty_manuel: string;
  hero_action_manuel: string;

  hero_title_samanta: string;
  hero_subtitle_samanta: string;
  hero_quote_samanta: string;
  hero_specialty_samanta: string;
  hero_action_samanta: string;

  hero_title_together: string;
  hero_subtitle_together: string;
  hero_quote_together: string;
  hero_specialty_together: string;
  hero_action_together: string;

  hero_active_offers: string;
  hero_play: string;
  hero_pause: string;

  // Catalog & Filters
  cat_all: string;
  cat_ready: string;
  cat_fresh: string;
  cat_box: string;
  cat_wine: string;
  cat_search_placeholder: string;
  cat_found_products: string;
  cat_add_to_cart: string;
  cat_view_details: string;
  cat_ready_to_eat: string;
  cat_dry_aged: string;
  cat_heat_scale: string;
  cat_cooking_time: string;
  cat_curator_manuel: string;
  cat_curator_samanta: string;
  cat_allergens_label: string;
  cat_ingredients_label: string;
  cat_no_products: string;

  // Cart Drawer
  cart_drawer_title: string;
  cart_empty_title: string;
  cart_empty_desc: string;
  cart_subtotal: string;
  cart_discount: string;
  cart_delivery: string;
  cart_total: string;
  cart_free_pickup: string;
  cart_proceed_checkout: string;
  cart_continue_shopping: string;
  cart_clear_all: string;
  cart_promo_code: string;
  cart_apply_code: string;

  // Checkout
  checkout_modal_title: string;
  checkout_step_delivery: string;
  checkout_step_details: string;
  checkout_step_payment: string;
  checkout_method_pickup: string;
  checkout_method_delivery: string;
  checkout_pickup_desc: string;
  checkout_delivery_desc: string;
  checkout_time_slot: string;
  checkout_full_name: string;
  checkout_phone: string;
  checkout_email: string;
  checkout_address: string;
  checkout_city: string;
  checkout_cap: string;
  checkout_special_notes: string;
  checkout_payment_card: string;
  checkout_payment_bancomat: string;
  checkout_payment_paypal: string;
  checkout_payment_satispay: string;
  checkout_payment_cash: string;
  checkout_pci_notice: string;
  checkout_submit_btn: string;
  checkout_success_title: string;
  checkout_success_msg: string;

  // Orders & OTP Tracking
  orders_header_badge: string;
  orders_page_title: string;
  orders_page_subtitle: string;
  orders_how_it_works_title: string;
  orders_how_it_works_1: string;
  orders_how_it_works_2: string;
  orders_how_it_works_3: string;
  orders_id_title: string;
  orders_id_subtitle: string;
  orders_input_label: string;
  orders_input_placeholder: string;
  orders_send_otp_btn: string;
  orders_sending: string;
  orders_demo_shortcuts_label: string;
  orders_sms_banner_title: string;
  orders_paste_code_btn: string;
  orders_verify_code_title: string;
  orders_verify_code_btn: string;
  orders_verify_in_progress: string;
  orders_resend_code: string;
  orders_change_phone: string;
  orders_status_received: string;
  orders_status_in_grill: string;
  orders_status_ready: string;
  orders_status_in_delivery: string;
  orders_status_completed: string;
  orders_reorder_btn: string;
  orders_logout_btn: string;

  // Footer & Newsletter
  footer_newsletter_tag: string;
  footer_newsletter_title: string;
  footer_newsletter_desc: string;
  footer_newsletter_placeholder: string;
  footer_newsletter_btn: string;
  footer_newsletter_success: string;
  footer_about_desc: string;
  footer_rights: string;
  footer_guide_brace: string;
  footer_privacy: string;

  // Modals & General
  close_modal: string;
  cancel_btn: string;
  confirm_btn: string;
  backoffice_login_title: string;
  backoffice_submit: string;
  backoffice_notice: string;
}

const RAW_TRANSLATIONS: Record<string, Translations> = {
  // -------------------------------------------------------------
  // ITALIANO (Base)
  // -------------------------------------------------------------
  it_IT: {
    nav_intro: 'Landing',
    nav_home: 'Home',
    nav_catalog: 'Prodotti',
    nav_about: 'Chi Siamo',
    nav_contact: 'Contatti',
    nav_orders: 'I Miei Ordini',
    nav_admin: 'Gestione Bottega',
    nav_loyalty: 'Punti Fedeltà',
    nav_cart: 'Carrello',
    cart_tooltip: 'Carrello della Spesa',

    theme_label: 'Tema',
    theme_braciami: 'braciami',
    theme_chiaro: 'chiaro',

    lang_select_title: 'Seleziona Lingua',
    lang_reset_locale: 'Ripristina lingua di Locale',
    lang_detected_notice: 'Lingua proposta in base alla provenienza',

    store_name: 'Braciami ancora',
    store_motto: 'Qualità al giusto prezzo',
    store_motto_quote: '“Qualità al giusto prezzo”',
    store_address_short: 'Via Penzale, 25 · Cento (FE)',
    store_address_full: 'Via Penzale, 25, 44042 Cento FE',
    store_hours_summary: 'Mar–Dom 08:30–13:30 / 17:00–21:30 · Lunedì Chiuso',

    hero_tag: 'Bottega Alimentare di Manuel & Samanta',
    hero_title_manuel: 'Manuel Cannatà',
    hero_subtitle_manuel: 'Il fuoco, la frollatura a secco e la selezione dei tagli',
    hero_quote_manuel: 'Per me "Qualità al giusto prezzo" significa selezionare solo le migliori Scottone emiliane e cuocerle sulla vera brace di legna. Nessun intermediario, nessuna scorciatoia: porti a casa una bistecca da re a un prezzo leale.',
    hero_specialty_manuel: 'Fiorentina di Scottona & Costate frollate 45gg',
    hero_action_manuel: 'Ordina la Bistecca di Manuel',

    hero_title_samanta: 'Samanta',
    hero_subtitle_samanta: 'I piatti pronti caldi, i contorni a legna e i cestini della festa',
    hero_quote_samanta: '"Qualità al giusto prezzo" per me è l\'accoglienza: preparare ogni giorno salse genuine senza conservanti, patate cotte al forno con rosmarino e cestini barbecue che regalano alle famiglie di Cento una domenica speciale.',
    hero_specialty_samanta: 'Cestini Barbecue del Weekend & Costine al miele',
    hero_action_samanta: 'Scopri i Cestini di Samanta',

    hero_title_together: 'La Coppia della Brace di Cento',
    hero_subtitle_together: 'La bottega di quartiere che unisce macelleria d\'eccellenza e cucina calda',
    hero_quote_together: 'Siamo nati con la passione per le cose buone della nostra terra. In bottega vi aspettiamo per consigliarvi il taglio perfetto o per farvi trovare la cena pronta appena sfornata dal fuoco.',
    hero_specialty_together: 'Grigliata Mista alla Centese & Degustazioni',
    hero_action_together: 'Esplora Tutto il Banco',

    hero_active_offers: 'Offerte Attive',
    hero_play: 'Avvia scorrimento',
    hero_pause: 'Pausa scorrimento',

    cat_all: 'Tutto il Banco',
    cat_ready: 'Piatti Pronti dalla Brace',
    cat_fresh: 'Carne Fresca & Frollata',
    cat_box: 'Cestini & Box Grigliata',
    cat_wine: 'Gastronomia & Vini Tipici',
    cat_search_placeholder: 'Cerca tagli frollati, costine, arrosti, salse...',
    cat_found_products: 'prodotti disponibili in bottega',
    cat_add_to_cart: 'Aggiungi al Carrello',
    cat_view_details: 'Vedi Dettagli & Allergeni',
    cat_ready_to_eat: 'Pronto da gustare caldo',
    cat_dry_aged: 'Frollatura a secco',
    cat_heat_scale: 'Intensità di brace e spezie',
    cat_cooking_time: 'Tempo medio di preparazione',
    cat_curator_manuel: 'Selezione Carni & Fuoco di Manuel',
    cat_curator_samanta: 'Ricetta di Samanta',
    cat_allergens_label: 'Allergeni verificati',
    cat_ingredients_label: 'Ingredienti & Origine',
    cat_no_products: 'Nessun prodotto trovato con i filtri selezionati.',

    cart_drawer_title: 'Il Tuo Carrello',
    cart_empty_title: 'Il carrello è vuoto',
    cart_empty_desc: 'Scegli i migliori piatti dalla brace o la carne fresca di Manuel e Samanta.',
    cart_subtotal: 'Subtotale',
    cart_discount: 'Sconto applicato',
    cart_delivery: 'Costo Consegna',
    cart_total: 'Totale Ordine',
    cart_free_pickup: 'Ritiro Gratuito in Bottega',
    cart_proceed_checkout: 'Procedi all\'Ordine',
    cart_continue_shopping: 'Continua gli acquisti',
    cart_clear_all: 'Svuota carrello',
    cart_promo_code: 'Hai un codice promo?',
    cart_apply_code: 'Applica',

    checkout_modal_title: 'Completa l\'Ordine · Bottega Braciami ancora',
    checkout_step_delivery: '1. Ritiro o Consegna',
    checkout_step_details: '2. Dati Cliente',
    checkout_step_payment: '3. Pagamento Sicuro',
    checkout_method_pickup: 'Ritiro in Bottega a Cento (Gratuito)',
    checkout_method_delivery: 'Consegna a domicilio (Cento e dintorni)',
    checkout_pickup_desc: 'Ritiro saltafila al banco in Via Penzale 25, 44042 Cento FE.',
    checkout_delivery_desc: 'Consegna calda a domicilio nel raggio di 10km da Cento.',
    checkout_time_slot: 'Fascia Oraria Desiderata',
    checkout_full_name: 'Nome e Cognome',
    checkout_phone: 'Numero di Cellulare (per OTP e avviso)',
    checkout_email: 'Indirizzo Email',
    checkout_address: 'Indirizzo di Consegna (Via e civico)',
    checkout_city: 'Città',
    checkout_cap: 'CAP',
    checkout_special_notes: 'Note per la cottura o citofono',
    checkout_payment_card: 'Carta di Credito / Bancomat (PCI-DSS Token)',
    checkout_payment_bancomat: 'PagoBancomat Contanti / POS al Ritiro',
    checkout_payment_paypal: 'PayPal Express',
    checkout_payment_satispay: 'Satispay Smart Payment',
    checkout_payment_cash: 'Contanti al Ritiro in Bottega',
    checkout_pci_notice: 'Transazione simulata conforme a standard PCI-DSS e 3D-Secure 2.2.',
    checkout_submit_btn: 'Conferma Ordine sulla Brace',
    checkout_success_title: 'Ordine Confermato con Successo!',
    checkout_success_msg: 'Manuel e Samanta hanno ricevuto la tua comanda. Puoi seguire lo stato di cottura in "I Miei Ordini".',

    orders_header_badge: 'Area Riservata Protetta da OTP',
    orders_page_title: 'I Miei Ordini & Tracciamento Brace',
    orders_page_subtitle: 'Segui in tempo reale la cottura sulla brace di legna dei tuoi tagli frollati e dei piatti caldi di Samanta.',
    orders_how_it_works_title: 'Come funziona il tracciamento brace:',
    orders_how_it_works_1: '1. Inserisci il cellulare o tocca un cliente Cento d\'esempio.',
    orders_how_it_works_2: '2. Ricevi il codice OTP di 6 cifre con notifica SMS istantanea.',
    orders_how_it_works_3: '3. Entri nella tua bacheca per vedere lo stato della brace e lo storico scontrini.',
    orders_id_title: 'Identificazione Cliente',
    orders_id_subtitle: 'Inserisci il cellulare per ricevere l\'OTP',
    orders_input_label: 'Numero di Cellulare o Email:',
    orders_input_placeholder: 'Es. +39 347 0000000 oppure marco.rossi@gmail.com',
    orders_send_otp_btn: 'Invia Codice OTP di Accesso',
    orders_sending: 'Invio in corso...',
    orders_demo_shortcuts_label: 'Accesso Rapido Clienti Cento (Demo Database SQL):',
    orders_sms_banner_title: 'SMS in Arrivo da: Braciami Cento',
    orders_paste_code_btn: 'Incolla Codice Rapido',
    orders_verify_code_title: 'Verifica Codice OTP',
    orders_verify_code_btn: 'Verifica & Accedi allo Storico',
    orders_verify_in_progress: 'Verifica in corso...',
    orders_resend_code: 'Invia un nuovo codice',
    orders_change_phone: 'Modifica recapito',
    orders_status_received: 'Ricevuto al Banco',
    orders_status_in_grill: 'In Griglia sulla Brace di Rovere',
    orders_status_ready: 'Pronto al Banco',
    orders_status_in_delivery: 'In Consegna',
    orders_status_completed: 'Consegnato / Ritirato',
    orders_reorder_btn: 'Riordina Piatti nel Carrello',
    orders_logout_btn: 'Esci',

    footer_newsletter_tag: 'Newsletter Bottega Braciami ancora',
    footer_newsletter_title: 'Ricevi le Novità sulla Brace & 5€ di Sconto',
    footer_newsletter_desc: 'Iscriviti per ricevere in anteprima i tagli frollati del weekend, le ricette di Samanta e il codice bonus BENVENUTO5.',
    footer_newsletter_placeholder: 'Inserisci la tua email...',
    footer_newsletter_btn: 'Iscriviti',
    footer_newsletter_success: 'Iscrizione confermata! Usa il codice BENVENUTO5 nel carrello.',
    footer_about_desc: 'Il negozio di alimentari e gastronomia alla brace di Manuel e Samanta a Cento (FE). Piatti caldi espressi, carni frollate e cestini per la tua famiglia.',
    footer_rights: 'Tutti i diritti riservati. Bottega artigianale di Cento.',
    footer_guide_brace: 'Guida alla Cottura su Brace',
    footer_privacy: 'Informativa Privacy & Cookie',

    close_modal: 'Chiudi finestra',
    cancel_btn: 'Annulla',
    confirm_btn: 'Conferma',
    backoffice_login_title: 'Gestione Bottega & CRM',
    backoffice_submit: 'Accedi al Backoffice',
    backoffice_notice: 'Accesso riservato a Manuel e Samanta.'
  },

  // -------------------------------------------------------------
  // INGLESE (en_US)
  // -------------------------------------------------------------
  en_US: {
    nav_intro: 'Landing',
    nav_home: 'ENTER THE SHOP',
    nav_catalog: 'Menu & Catalog',
    nav_about: 'About Us',
    nav_contact: 'How to Reach Us',
    nav_orders: 'My Orders',
    nav_admin: 'Shop Manager',
    nav_loyalty: 'Loyalty Points',
    nav_cart: 'Cart',
    cart_tooltip: 'Shopping Cart',

    theme_label: 'Theme',
    theme_braciami: 'braciami',
    theme_chiaro: 'chiaro',

    lang_select_title: 'Select Language',
    lang_reset_locale: 'Reset to System Locale',
    lang_detected_notice: 'Language proposed based on your region',

    store_name: 'Braciami ancora',
    store_motto: 'Quality at the right price',
    store_motto_quote: '“Quality at the right price”',
    store_address_short: 'Via Penzale, 25 · Cento (FE), Italy',
    store_address_full: 'Via Penzale, 25, 44042 Cento FE, Italy',
    store_hours_summary: 'Tue–Sun 08:30–13:30 / 17:00–21:30 · Closed on Mondays',

    hero_tag: 'Artisan Food & Grill Bottega by Manuel & Samanta',
    hero_title_manuel: 'Manuel Cannatà',
    hero_subtitle_manuel: 'Open hardwood embers, dry-aging and prime cut selection',
    hero_quote_manuel: 'To me, "Quality at the right price" means selecting only the finest Emilian Scottona beef and grilling it over genuine oak wood embers. No middlemen, no shortcuts: king-worthy steak at an honest price.',
    hero_specialty_manuel: 'Scottona T-Bone & 45-day Dry-Aged Ribeye',
    hero_action_manuel: 'Order Manuel\'s Steak',

    hero_title_samanta: 'Samanta',
    hero_subtitle_samanta: 'Hot prepared dishes, wood-fired sides and feast baskets',
    hero_quote_samanta: '"Quality at the right price" is genuine hospitality: cooking fresh homemade sauces without preservatives every day, roasted rosemary potatoes and barbecue boxes for Cento families.',
    hero_specialty_samanta: 'Weekend BBQ Baskets & Honey Glazed Ribs',
    hero_action_samanta: 'Discover Samanta\'s Baskets',

    hero_title_together: 'The Grill Masters of Cento',
    hero_subtitle_together: 'The local neighborhood shop blending prime butchery and hot gastronomy',
    hero_quote_together: 'We were born with a passion for authentic local produce. In our bottega, we welcome you with expert cut advice or fresh dinner straight from the fire.',
    hero_specialty_together: 'Centese Mixed Grill & Tastings',
    hero_action_together: 'Explore the Full Counter',

    hero_active_offers: 'Active Special Offers',
    hero_play: 'Resume Slideshow',
    hero_pause: 'Pause Slideshow',

    cat_all: 'All Counter Products',
    cat_ready: 'Hot Wood-Fired Dishes',
    cat_fresh: 'Fresh & Dry-Aged Cuts',
    cat_box: 'Barbecue Boxes & Baskets',
    cat_wine: 'Delicatessen & Local Wines',
    cat_search_placeholder: 'Search dry-aged cuts, ribs, roasts, sauces...',
    cat_found_products: 'products available in shop',
    cat_add_to_cart: 'Add to Cart',
    cat_view_details: 'View Details & Allergens',
    cat_ready_to_eat: 'Ready to enjoy hot',
    cat_dry_aged: 'Dry-aged beef',
    cat_heat_scale: 'Ember warmth & spice level',
    cat_cooking_time: 'Average preparation time',
    cat_curator_manuel: 'Manuel\'s Meat & Flame Selection',
    cat_curator_samanta: 'Samanta\'s Homemade Recipe',
    cat_allergens_label: 'Verified Allergens',
    cat_ingredients_label: 'Ingredients & Provenance',
    cat_no_products: 'No products found with selected filters.',

    cart_drawer_title: 'Your Cart',
    cart_empty_title: 'Your cart is empty',
    cart_empty_desc: 'Select the finest grilled dishes or fresh butcher cuts from Manuel & Samanta.',
    cart_subtotal: 'Subtotal',
    cart_discount: 'Discount applied',
    cart_delivery: 'Delivery Fee',
    cart_total: 'Order Total',
    cart_free_pickup: 'Free In-Store Pickup',
    cart_proceed_checkout: 'Proceed to Checkout',
    cart_continue_shopping: 'Continue shopping',
    cart_clear_all: 'Empty cart',
    cart_promo_code: 'Have a promo coupon?',
    cart_apply_code: 'Apply',

    checkout_modal_title: 'Complete Your Order · Bottega Braciami ancora',
    checkout_step_delivery: '1. Pickup or Delivery',
    checkout_step_details: '2. Customer Details',
    checkout_step_payment: '3. Secure Payment',
    checkout_method_pickup: 'In-Store Pickup in Cento (Free)',
    checkout_method_delivery: 'Home Delivery (Cento area)',
    checkout_pickup_desc: 'Express queue-jump pickup at Via Penzale 25, 44042 Cento FE.',
    checkout_delivery_desc: 'Hot food delivered to your door within 10 km from Cento.',
    checkout_time_slot: 'Desired Time Slot',
    checkout_full_name: 'Full Name',
    checkout_phone: 'Mobile Phone (for OTP & delivery updates)',
    checkout_email: 'Email Address',
    checkout_address: 'Delivery Address (Street & number)',
    checkout_city: 'City',
    checkout_cap: 'Postal Code',
    checkout_special_notes: 'Grill cooking preferences or intercom instructions',
    checkout_payment_card: 'Credit / Debit Card (PCI-DSS Token)',
    checkout_payment_bancomat: 'PagoBancomat / POS at Pickup',
    checkout_payment_paypal: 'PayPal Express',
    checkout_payment_satispay: 'Satispay Smart Payment',
    checkout_payment_cash: 'Cash upon Pickup in Bottega',
    checkout_pci_notice: 'Simulated transaction compliant with PCI-DSS and 3D-Secure 2.2 protocols.',
    checkout_submit_btn: 'Confirm Flame-Grilled Order',
    checkout_success_title: 'Order Confirmed Successfully!',
    checkout_success_msg: 'Manuel & Samanta have received your order. Track live grill preparation in "My Orders".',

    orders_header_badge: 'Private Area Protected by OTP',
    orders_page_title: 'My Orders & Flame Tracking',
    orders_page_subtitle: 'Follow the live hardwood ember cooking of your dry-aged cuts and hot dishes in real time.',
    orders_how_it_works_title: 'How grill tracking works:',
    orders_how_it_works_1: '1. Enter your mobile phone or click a demo Cento customer profile below.',
    orders_how_it_works_2: '2. Receive your 6-digit OTP code via instant simulated SMS.',
    orders_how_it_works_3: '3. Access your dashboard to view live grill status and past receipts.',
    orders_id_title: 'Customer Verification',
    orders_id_subtitle: 'Enter your phone number to receive the OTP',
    orders_input_label: 'Mobile Phone or Email:',
    orders_input_placeholder: 'E.g. +39 347 0000000 or marco.rossi@gmail.com',
    orders_send_otp_btn: 'Send Access OTP Code',
    orders_sending: 'Sending...',
    orders_demo_shortcuts_label: 'Quick Cento Customer Demo Access (SQL Database):',
    orders_sms_banner_title: 'Incoming SMS from: Braciami Cento',
    orders_paste_code_btn: 'Paste Quick Code',
    orders_verify_code_title: 'Verify OTP Code',
    orders_verify_code_btn: 'Verify & Access Order History',
    orders_verify_in_progress: 'Verifying...',
    orders_resend_code: 'Request a new code',
    orders_change_phone: 'Change phone number',
    orders_status_received: 'Received at Counter',
    orders_status_in_grill: 'Grilling on Oak Embers',
    orders_status_ready: 'Ready at Counter',
    orders_status_in_delivery: 'Out for Delivery',
    orders_status_completed: 'Delivered / Picked Up',
    orders_reorder_btn: 'Reorder Items to Cart',
    orders_logout_btn: 'Log Out',

    footer_newsletter_tag: 'Braciami ancora Bottega Newsletter',
    footer_newsletter_title: 'Receive Grill News & a €5 Welcome Bonus',
    footer_newsletter_desc: 'Subscribe to get early access to weekend dry-aged cuts, Samanta\'s recipes and bonus code BENVENUTO5.',
    footer_newsletter_placeholder: 'Enter your email...',
    footer_newsletter_btn: 'Subscribe',
    footer_newsletter_success: 'Subscription confirmed! Use code BENVENUTO5 in your cart.',
    footer_about_desc: 'Manuel and Samanta\'s gourmet butcher shop and wood grill kitchen in Cento (FE), Italy. Fresh cuts, barbecue boxes and honest food.',
    footer_rights: 'All rights reserved. Artisan Bottega in Cento.',
    footer_guide_brace: 'Wood Grill Cooking Guide',
    footer_privacy: 'Privacy & Cookie Policy',

    close_modal: 'Close window',
    cancel_btn: 'Cancel',
    confirm_btn: 'Confirm',
    backoffice_login_title: 'Store Management & CRM',
    backoffice_submit: 'Access Backoffice',
    backoffice_notice: 'Restricted area for Manuel and Samanta.'
  },

  // -------------------------------------------------------------
  // FRANCESE (fr_FR)
  // -------------------------------------------------------------
  fr_FR: {
    nav_intro: 'Landing',
    nav_home: 'Entra in negozio',
    nav_catalog: 'Menu & Catalogue',
    nav_about: 'Qui Sommes-Nous',
    nav_contact: 'Nous Rejoindre',
    nav_orders: 'Mes Commandes',
    nav_admin: 'Gestion Boutique',
    nav_loyalty: 'Points Fidélité',
    nav_cart: 'Panier',
    cart_tooltip: 'Panier d\'achats',

    theme_label: 'Thème',
    theme_braciami: 'braciami',
    theme_chiaro: 'chiaro',

    lang_select_title: 'Choisir la Langue',
    lang_reset_locale: 'Réinitialiser à la langue locale',
    lang_detected_notice: 'Langue proposée selon votre localisation',

    store_name: 'Braciami ancora',
    store_motto: 'La qualité au juste prix',
    store_motto_quote: '« La qualité au juste prix »',
    store_address_short: 'Via Penzale, 25 · Cento (FE), Italie',
    store_address_full: 'Via Penzale, 25, 44042 Cento FE, Italie',
    store_hours_summary: 'Mar–Dim 08:30–13:30 / 17:00–21:30 · Fermé le lundi',

    hero_tag: 'Épicerie Gourmande & Braise par Manuel & Samanta',
    hero_title_manuel: 'Manuel Cannatà',
    hero_subtitle_manuel: 'Braise de chêne dur, maturation à sec et viandes sélectionnées',
    hero_quote_manuel: 'Pour moi, "La qualité au juste prix" signifie sélectionner les meilleures génisses émiliennes et les cuire sur de vraies braises de chêne. Aucun intermédiaire : un steak royal à un prix loyal.',
    hero_specialty_manuel: 'Fiorentina de Scottona & Côtes maturées 45 jours',
    hero_action_manuel: 'Commander le Steak de Manuel',

    hero_title_samanta: 'Samanta',
    hero_subtitle_samanta: 'Plats cuisinés chauds, garnitures au feu de bois et coffrets',
    hero_quote_samanta: '"La qualité au juste prix", c\'est l\'accueil : sauces maison sans conservateurs chaque jour, pommes de terre rôties au romarin et paniers barbecue festifs pour les familles.',
    hero_specialty_samanta: 'Paniers Barbecue du Week-end & Travers au miel',
    hero_action_samanta: 'Découvrir les Paniers de Samanta',

    hero_title_together: 'Les Maîtres de la Braise de Cento',
    hero_subtitle_together: 'Boutique de quartier alliant boucherie d\'exception et cuisine chaude',
    hero_quote_together: 'Nous sommes nés avec l\'amour du terroir émilien. En boutique, nous vous conseillons le morceau parfait ou préparons votre dîner chaud tout juste sorti du feu.',
    hero_specialty_together: 'Grillade Mixte à la Centese & Dégustations',
    hero_action_together: 'Explorer Tout l\'Étal',

    hero_active_offers: 'Offres du Moment',
    hero_play: 'Démarrer le diaporama',
    hero_pause: 'Mettre en pause',

    cat_all: 'Tout le Comptoir',
    cat_ready: 'Plats Chauds de la Braise',
    cat_fresh: 'Viande Fraîche & Maturée',
    cat_box: 'Paniers & Coffrets Barbecue',
    cat_wine: 'Gastronomie & Vins d\'Émilie',
    cat_search_placeholder: 'Rechercher viandes maturées, côtes, rôtis, sauces...',
    cat_found_products: 'produits disponibles en boutique',
    cat_add_to_cart: 'Ajouter au Panier',
    cat_view_details: 'Détails & Allergènes',
    cat_ready_to_eat: 'Prêt à savourer chaud',
    cat_dry_aged: 'Maturation à sec',
    cat_heat_scale: 'Intensité de braise et d\'épices',
    cat_cooking_time: 'Temps moyen de préparation',
    cat_curator_manuel: 'Sélection Viandes & Braise de Manuel',
    cat_curator_samanta: 'Recette Maison de Samanta',
    cat_allergens_label: 'Allergènes vérifiés',
    cat_ingredients_label: 'Ingrédients & Origine',
    cat_no_products: 'Aucun produit ne correspond à vos filtres.',

    cart_drawer_title: 'Votre Panier',
    cart_empty_title: 'Votre panier est vide',
    cart_empty_desc: 'Choisissez les meilleurs plats au feu de bois ou les viandes fraîches de Manuel et Samanta.',
    cart_subtotal: 'Sous-total',
    cart_discount: 'Remise appliquée',
    cart_delivery: 'Frais de livraison',
    cart_total: 'Total de la Commande',
    cart_free_pickup: 'Retrait Gratuit en Boutique',
    cart_proceed_checkout: 'Valider la Commande',
    cart_continue_shopping: 'Continuer mes achats',
    cart_clear_all: 'Vider le panier',
    cart_promo_code: 'Avez-vous un code promo ?',
    cart_apply_code: 'Appliquer',

    checkout_modal_title: 'Finaliser la Commande · Bottega Braciami ancora',
    checkout_step_delivery: '1. Retrait ou Livraison',
    checkout_step_details: '2. Coordonnées Client',
    checkout_step_payment: '3. Paiement Sécurisé',
    checkout_method_pickup: 'Retrait en Boutique à Cento (Gratuit)',
    checkout_method_delivery: 'Livraison à domicile (Cento et alentours)',
    checkout_pickup_desc: 'Retrait coupe-file au comptoir : Via Penzale 25, 44042 Cento FE.',
    checkout_delivery_desc: 'Plats chauds livrés directement chez vous dans un rayon de 10 km.',
    checkout_time_slot: 'Créneau Horaire Souhaité',
    checkout_full_name: 'Nom et Prénom',
    checkout_phone: 'Numéro de Portable (pour l\'OTP)',
    checkout_email: 'Adresse Email',
    checkout_address: 'Adresse de livraison (Rue et numéro)',
    checkout_city: 'Ville',
    checkout_cap: 'Code Postal',
    checkout_special_notes: 'Instructions de cuisson ou digicode',
    checkout_payment_card: 'Carte Bancaire (Token PCI-DSS)',
    checkout_payment_bancomat: 'Carte / Espèces au Retrait',
    checkout_payment_paypal: 'PayPal Express',
    checkout_payment_satispay: 'Paiement Satispay',
    checkout_payment_cash: 'Paiement au Retrait en Boutique',
    checkout_pci_notice: 'Transaction simulée conforme aux protocoles de sécurité PCI-DSS et 3D-Secure 2.2.',
    checkout_submit_btn: 'Confirmer la Commande sur la Braise',
    checkout_success_title: 'Commande Confirmée avec Succès !',
    checkout_success_msg: 'Manuel et Samanta préparent votre festin. Suivez la cuisson dans "Mes Commandes".',

    orders_header_badge: 'Espace Réservé Protégé par OTP',
    orders_page_title: 'Mes Commandes & Suivi Braise',
    orders_page_subtitle: 'Suivez la cuisson en direct sur la braise de chêne de vos viandes maturées et plats chauds.',
    orders_how_it_works_title: 'Fonctionnement du suivi braise :',
    orders_how_it_works_1: '1. Saisissez votre numéro ou cliquez sur un profil de démonstration Cento.',
    orders_how_it_works_2: '2. Recevez votre code OTP à 6 chiffres par SMS simulé instantané.',
    orders_how_it_works_3: '3. Accédez à votre tableau de bord pour voir l\'état du feu et vos reçus.',
    orders_id_title: 'Identification Client',
    orders_id_subtitle: 'Entrez votre numéro pour recevoir l\'OTP',
    orders_input_label: 'Téléphone Portable ou Email :',
    orders_input_placeholder: 'Ex. +39 347 0000000 ou client@gmail.com',
    orders_send_otp_btn: 'Envoyer le Code OTP d\'Accès',
    orders_sending: 'Envoi en cours...',
    orders_demo_shortcuts_label: 'Accès Rapide Démo Clients Cento (Base de Données SQL) :',
    orders_sms_banner_title: 'SMS Reçu de : Braciami Cento',
    orders_paste_code_btn: 'Coller le Code Rapide',
    orders_verify_code_title: 'Vérification du Code OTP',
    orders_verify_code_btn: 'Vérifier & Consulter l\'Historique',
    orders_verify_in_progress: 'Vérification en cours...',
    orders_resend_code: 'Renvoyer un nouveau code',
    orders_change_phone: 'Modifier le numéro',
    orders_status_received: 'Reçu au Comptoir',
    orders_status_in_grill: 'Sur la Braise de Chêne',
    orders_status_ready: 'Prêt au Comptoir',
    orders_status_in_delivery: 'En Cours de Livraison',
    orders_status_completed: 'Livré / Retiré',
    orders_reorder_btn: 'Ajouter à Nouveau au Panier',
    orders_logout_btn: 'Se Déconnecter',

    footer_newsletter_tag: 'Newsletter Boutique Braciami ancora',
    footer_newsletter_title: 'Recevez les Nouvelles du Feu & 5€ de Réduction',
    footer_newsletter_desc: 'Inscrivez-vous pour découvrir les viandes maturées du week-end, les recettes de Samanta et le code BENVENUTO5.',
    footer_newsletter_placeholder: 'Votre adresse email...',
    footer_newsletter_btn: 'S\'inscrire',
    footer_newsletter_success: 'Inscription confirmée ! Utilisez le code BENVENUTO5 dans votre panier.',
    footer_about_desc: 'Épicerie gourmande et cuisine à la braise de Manuel et Samanta à Cento (FE), Italie. Plats chauds, viandes maturées et authenticité.',
    footer_rights: 'Tous droits réservés. Épicerie artisanale de Cento.',
    footer_guide_brace: 'Guide de Cuisson sur la Braise',
    footer_privacy: 'Politique de Confidentialité',

    close_modal: 'Fermer',
    cancel_btn: 'Annuler',
    confirm_btn: 'Confirmer',
    backoffice_login_title: 'Gestion Boutique & CRM',
    backoffice_submit: 'Accéder au Backoffice',
    backoffice_notice: 'Espace réservé à Manuel et Samanta.'
  },

  // -------------------------------------------------------------
  // TEDESCO (de_DE)
  // -------------------------------------------------------------
  de_DE: {
    nav_intro: 'Landing',
    nav_home: 'Entra in negozio',
    nav_catalog: 'Speisekarte & Katalog',
    nav_about: 'Über Uns',
    nav_contact: 'Anfahrt & Kontakt',
    nav_orders: 'Meine Bestellungen',
    nav_admin: 'Ladenverwaltung',
    nav_loyalty: 'Treuepunkte',
    nav_cart: 'Warenkorb',
    cart_tooltip: 'Warenkorb',

    theme_label: 'Design',
    theme_braciami: 'braciami',
    theme_chiaro: 'chiaro',

    lang_select_title: 'Sprache Wählen',
    lang_reset_locale: 'Auf Systemsprache zurücksetzen',
    lang_detected_notice: 'Sprache basierend auf Ihrem Standort vorgeschlagen',

    store_name: 'Braciami ancora',
    store_motto: 'Qualität zum fairen Preis',
    store_motto_quote: '„Qualität zum fairen Preis“',
    store_address_short: 'Via Penzale, 25 · Cento (FE), Italien',
    store_address_full: 'Via Penzale, 25, 44042 Cento FE, Italien',
    store_hours_summary: 'Di–So 08:30–13:30 / 17:00–21:30 · Montags geschlossen',

    hero_tag: 'Feinkost & Holzkohlegrill von Manuel & Samanta',
    hero_title_manuel: 'Manuel Cannatà',
    hero_subtitle_manuel: 'Eichenglut, Dry-Aging und beste Fleischauswahl',
    hero_quote_manuel: 'Für mich bedeutet „Qualität zum fairen Preis“, nur die besten emilianischen Scottona-Rinder auszuwählen und über echter Eichenholzkohle zu grillen. Ohne Zwischenhändler, königlicher Genuss zu fairen Konditionen.',
    hero_specialty_manuel: 'Scottona T-Bone & 45 Tage gereiftes Ribeye',
    hero_action_manuel: 'Manuels Steak bestellen',

    hero_title_samanta: 'Samanta',
    hero_subtitle_samanta: 'Heiße Gerichte, Holzofen-Beilagen und Grillkörbe',
    hero_quote_samanta: '„Qualität zum fairen Preis“ ist echte Gastfreundschaft: täglich frische Saucen ohne Konservierungsstoffe, Rosmarinkartoffeln und feine Barbecue-Körbe für Familien.',
    hero_specialty_samanta: 'Wochenend-Grillkörbe & Honig-Rippchen',
    hero_action_samanta: 'Samantas Körbe entdecken',

    hero_title_together: 'Die Grillmeister von Cento',
    hero_subtitle_together: 'Traditionelle Metzgerei und frische heiße Küche vereint',
    hero_quote_together: 'Wir lieben die kulinarischen Schätze unserer Region. In unserer Bottega beraten wir Sie gerne zum perfekten Fleischstück oder bereiten Ihr Abendessen frisch vom Feuer zu.',
    hero_specialty_together: 'Gemischte Grillplatte nach Cento-Art',
    hero_action_together: 'Die gesamte Theke erkunden',

    hero_active_offers: 'Aktuelle Angebote',
    hero_play: 'Diashow starten',
    hero_pause: 'Diashow anhalten',

    cat_all: 'Die gesamte Theke',
    cat_ready: 'Frisch vom Holzkohlegrill',
    cat_fresh: 'Frisches & Dry-Aged Fleisch',
    cat_box: 'Grillboxen & Gourmetkörbe',
    cat_wine: 'Feinkost & Regionale Weine',
    cat_search_placeholder: 'Dry-Aged Cuts, Rippchen, Braten, Saucen...',
    cat_found_products: 'Produkte in der Bottega verfügbar',
    cat_add_to_cart: 'In den Warenkorb',
    cat_view_details: 'Details & Allergene',
    cat_ready_to_eat: 'Verzehrfertig und warm',
    cat_dry_aged: 'Dry-Aged gereift',
    cat_heat_scale: 'Glut- und Schärfegrad',
    cat_cooking_time: 'Zubereitungszeit',
    cat_curator_manuel: 'Manuels Fleisch- & Glutauswahl',
    cat_curator_samanta: 'Samantas Hausrezept',
    cat_allergens_label: 'Geprüfte Allergene',
    cat_ingredients_label: 'Zutaten & Herkunft',
    cat_no_products: 'Keine Produkte gefunden.',

    cart_drawer_title: 'Ihr Warenkorb',
    cart_empty_title: 'Ihr Warenkorb ist leer',
    cart_empty_desc: 'Wählen Sie feine Grillgerichte oder frisches Fleisch von Manuel und Samanta.',
    cart_subtotal: 'Zwischensumme',
    cart_discount: 'Rabatt',
    cart_delivery: 'Liefergebühr',
    cart_total: 'Gesamtsumme',
    cart_free_pickup: 'Kostenlose Abholung im Laden',
    cart_proceed_checkout: 'Zur Kasse',
    cart_continue_shopping: 'Weiter einkaufen',
    cart_clear_all: 'Warenkorb leeren',
    cart_promo_code: 'Gutscheincode vorhanden?',
    cart_apply_code: 'Einlösen',

    checkout_modal_title: 'Bestellung abschließen · Bottega Braciami ancora',
    checkout_step_delivery: '1. Abholung oder Lieferung',
    checkout_step_details: '2. Kundendaten',
    checkout_step_payment: '3. Sichere Bezahlung',
    checkout_method_pickup: 'Abholung in Cento (Kostenlos)',
    checkout_method_delivery: 'Lieferung nach Hause (Raum Cento)',
    checkout_pickup_desc: 'Express-Abholung: Via Penzale 25, 44042 Cento FE.',
    checkout_delivery_desc: 'Heiße Lieferung im Umkreis von 10 km.',
    checkout_time_slot: 'Gewünschtes Zeitfenster',
    checkout_full_name: 'Vor- und Nachname',
    checkout_phone: 'Mobilnummer (für OTP-Bestätigung)',
    checkout_email: 'E-Mail-Adresse',
    checkout_address: 'Lieferadresse (Straße und Hausnummer)',
    checkout_city: 'Stadt',
    checkout_cap: 'Postleitzahl',
    checkout_special_notes: 'Gargrad-Wünsche oder Hinweise zur Klingel',
    checkout_payment_card: 'Kredit- / Debitkarte (PCI-DSS Token)',
    checkout_payment_bancomat: 'EC-Karte / Bar bei Abholung',
    checkout_payment_paypal: 'PayPal Express',
    checkout_payment_satispay: 'Satispay Smart Payment',
    checkout_payment_cash: 'Barzahlung bei Abholung',
    checkout_pci_notice: 'Simulierte Transaktion nach PCI-DSS und 3D-Secure 2.2 Standards.',
    checkout_submit_btn: 'Bestellung verbindlich aufgeben',
    checkout_success_title: 'Bestellung erfolgreich aufgegeben!',
    checkout_success_msg: 'Manuel und Samanta bereiten Ihre Bestellung vor. Verfolgen Sie den Grillstatus in „Meine Bestellungen“.',

    orders_header_badge: 'Geschützter Bereich mit OTP-Zugang',
    orders_page_title: 'Meine Bestellungen & Grill-Tracking',
    orders_page_subtitle: 'Verfolgen Sie die Zubereitung Ihrer Steaks auf der echten Eichenglut in Echtzeit.',
    orders_how_it_works_title: 'So funktioniert das Grill-Tracking:',
    orders_how_it_works_1: '1. Handynummer eingeben oder Demo-Konto aus Cento wählen.',
    orders_how_it_works_2: '2. 6-stelligen OTP-Code per Sofort-SMS erhalten.',
    orders_how_it_works_3: '3. Status auf dem Grill und bisherige Quittungen einsehen.',
    orders_id_title: 'Kunden-Identifikation',
    orders_id_subtitle: 'Mobilnummer eingeben, um OTP zu erhalten',
    orders_input_label: 'Mobilnummer oder E-Mail:',
    orders_input_placeholder: 'Z.B. +39 347 0000000 oder name@gmail.com',
    orders_send_otp_btn: 'OTP-Zugangscode anfordern',
    orders_sending: 'Wird gesendet...',
    orders_demo_shortcuts_label: 'Schnellzugriff Demo-Kunden Cento (SQL-Datenbank):',
    orders_sms_banner_title: 'Eingehende SMS von: Braciami Cento',
    orders_paste_code_btn: 'Code automatisch einfügen',
    orders_verify_code_title: 'OTP-Code bestätigen',
    orders_verify_code_btn: 'Bestätigen & Historie öffnen',
    orders_verify_in_progress: 'Wird überprüft...',
    orders_resend_code: 'Neuen Code anfordern',
    orders_change_phone: 'Nummer ändern',
    orders_status_received: 'Eingegangen',
    orders_status_in_grill: 'Auf dem Eichenholz-Grill',
    orders_status_ready: 'Abholbereit an der Theke',
    orders_status_in_delivery: 'In Auslieferung',
    orders_status_completed: 'Abgeschlossen',
    orders_reorder_btn: 'Erneut in den Warenkorb',
    orders_logout_btn: 'Abmelden',

    footer_newsletter_tag: 'Newsletter Bottega Braciami ancora',
    footer_newsletter_title: 'Grillneuheiten & 5 € Willkommensgutschein',
    footer_newsletter_desc: 'Jetzt anmelden für die besten Fleischstücke am Wochenende, Samantas Rezepte und Gutscheincode BENVENUTO5.',
    footer_newsletter_placeholder: 'Ihre E-Mail-Adresse...',
    footer_newsletter_btn: 'Anmelden',
    footer_newsletter_success: 'Anmeldung bestätigt! Gutscheincode BENVENUTO5 im Warenkorb nutzen.',
    footer_about_desc: 'Feinkost und Fleisch vom Holzkohlegrill von Manuel und Samanta in Cento (FE), Italien. Hausgemachte Speisen, gereiftes Fleisch und Genuss.',
    footer_rights: 'Alle Rechte vorbehalten. Handwerksbetrieb in Cento.',
    footer_guide_brace: 'Anleitung: Fleisch über Glut grillen',
    footer_privacy: 'Datenschutz & Cookies',

    close_modal: 'Schließen',
    cancel_btn: 'Abbrechen',
    confirm_btn: 'Bestätigen',
    backoffice_login_title: 'Ladenverwaltung & CRM',
    backoffice_submit: 'Anmelden',
    backoffice_notice: 'Geschützter Bereich für Manuel und Samanta.'
  },

  // -------------------------------------------------------------
  // SPAGNOLO (es_ES)
  // -------------------------------------------------------------
  es_ES: {
    nav_intro: 'Landing',
    nav_home: 'Entra in negozio',
    nav_catalog: 'Menú & Catálogo',
    nav_about: 'Quiénes Somos',
    nav_contact: 'Cómo Llegar',
    nav_orders: 'Mis Pedidos',
    nav_admin: 'Gestión Tienda',
    nav_loyalty: 'Puntos Fidelidad',
    nav_cart: 'Carrito',
    cart_tooltip: 'Carrito de compras',

    theme_label: 'Tema',
    theme_braciami: 'braciami',
    theme_chiaro: 'chiaro',

    lang_select_title: 'Seleccionar Idioma',
    lang_reset_locale: 'Restablecer al idioma local',
    lang_detected_notice: 'Idioma sugerido según tu ubicación',

    store_name: 'Braciami ancora',
    store_motto: 'Calidad al precio justo',
    store_motto_quote: '«Calidad al precio justo»',
    store_address_short: 'Via Penzale, 25 · Cento (FE), Italia',
    store_address_full: 'Via Penzale, 25, 44042 Cento FE, Italia',
    store_hours_summary: 'Mar–Dom 08:30–13:30 / 17:00–21:30 · Lunes cerrado',

    hero_tag: 'Tienda de Comestibles y Brasa de Manuel & Samanta',
    hero_title_manuel: 'Manuel Cannatà',
    hero_subtitle_manuel: 'Fuego vivo de roble, maduración en seco y cortes seleccionados',
    hero_quote_manuel: 'Para mí, "Calidad al precio justo" significa seleccionar las mejores terneras emilianas y asarlas sobre auténtica brasa de leña. Sin intermediarios: un chuletón de reyes a un precio leal.',
    hero_specialty_manuel: 'Fiorentina de Scottona & Lomo madurado 45 días',
    hero_action_manuel: 'Pedir el Chuletón de Manuel',

    hero_title_samanta: 'Samanta',
    hero_subtitle_samanta: 'Platos calientes listos, guarniciones a la leña y cestas festivas',
    hero_quote_samanta: '"Calidad al precio justo" es hospitalidad: salsas caseras sin conservantes a diario, patatas asadas con romero y cajas barbacoa para que las familias disfruten el domingo.',
    hero_specialty_samanta: 'Cestas Barbacoa de Fin de Semana & Costillas a la miel',
    hero_action_samanta: 'Descubrir las Cestas de Samanta',

    hero_title_together: 'Los Maestros de la Brasa de Cento',
    hero_subtitle_together: 'La bottega de barrio que une carnicería selecta y cocina caliente',
    hero_quote_together: 'Nacimos con la pasión por los productos de nuestra tierra. En tienda te aconsejamos el corte perfecto o te preparamos la cena caliente recién salida de la brasa.',
    hero_specialty_together: 'Parrillada Mixta a la Centese',
    hero_action_together: 'Explorar Todo el Mostrador',

    hero_active_offers: 'Ofertas Activas',
    hero_play: 'Iniciar carrusel',
    hero_pause: 'Pausar carrusel',

    cat_all: 'Todo el Mostrador',
    cat_ready: 'Platos Calientes de la Brasa',
    cat_fresh: 'Carne Fresca & Madurada',
    cat_box: 'Cestas & Cajas Barbacoa',
    cat_wine: 'Gastronomía & Vinos Locales',
    cat_search_placeholder: 'Buscar carnes maduradas, costillas, asados, salsas...',
    cat_found_products: 'productos disponibles en la bottega',
    cat_add_to_cart: 'Añadir al Carrito',
    cat_view_details: 'Ver Detalles & Alérgenos',
    cat_ready_to_eat: 'Listo para comer caliente',
    cat_dry_aged: 'Maduración Dry-Aged',
    cat_heat_scale: 'Intensidad de brasa y especias',
    cat_cooking_time: 'Tiempo medio de preparación',
    cat_curator_manuel: 'Selección de Carnes & Fuego de Manuel',
    cat_curator_samanta: 'Receta Casera de Samanta',
    cat_allergens_label: 'Alérgenos verificados',
    cat_ingredients_label: 'Ingredientes & Origen',
    cat_no_products: 'No se encontraron productos con los filtros seleccionados.',

    cart_drawer_title: 'Tu Carrito',
    cart_empty_title: 'Tu carrito está vacío',
    cart_empty_desc: 'Elige los mejores platos a la brasa o carne fresca de Manuel y Samanta.',
    cart_subtotal: 'Subtotal',
    cart_discount: 'Descuento aplicado',
    cart_delivery: 'Gastos de envío',
    cart_total: 'Total del Pedido',
    cart_free_pickup: 'Recogida Gratuita en Tienda',
    cart_proceed_checkout: 'Tramitar Pedido',
    cart_continue_shopping: 'Seguir comprando',
    cart_clear_all: 'Vaciar carrito',
    cart_promo_code: '¿Tienes un código promocional?',
    cart_apply_code: 'Aplicar',

    checkout_modal_title: 'Completar Pedido · Bottega Braciami ancora',
    checkout_step_delivery: '1. Recogida o Envío',
    checkout_step_details: '2. Datos del Cliente',
    checkout_step_payment: '3. Pago Seguro',
    checkout_method_pickup: 'Recogida en Tienda en Cento (Gratis)',
    checkout_method_delivery: 'Envío a domicilio (Área de Cento)',
    checkout_pickup_desc: 'Recogida directa sin colas en Via Penzale 25, 44042 Cento FE.',
    checkout_delivery_desc: 'Comida caliente entregada a domicilio en un radio de 10 km.',
    checkout_time_slot: 'Franja Horaria Deseada',
    checkout_full_name: 'Nombre y Apellidos',
    checkout_phone: 'Teléfono Móvil (para el código OTP)',
    checkout_email: 'Correo Electrónico',
    checkout_address: 'Dirección de entrega (Calle y número)',
    checkout_city: 'Ciudad',
    checkout_cap: 'Código Postal',
    checkout_special_notes: 'Punto de cocción o indicaciones para el timbre',
    checkout_payment_card: 'Tarjeta de Crédito / Débito (PCI-DSS Token)',
    checkout_payment_bancomat: 'Tarjeta / Efectivo al recoger',
    checkout_payment_paypal: 'PayPal Express',
    checkout_payment_satispay: 'Satispay Smart Payment',
    checkout_payment_cash: 'Efectivo al Recoger en Bottega',
    checkout_pci_notice: 'Transacción simulada conforme a estándares PCI-DSS y 3D-Secure 2.2.',
    checkout_submit_btn: 'Confirmar Pedido a la Brasa',
    checkout_success_title: '¡Pedido Confirmado con Éxito!',
    checkout_success_msg: 'Manuel y Samanta están preparando tu comida. Puedes seguir la cocción en "Mis Pedidos".',

    orders_header_badge: 'Área Privada Protegida con OTP',
    orders_page_title: 'Mis Pedidos & Seguimiento Brasa',
    orders_page_subtitle: 'Sigue en directo la cocción sobre brasa de roble de tus cortes madurados y platos calientes.',
    orders_how_it_works_title: 'Cómo funciona el seguimiento de la brasa:',
    orders_how_it_works_1: '1. Introduce tu teléfono móvil o pulsa un cliente demo de Cento.',
    orders_how_it_works_2: '2. Recibe el código OTP de 6 dígitos por SMS simulado al instante.',
    orders_how_it_works_3: '3. Entra a tu panel para ver el estado del fuego y tus tickets.',
    orders_id_title: 'Identificación de Cliente',
    orders_id_subtitle: 'Introduce tu teléfono para recibir el OTP',
    orders_input_label: 'Teléfono Móvil o Correo:',
    orders_input_placeholder: 'Ej. +39 347 0000000 o correo@gmail.com',
    orders_send_otp_btn: 'Enviar Código OTP de Acceso',
    orders_sending: 'Enviando...',
    orders_demo_shortcuts_label: 'Acceso Rápido Clientes Demo Cento (Base de Datos SQL):',
    orders_sms_banner_title: 'SMS Entrante de: Braciami Cento',
    orders_paste_code_btn: 'Pegar Código Rápido',
    orders_verify_code_title: 'Verificar Código OTP',
    orders_verify_code_btn: 'Verificar y Ver Historial',
    orders_verify_in_progress: 'Verificando...',
    orders_resend_code: 'Enviar un nuevo código',
    orders_change_phone: 'Cambiar número',
    orders_status_received: 'Recibido en Mostrador',
    orders_status_in_grill: 'En la Parrilla con Brasa de Roble',
    orders_status_ready: 'Listo en Mostrador',
    orders_status_in_delivery: 'En Reparto',
    orders_status_completed: 'Entregado / Recogido',
    orders_reorder_btn: 'Volver a Pedir al Carrito',
    orders_logout_btn: 'Cerrar Sesión',

    footer_newsletter_tag: 'Boletín Bottega Braciami ancora',
    footer_newsletter_title: 'Novedades de la Brasa & 5 € de Descuento',
    footer_newsletter_desc: 'Suscríbete para recibir en primicia los cortes del fin de semana, recetas de Samanta y el código BENVENUTO5.',
    footer_newsletter_placeholder: 'Introduce tu correo...',
    footer_newsletter_btn: 'Suscribirse',
    footer_newsletter_success: '¡Suscripción confirmada! Usa el código BENVENUTO5 en tu carrito.',
    footer_about_desc: 'Tienda de alimentación y asador a la brasa de Manuel y Samanta en Cento (FE), Italia. Platos calientes, carnes maduradas y cercanía.',
    footer_rights: 'Todos los derechos reservados. Bottega artesanal de Cento.',
    footer_guide_brace: 'Guía de Cocción a la Brasa',
    footer_privacy: 'Política de Privacidad & Cookies',

    close_modal: 'Cerrar ventana',
    cancel_btn: 'Cancelar',
    confirm_btn: 'Confirmar',
    backoffice_login_title: 'Gestión Tienda & CRM',
    backoffice_submit: 'Entrar al Backoffice',
    backoffice_notice: 'Área reservada para Manuel y Samanta.'
  },

  // -------------------------------------------------------------
  // CINESE (zh_CN)
  // -------------------------------------------------------------
  zh_CN: {
    nav_intro: 'Landing',
    nav_home: 'Entra in negozio',
    nav_catalog: '菜单与商品',
    nav_about: '关于我们',
    nav_contact: '店铺地址',
    nav_orders: '我的订单',
    nav_admin: '店铺后台',
    nav_loyalty: '积分商城',
    nav_cart: '购物车',
    cart_tooltip: '购物车',

    theme_label: '主题风格',
    theme_braciami: 'braciami',
    theme_chiaro: 'chiaro',

    lang_select_title: '选择语言',
    lang_reset_locale: '恢复系统默认语言',
    lang_detected_notice: '已根据您的网络位置自动推荐语言',

    store_name: 'Braciami ancora',
    store_motto: '高品质，公道价',
    store_motto_quote: '“高品质，公道价”',
    store_address_short: '意大利 琴托 Via Penzale, 25',
    store_address_full: 'Via Penzale, 25, 44042 Cento FE, 意大利',
    store_hours_summary: '周二至周日 08:30–13:30 / 17:00–21:30 · 周一休息',

    hero_tag: 'Manuel 与 Samanta 的炭烤与美食杂货铺',
    hero_title_manuel: 'Manuel Cannatà',
    hero_subtitle_manuel: '橡木纯炭火烤制、专业干式熟成与精选牛肉',
    hero_quote_manuel: '对我来说，“高品质，公道价”意味着仅挑选最顶级的艾米利亚小母牛肉，并在真正的高温橡木炭火上烤制。没有中间商，让每个人都能以诚意价格享用美味牛排。',
    hero_specialty_manuel: '熟成45天T骨与战斧牛排',
    hero_action_manuel: '订购 Manuel 的炭烤牛排',

    hero_title_samanta: 'Samanta',
    hero_subtitle_samanta: '现烤熟食热菜、柴火配菜与周末聚会烧烤礼盒',
    hero_quote_samanta: '“高品质，公道价”是给每位客人的温暖款待：每天现调无添加手工酱汁、迷迭香烤土豆与为琴托家庭准备的精美烧烤礼篮。',
    hero_specialty_samanta: '周末家庭烧烤盒与秘制蜜汁烤肋排',
    hero_action_samanta: '探索 Samanta 的烧烤礼篮',

    hero_title_together: '琴托的炭烤大师夫妇',
    hero_subtitle_together: '融合顶尖鲜肉精选与热腾腾意大利熟食的街坊名店',
    hero_quote_together: '我们怀着对艾米利亚土地优质风味的敬畏与热爱而创立。无论您需要挑选新鲜肉块，还是直接带走刚出炉的火热大餐，我们都在店里随时恭候。',
    hero_specialty_together: '琴托经典什锦炭火烤肉大拼盘',
    hero_action_together: '浏览全部柜台商品',

    hero_active_offers: '当前特惠活动',
    hero_play: '播放幻灯片',
    hero_pause: '暂停幻灯片',

    cat_all: '全部柜台精选',
    cat_ready: '炭火热腾熟食',
    cat_fresh: '新鲜与熟成肉品',
    cat_box: '烧烤聚会礼盒',
    cat_wine: '特色配菜与意式佳酿',
    cat_search_placeholder: '搜索熟成牛排、烤肋排、烤肉、手工酱料...',
    cat_found_products: '件店内精选商品',
    cat_add_to_cart: '加入购物车',
    cat_view_details: '查看详情与过敏原',
    cat_ready_to_eat: '刚出炉趁热即食',
    cat_dry_aged: '干式排酸熟成',
    cat_heat_scale: '炭烤火候与辛香程度',
    cat_cooking_time: '平均烹制时间',
    cat_curator_manuel: 'Manuel 的精选肉品与炭火推荐',
    cat_curator_samanta: 'Samanta 的独家私房烹饪',
    cat_allergens_label: '过敏原信息',
    cat_ingredients_label: '原料成分与产地',
    cat_no_products: '未找到符合条件的商品。',

    cart_drawer_title: '我的购物车',
    cart_empty_title: '购物车是空的',
    cart_empty_desc: '快去挑选 Manuel 和 Samanta 为您准备的美味炭烤和鲜肉吧！',
    cart_subtotal: '商品小计',
    cart_discount: '优惠减免',
    cart_delivery: '配送运费',
    cart_total: '订单总计',
    cart_free_pickup: '到店自提免运费',
    cart_proceed_checkout: '去结算',
    cart_continue_shopping: '继续选购',
    cart_clear_all: '清空购物车',
    cart_promo_code: '使用优惠代码',
    cart_apply_code: '应用',

    checkout_modal_title: '完成订单 · Braciami ancora 炭烤熟食店',
    checkout_step_delivery: '1. 自提或外送',
    checkout_step_details: '2. 顾客资料',
    checkout_step_payment: '3. 安全支付',
    checkout_method_pickup: '琴托店内自提（免费）',
    checkout_method_delivery: '送餐上门（琴托及周边10公里内）',
    checkout_pickup_desc: '到店免排队快速取货：Via Penzale 25, 44042 Cento FE',
    checkout_delivery_desc: '热腾腾出炉专车配送上门',
    checkout_time_slot: '希望取货/送达时间',
    checkout_full_name: '姓名',
    checkout_phone: '手机号码（用于接收验证码与通知）',
    checkout_email: '电子邮箱',
    checkout_address: '配送地址（街道与门牌号）',
    checkout_city: '城市',
    checkout_cap: '邮编',
    checkout_special_notes: '牛排生熟度偏好或门铃备注',
    checkout_payment_card: '信用卡 / 银联 / 借记卡（PCI-DSS 令牌）',
    checkout_payment_bancomat: '到店刷卡或现金',
    checkout_payment_paypal: 'PayPal 快捷支付',
    checkout_payment_satispay: 'Satispay 移动支付',
    checkout_payment_cash: '取货时现金支付',
    checkout_pci_notice: '遵循 PCI-DSS 与 3D-Secure 2.2 严格支付安全协议。',
    checkout_submit_btn: '立即确认炭火订单',
    checkout_success_title: '订单提交成功！',
    checkout_success_msg: 'Manuel 和 Samanta 已收到您的订单，您可以在“我的订单”中实时追踪炭烤进度。',

    orders_header_badge: '手机验证码保护的安全专区',
    orders_page_title: '我的订单与炭烤实时追踪',
    orders_page_subtitle: '实时跟踪您的熟成牛排与热菜在橡木炭火上的烤制状态。',
    orders_how_it_works_title: '炭火追踪使用指南：',
    orders_how_it_works_1: '1. 输入您的手机号码，或点击下方的演示账户。',
    orders_how_it_works_2: '2. 系统将模拟发送 6 位数即时短信验证码。',
    orders_how_it_works_3: '3. 验证后即可查看炭烤实时进度和历史订单。',
    orders_id_title: '顾客身份验证',
    orders_id_subtitle: '输入手机号码以获取验证码',
    orders_input_label: '手机号或电子邮箱：',
    orders_input_placeholder: '如 +39 347 0000000 或 marco.rossi@gmail.com',
    orders_send_otp_btn: '发送短信验证码',
    orders_sending: '正在发送...',
    orders_demo_shortcuts_label: '琴托老顾客快捷测试登录（SQL数据库）：',
    orders_sms_banner_title: '收到来自琴托小店的短信：',
    orders_paste_code_btn: '一键自动填入验证码',
    orders_verify_code_title: '输入 6 位验证码',
    orders_verify_code_btn: '验证并进入订单看板',
    orders_verify_in_progress: '正在验证...',
    orders_resend_code: '重新发送验证码',
    orders_change_phone: '更换联系方式',
    orders_status_received: '柜台已接单',
    orders_status_in_grill: '正在橡木炭火烤制中',
    orders_status_ready: '已出炉，可取餐',
    orders_status_in_delivery: '配送员派送中',
    orders_status_completed: '已完成送达/已自提',
    orders_reorder_btn: '一键将菜品再放回购物车',
    orders_logout_btn: '退出登录',

    footer_newsletter_tag: 'Braciami ancora 炭烤美食小报',
    footer_newsletter_title: '获取炭烤新鲜资讯 & 领 5 欧元优惠券',
    footer_newsletter_desc: '订阅即可抢先锁定周末特选熟成牛排、Samanta 私房食谱与立减券 BENVENUTO5。',
    footer_newsletter_placeholder: '请输入您的邮箱...',
    footer_newsletter_btn: '立即订阅',
    footer_newsletter_success: '订阅成功！结账时请输入优惠代码 BENVENUTO5。',
    footer_about_desc: 'Manuel 与 Samanta 在意大利琴托（Cento）经营的传统优质肉铺与炭火熟食店。现烤热菜、熟成鲜肉与对邻里的真诚心意。',
    footer_rights: '版权所有 · 意大利琴托传统手作工坊。',
    footer_guide_brace: '炭火烧烤完美烹饪指南',
    footer_privacy: '隐私与 Cookie 政策',

    close_modal: '关闭窗口',
    cancel_btn: '取消',
    confirm_btn: '确认',
    backoffice_login_title: '店铺管理后台与顾客系统',
    backoffice_submit: '登录后台',
    backoffice_notice: 'Manuel 与 Samanta 专用管理区域。'
  },

  // -------------------------------------------------------------
  // GIAPPONESE (ja_JP)
  // -------------------------------------------------------------
  ja_JP: {
    nav_intro: 'Landing',
    nav_home: 'Entra in negozio',
    nav_catalog: 'メニュー＆商品',
    nav_about: '私たちについて',
    nav_contact: 'アクセス',
    nav_orders: 'ご注文履歴',
    nav_admin: '店舗管理',
    nav_loyalty: 'ポイント',
    nav_cart: 'カート',
    cart_tooltip: 'ショッピングカート',

    theme_label: 'テーマ',
    theme_braciami: 'braciami',
    theme_chiaro: 'chiaro',

    lang_select_title: '言語を選択',
    lang_reset_locale: 'システムの言語にリセット',
    lang_detected_notice: 'アクセス地域に応じて言語を提案しました',

    store_name: 'Braciami ancora',
    store_motto: '最高の品質を適正な価格で',
    store_motto_quote: '「最高の品質を適正な価格で」',
    store_address_short: 'イタリア・チェント Via Penzale, 25',
    store_address_full: 'Via Penzale, 25, 44042 Cento FE, イタリア',
    store_hours_summary: '火〜日 08:30〜13:30 / 17:00〜21:30 · 月曜定休',

    hero_tag: 'マヌエルとサマンタの本格炭火＆惣菜店',
    hero_title_manuel: 'マヌエル・カンナタ',
    hero_subtitle_manuel: 'オーク炭火の炎、ドライエイジングと厳選された肉',
    hero_quote_manuel: '私にとって「最高の品質を適正価格で」とは、最高のエミリア産スコットーナ牛を厳選し、本物のオーク薪の炭火で焼き上げることを意味します。中抜きなし、妥協なしの王道ステーキをお届けします。',
    hero_specialty_manuel: 'スコットーナTボーン＆45日熟成リブアイ',
    hero_action_manuel: 'マヌエルのステーキを注文する',

    hero_title_samanta: 'サマンタ',
    hero_subtitle_samanta: '焼きたて温菜、薪窯サイドディッシュ、特製BBQボックス',
    hero_quote_samanta: '「品質と適正価格」はおもてなしの心です。保存料を使わない手作りソース、ローズマリーのポテト、週末のご家族向けBBQバスケットを毎日丹精込めて仕込んでいます。',
    hero_specialty_samanta: '週末BBQバスケット＆ハニーグレイズドスペアリブ',
    hero_action_samanta: 'サマンタのBBQボックスを見る',

    hero_title_together: 'チェントの炭火マスター夫婦',
    hero_subtitle_together: '名門精肉店と温かいイタリア惣菜がひとつになった街角の名店',
    hero_quote_together: '私たちはエミリアの土地の恵みへの情熱から生まれました。お店ではおすすめのお肉のご案内から、焼き立てのお料理のテイクアウトまで皆様をお待ちしております。',
    hero_specialty_together: 'チェント風ミックス炭火グリル盛り合わせ',
    hero_action_together: 'カウンターの全商品を見る',

    hero_active_offers: '現在のお得なプラン',
    hero_play: 'スライドショーを再開',
    hero_pause: 'スライドショーを一時停止',

    cat_all: '全カウンター商品',
    cat_ready: '炭火焼き立て温菜',
    cat_fresh: '新鮮肉＆熟成肉',
    cat_box: 'BBQボックス＆バスケット',
    cat_wine: '総菜＆エミリア特選ワイン',
    cat_search_placeholder: '熟成肉、スペアリブ、ロースト、ソースを検索...',
    cat_found_products: '点の商品をご用意しています',
    cat_add_to_cart: 'カートに追加',
    cat_view_details: '詳細とアレルギー表示',
    cat_ready_to_eat: '温かいままお召し上がりいただけます',
    cat_dry_aged: 'ドライエイジング熟成',
    cat_heat_scale: '炭火の強さとスパイスレベル',
    cat_cooking_time: '調理目安時間',
    cat_curator_manuel: 'マヌエルの厳選肉と炭火仕込み',
    cat_curator_samanta: 'サマンタの家庭の味レシピ',
    cat_allergens_label: '確認済みアレルゲン',
    cat_ingredients_label: '原材料と原産地',
    cat_no_products: '該当する商品は見つかりませんでした。',

    cart_drawer_title: 'ショッピングカート',
    cart_empty_title: 'カートは空です',
    cart_empty_desc: 'マヌエルとサマンタの特製炭火料理やお肉をお選びください。',
    cart_subtotal: '小計',
    cart_discount: '割引',
    cart_delivery: '配送料',
    cart_total: '合計金額',
    cart_free_pickup: '店頭受け取り（無料）',
    cart_proceed_checkout: 'レジに進む',
    cart_continue_shopping: '買い物を続ける',
    cart_clear_all: 'カートを空にする',
    cart_promo_code: 'クーポンコードをお持ちですか？',
    cart_apply_code: '適用',

    checkout_modal_title: 'ご注文の完了 · Bottega Braciami ancora',
    checkout_step_delivery: '1. 受取方法の選択',
    checkout_step_details: '2. お客様情報',
    checkout_step_payment: '3. 安全なお支払い',
    checkout_method_pickup: 'チェント店頭受取（無料）',
    checkout_method_delivery: 'デリバリー（チェント周辺）',
    checkout_pickup_desc: '店頭優先受取：Via Penzale 25, 44042 Cento FE',
    checkout_delivery_desc: 'チェントから10km圏内に焼き立てをお届けします。',
    checkout_time_slot: 'ご希望の時間帯',
    checkout_full_name: 'お名前',
    checkout_phone: '携帯電話番号（OTP認証用）',
    checkout_email: 'メールアドレス',
    checkout_address: 'お届け先住所（番地まで）',
    checkout_city: '市区町村',
    checkout_cap: '郵便番号',
    checkout_special_notes: '焼き加減のご希望やインターホンのご案内',
    checkout_payment_card: 'クレジットカード / デビット（PCI-DSSトークン）',
    checkout_payment_bancomat: '店頭でのカードまたは現金払い',
    checkout_payment_paypal: 'PayPalエクスプレス',
    checkout_payment_satispay: 'Satispayスマート決済',
    checkout_payment_cash: '店頭受取時の現金払い',
    checkout_pci_notice: 'PCI-DSSおよび3Dセキュア2.2規格に準拠したセキュア決済シミュレーションです。',
    checkout_submit_btn: '炭火グリル注文を確定する',
    checkout_success_title: 'ご注文ありがとうございます！',
    checkout_success_msg: 'ご注文を受付いたしました。「ご注文履歴」より炭火の調理状況をリアルタイムでご確認いただけます。',

    orders_header_badge: 'OTPで保護された専用エリア',
    orders_page_title: 'ご注文履歴＆炭火リアルタイム追跡',
    orders_page_subtitle: '熟成肉やお料理がオーク炭火で焼き上がる様子をライブで追跡できます。',
    orders_how_it_works_title: '炭火追跡システムのご利用方法：',
    orders_how_it_works_1: '1. 携帯番号を入力するか、下のデモアカウントをお選びください。',
    orders_how_it_works_2: '2. 模擬SMSで届く6桁のOTPコードを確認します。',
    orders_how_it_works_3: '3. ログインして焼き加減ステータスやレシート履歴を確認できます。',
    orders_id_title: 'お客様認証',
    orders_id_subtitle: 'OTPを受信するために電話番号を入力してください',
    orders_input_label: '携帯電話番号またはメールアドレス：',
    orders_input_placeholder: '例: +39 347 0000000 または marco.rossi@gmail.com',
    orders_send_otp_btn: 'OTP認証コードを送信',
    orders_sending: '送信中...',
    orders_demo_shortcuts_label: 'チェントの常連顧客デモアクセス（SQLデータベース）：',
    orders_sms_banner_title: 'ボッテガ・チェントからの新着SMS：',
    orders_paste_code_btn: 'コードを自動入力',
    orders_verify_code_title: 'OTPコードの入力',
    orders_verify_code_btn: '認証して履歴を開く',
    orders_verify_in_progress: '認証中...',
    orders_resend_code: 'コードを再送信',
    orders_change_phone: '電話番号を変更',
    orders_status_received: '注文受付完了',
    orders_status_in_grill: 'オーク炭火でグリル中',
    orders_status_ready: '焼き上がり・受取可能',
    orders_status_in_delivery: '配達中',
    orders_status_completed: '完了・受取済み',
    orders_reorder_btn: 'もう一度カートに入れて注文',
    orders_logout_btn: 'ログアウト',

    footer_newsletter_tag: 'ボッテガ Braciami ancora ニュースレター',
    footer_newsletter_title: '炭火の最新情報＆5ユーロ割引クーポン',
    footer_newsletter_desc: '週末の熟成肉入荷情報やサマンタの限定レシピ、割引コード BENVENUTO5 をお届けします。',
    footer_newsletter_placeholder: 'メールアドレスを入力...',
    footer_newsletter_btn: '登録する',
    footer_newsletter_success: 'ご登録完了！カートでコード BENVENUTO5 をご活用ください。',
    footer_about_desc: 'イタリア・チェントにあるマヌエルとサマンタの本格炭火焼きとイタリア惣菜店。出来立ての温菜と厳選熟成肉をお届けします。',
    footer_rights: '無断転載を禁じます。チェントの手工芸ボッテガ。',
    footer_guide_brace: '炭火焼きステーキ完璧ガイド',
    footer_privacy: 'プライバシー＆クッキーポリシー',

    close_modal: '閉じる',
    cancel_btn: 'キャンセル',
    confirm_btn: '確認',
    backoffice_login_title: '店舗管理＆CRMシステム',
    backoffice_submit: '管理画面にログイン',
    backoffice_notice: 'マヌエルとサマンタ専用の管理エリアです。'
  },

  // -------------------------------------------------------------
  // RUSSO (ru_RU)
  // -------------------------------------------------------------
  ru_RU: {
    nav_intro: 'Landing',
    nav_home: 'Entra in negozio',
    nav_catalog: 'Меню и витрина',
    nav_about: 'О нас',
    nav_contact: 'Как добраться',
    nav_orders: 'Мои заказы',
    nav_admin: 'Управление',
    nav_loyalty: 'Бонусы',
    nav_cart: 'Корзина',
    cart_tooltip: 'Корзина покупок',

    theme_label: 'Тема',
    theme_braciami: 'braciami',
    theme_chiaro: 'chiaro',

    lang_select_title: 'Выбрать язык',
    lang_reset_locale: 'Сбросить на язык системы',
    lang_detected_notice: 'Язык предложен на основе вашего региона',

    store_name: 'Braciami ancora',
    store_motto: 'Качество по честной цене',
    store_motto_quote: '«Качество по честной цене»',
    store_address_short: 'Виа Пенцале, 25 · Ченто (FE), Италия',
    store_address_full: 'Via Penzale, 25, 44042 Cento FE, Италия',
    store_hours_summary: 'Вт–Вс 08:30–13:30 / 17:00–21:30 · Пн выходной',

    hero_tag: 'Гастрономия и угли от Мануэля и Саманты',
    hero_title_manuel: 'Мануэль Канната',
    hero_subtitle_manuel: 'Жар дубовых углей, сухое вызревание и отборное мясо',
    hero_quote_manuel: 'Для меня «Качество по честной цене» — это отбор только лучшей эмилианской говядины скоттона и её приготовление на настоящих дубовых углях. Без посредников: королевский стейк по честной цене.',
    hero_specialty_manuel: 'Флорентийский стейк скоттона и рибай 45 дней выдержки',
    hero_action_manuel: 'Заказать стейк от Мануэля',

    hero_title_samanta: 'Саманта',
    hero_subtitle_samanta: 'Горячие готовые блюда, гарниры на дровах и барбекю-боксы',
    hero_quote_samanta: '«Качество по честной цене» — это наше гостеприимство: домашние соусы без консервантов каждый день, запеченный картофель с розмарином и праздничные наборы для семей Ченто.',
    hero_specialty_samanta: 'Барбекю-боксы выходного дня и ребра в меду',
    hero_action_samanta: 'Выбрать бокс от Саманты',

    hero_title_together: 'Мастера углей из Ченто',
    hero_subtitle_together: 'Уютная лавка, объединяющая мясное искусство и горячую кухню',
    hero_quote_together: 'Мы выросли с любовью к натуральным продуктам нашей земли. Ждем вас в гости за советом или готовым горячим ужином прямо с огня.',
    hero_specialty_together: 'Большое ассорти на углях по-чентезски',
    hero_action_together: 'Посмотреть всю витрину',

    hero_active_offers: 'Действующие спецпредложения',
    hero_play: 'Запустить слайд-шоу',
    hero_pause: 'Приостановить',

    cat_all: 'Вся витрина',
    cat_ready: 'Горячие блюда на углях',
    cat_fresh: 'Свежее и выдержанное мясо',
    cat_box: 'Гриль-боксы и наборы',
    cat_wine: 'Гастрономия и вина Эмилии',
    cat_search_placeholder: 'Поиск выдержанного мяса, ребер, соусов...',
    cat_found_products: 'товаров доступно в лавке',
    cat_add_to_cart: 'В корзину',
    cat_view_details: 'Детали и аллергены',
    cat_ready_to_eat: 'Готово к подаче горячим',
    cat_dry_aged: 'Сухое вызревание',
    cat_heat_scale: 'Интенсивность углей и специй',
    cat_cooking_time: 'Время приготовления',
    cat_curator_manuel: 'Выбор мяса и огня от Мануэля',
    cat_curator_samanta: 'Домашний рецепт от Саманты',
    cat_allergens_label: 'Проверенные аллергены',
    cat_ingredients_label: 'Ингредиенты и происхождение',
    cat_no_products: 'Товаров по выбранным фильтрам не найдено.',

    cart_drawer_title: 'Ваша корзина',
    cart_empty_title: 'Корзина пуста',
    cart_empty_desc: 'Выберите вкуснейшие блюда на углях или свежее мясо от Мануэля и Саманты.',
    cart_subtotal: 'Подытог',
    cart_discount: 'Скидка',
    cart_delivery: 'Доставка',
    cart_total: 'Итого к оплате',
    cart_free_pickup: 'Бесплатный самовывоз в лавке',
    cart_proceed_checkout: 'Перейти к оформлению',
    cart_continue_shopping: 'Продолжить покупки',
    cart_clear_all: 'Очистить корзину',
    cart_promo_code: 'Есть промокод?',
    cart_apply_code: 'Применить',

    checkout_modal_title: 'Оформление заказа · Bottega Braciami ancora',
    checkout_step_delivery: '1. Получение',
    checkout_step_details: '2. Данные покупателя',
    checkout_step_payment: '3. Безопасная оплата',
    checkout_method_pickup: 'Самовывоз в Ченто (Бесплатно)',
    checkout_method_delivery: 'Доставка на дом (район Ченто)',
    checkout_pickup_desc: 'Быстрый самовывоз без очереди: Via Penzale 25, 44042 Cento FE.',
    checkout_delivery_desc: 'Доставка горячих блюд в радиусе 10 км от Ченто.',
    checkout_time_slot: 'Желаемое время',
    checkout_full_name: 'Имя и фамилия',
    checkout_phone: 'Мобильный телефон (для SMS с кодом)',
    checkout_email: 'Электронная почта',
    checkout_address: 'Адрес доставки (улица и дом)',
    checkout_city: 'Город',
    checkout_cap: 'Индекс',
    checkout_special_notes: 'Пожелания к прожарке или домофон',
    checkout_payment_card: 'Банковская карта (PCI-DSS токен)',
    checkout_payment_bancomat: 'Карта / Наличные при получении',
    checkout_payment_paypal: 'PayPal Express',
    checkout_payment_satispay: 'Satispay Smart Payment',
    checkout_payment_cash: 'Наличные при самовывозе в лавке',
    checkout_pci_notice: 'Транзакция защищена стандартами PCI-DSS и протоколом 3D-Secure 2.2.',
    checkout_submit_btn: 'Подтвердить заказ на углях',
    checkout_success_title: 'Заказ успешно оформлен!',
    checkout_success_msg: 'Мануэль и Саманта уже приняли заказ. Статус можно отслеживать в разделе «Мои заказы».',

    orders_header_badge: 'Личный кабинет под защитой OTP',
    orders_page_title: 'Мои заказы и статус углей',
    orders_page_subtitle: 'Следите в реальном времени за приготовлением ваших блюд на живых углях.',
    orders_how_it_works_title: 'Как работает отслеживание заказов:',
    orders_how_it_works_1: '1. Введите свой номер телефона или выберите тестовый аккаунт.',
    orders_how_it_works_2: '2. Получите 6-значный OTP-код в симулированном SMS.',
    orders_how_it_works_3: '3. Войдите в панель, чтобы видеть статус углей и историю чеков.',
    orders_id_title: 'Идентификация клиента',
    orders_id_subtitle: 'Введите номер для получения OTP-кода',
    orders_input_label: 'Номер телефона или email:',
    orders_input_placeholder: 'Например, +39 347 0000000 или marco@gmail.com',
    orders_send_otp_btn: 'Отправить код доступа OTP',
    orders_sending: 'Отправка...',
    orders_demo_shortcuts_label: 'Быстрый доступ к демо-клиентам Ченто (База данных SQL):',
    orders_sms_banner_title: 'Входящее SMS от: Braciami Cento',
    orders_paste_code_btn: 'Вставить код в один клик',
    orders_verify_code_title: 'Подтверждение кода',
    orders_verify_code_btn: 'Подтвердить и открыть историю',
    orders_verify_in_progress: 'Проверка...',
    orders_resend_code: 'Запросить новый код',
    orders_change_phone: 'Изменить номер',
    orders_status_received: 'Принят в лавке',
    orders_status_in_grill: 'Жарится на дубовых углях',
    orders_status_ready: 'Готов к выдаче',
    orders_status_in_delivery: 'Курьер в пути',
    orders_status_completed: 'Выдан / Доставлен',
    orders_reorder_btn: 'Повторить блюда в корзину',
    orders_logout_btn: 'Выйти',

    footer_newsletter_tag: 'Рассылка Bottega Braciami ancora',
    footer_newsletter_title: 'Новости углей и скидка 5 € на первый заказ',
    footer_newsletter_desc: 'Подпишитесь, чтобы первыми узнавать о свежих поставках стейков и получить промокод BENVENUTO5.',
    footer_newsletter_placeholder: 'Ваш email...',
    footer_newsletter_btn: 'Подписаться',
    footer_newsletter_success: 'Подписка оформлена! Промокод BENVENUTO5 активирован для вашей корзины.',
    footer_about_desc: 'Мясная лавка и гриль на углях Мануэля и Саманты в Ченто (FE), Италия. Горячие блюда, выдержанное мясо и домашнее тепло.',
    footer_rights: 'Все права защищены. Ремесленная лавка в Ченто.',
    footer_guide_brace: 'Руководство по идеальной жарке на углях',
    footer_privacy: 'Политика конфиденциальности',

    close_modal: 'Закрыть',
    cancel_btn: 'Отмена',
    confirm_btn: 'Подтвердить',
    backoffice_login_title: 'Управление лавкой и CRM',
    backoffice_submit: 'Войти в панель',
    backoffice_notice: 'Доступ только для Мануэля и Саманты.'
  },

  // -------------------------------------------------------------
  // ARABO (ar_SA)
  // -------------------------------------------------------------
  ar_SA: {
    nav_intro: 'Landing',
    nav_home: 'Entra in negozio',
    nav_catalog: 'القائمة والمنتجات',
    nav_about: 'من نحن',
    nav_contact: 'كيفية الوصول إلينا',
    nav_orders: 'طلباتي',
    nav_admin: 'إدارة المتجر',
    nav_loyalty: 'نقاط الولاء',
    nav_cart: 'عربة التسوق',
    cart_tooltip: 'عربة التسوق',

    theme_label: 'المظهر',
    theme_braciami: 'braciami',
    theme_chiaro: 'chiaro',

    lang_select_title: 'اختر اللغة',
    lang_reset_locale: 'إعادة التعيين إلى لغة النظام المحلية',
    lang_detected_notice: 'تم اقتراح اللغة بناءً على موقع اتصالك',

    store_name: 'Braciami ancora',
    store_motto: 'الجودة بالسعر العادل',
    store_motto_quote: '«الجودة بالسعر العادل»',
    store_address_short: 'طريق بينزالي 25 · شينتو (FE)، إيطاليا',
    store_address_full: 'Via Penzale, 25, 44042 Cento FE, إيطاليا',
    store_hours_summary: 'الثلاثاء–الأحد 08:30–13:30 / 17:00–21:30 · مغلق يوم الإثنين',

    hero_tag: 'متجر ومشاوي مانويل وسامانتا في إيطاليا',
    hero_title_manuel: 'مانويل كاناتا',
    hero_subtitle_manuel: 'جمر حطب البلوط، التعتيق الجاف والقطع الفاخرة',
    hero_quote_manuel: 'بالنسبة لي، "الجودة بالسعر العادل" تعني اختيار أفضل لحوم العجلات الإيطالية وطهيها على جمر خشب البلوط الحقيقي. لا وسطاء ولا تنازلات: شريحة لحم ملكية بسعر صادق.',
    hero_specialty_manuel: 'شريحة فيورنتينا وريب آي معتق 45 يومًا',
    hero_action_manuel: 'اطلب ستيك مانويل المميز',

    hero_title_samanta: 'سامانتا',
    hero_subtitle_samanta: 'أطباق ساخنة طازجة، مقبلات على الحطب وسلال عائلية',
    hero_quote_samanta: '"الجودة بالسعر العادل" تعني كرم الضيافة: تحضير صلصات طبيعية يوميًا بدون مواد حافظة، بطاطس مشوية بالروزماري وسلال شواء لعائلات شينتو.',
    hero_specialty_samanta: 'سلال شواء عطلة نهاية الأسبوع وريش بالعسل',
    hero_action_samanta: 'اكتشف سلال سامانتا',

    hero_title_together: 'خبراء الشواء في شينتو',
    hero_subtitle_together: 'متجر الحي الذي يجمع بين الجزارة الممتازة والمطبخ الساخن الفاخر',
    hero_quote_together: 'نشأنا بشغف كبير بخيرات أرضنا الإيطالية. في متجرنا نرحب بكم لننصحكم بالقطعة المثالية أو لنقدم لكم عشاءً دافئًا طازجًا خرج للتو من فوق الجمر.',
    hero_specialty_together: 'مشاوي مشكلة على طريقة شينتو',
    hero_action_together: 'تصفح كل منتجات المتجر',

    hero_active_offers: 'العروض المميزة الحالية',
    hero_play: 'تشغيل العرض',
    hero_pause: 'إيقاف مؤقت',

    cat_all: 'كل معروضات المتجر',
    cat_ready: 'أطباق ساخنة من فوق الجمر',
    cat_fresh: 'لحوم طازجة ومعتقة',
    cat_box: 'سلال وصناديق الشواء',
    cat_wine: 'مأكولات ومشروبات محلية',
    cat_search_placeholder: 'ابحث عن لحوم معتقة، أضلاع، مشويات، صلصات...',
    cat_found_products: 'منتج متاح في المتجر',
    cat_add_to_cart: 'أضف إلى السلة',
    cat_view_details: 'التفاصيل ومسببات الحساسية',
    cat_ready_to_eat: 'جاهز للأكل ساخنًا',
    cat_dry_aged: 'تعتيق جاف عالي الجودة',
    cat_heat_scale: 'مستوى حرارة الجمر والتوابل',
    cat_cooking_time: 'متوسط وقت التحضير',
    cat_curator_manuel: 'اختيار مانويل للجمر واللحوم',
    cat_curator_samanta: 'وصفة سامانتا المنزلية',
    cat_allergens_label: 'مسببات الحساسية المعتمدة',
    cat_ingredients_label: 'المكونات والمصدر',
    cat_no_products: 'لم يتم العثور على منتجات تطابق الفلاتر.',

    cart_drawer_title: 'عربة التسوق الخاصة بك',
    cart_empty_title: 'عربة التسوق فارغة',
    cart_empty_desc: 'اختر أشهى المشويات أو اللحوم الفاخرة من مانويل وسامانتا.',
    cart_subtotal: 'المجموع الفرعي',
    cart_discount: 'الخصم المطبق',
    cart_delivery: 'رسوم التوصيل',
    cart_total: 'المجموع الكلي',
    cart_free_pickup: 'استلام مجاني من المتجر',
    cart_proceed_checkout: 'متابعة الدفع',
    cart_continue_shopping: 'مواصلة التسوق',
    cart_clear_all: 'إفراغ العربة',
    cart_promo_code: 'هل لديك رمز ترويجي؟',
    cart_apply_code: 'تطبيق',

    checkout_modal_title: 'إتمام الطلب · متجر Braciami ancora',
    checkout_step_delivery: '1. الاستلام أو التوصيل',
    checkout_step_details: '2. بيانات العميل',
    checkout_step_payment: '3. الدفع الآمن',
    checkout_method_pickup: 'استلام من المتجر في شينتو (مجانًا)',
    checkout_method_delivery: 'توصيل للمنزل (منطقة شينتو)',
    checkout_pickup_desc: 'استلام سريع بدون انتظار في: Via Penzale 25, 44042 Cento FE.',
    checkout_delivery_desc: 'توصيل الوجبات ساخنة حتى باب منزلك في نطاق 10 كم.',
    checkout_time_slot: 'الوقت المفضل',
    checkout_full_name: 'الاسم الكامل',
    checkout_phone: 'رقم الهاتف (لتلقي رمز التحقق والتنبيهات)',
    checkout_email: 'البريد الإلكتروني',
    checkout_address: 'عنوان التوصيل (الشارع ورقم البناية)',
    checkout_city: 'المدينة',
    checkout_cap: 'الرمز البريدي',
    checkout_special_notes: 'درجة استواء اللحم أو ملاحظات إضافية',
    checkout_payment_card: 'بطاقة ائتمان / مدى (رمز PCI-DSS الآمن)',
    checkout_payment_bancomat: 'دفع بالبطاقة أو نقدًا عند الاستلام',
    checkout_payment_paypal: 'باي بال السريع',
    checkout_payment_satispay: 'دفع ساتسباي الذكي',
    checkout_payment_cash: 'دفع نقدًا عند الاستلام في المتجر',
    checkout_pci_notice: 'معاملة دفع محاكاة متوافقة مع معايير PCI-DSS و 3D-Secure 2.2.',
    checkout_submit_btn: 'تأكيد طلب المشاوي على الجمر',
    checkout_success_title: 'تم تأكيد طلبك بنجاح!',
    checkout_success_msg: 'مانويل وسامانتا بدأا في تحضير طلبك. يمكنك متابعة حالة الشواء في "طلباتي".',

    orders_header_badge: 'منطقة خاصة محمية برمز OTP',
    orders_page_title: 'طلباتي ومتابعة حالة الجمر',
    orders_page_subtitle: 'تابع طهي لحومك المعتقة وأطباقك الساخنة على جمر خشب البلوط لحظة بلحظة.',
    orders_how_it_works_title: 'كيف يعمل تتبع الجمر:',
    orders_how_it_works_1: '1. أدخل رقم هاتفك أو اختر أحد الحسابات التجريبية بالأسفل.',
    orders_how_it_works_2: '2. ستصلك رسالة SMS محاكاة برمز تحقق مكون من 6 أرقام.',
    orders_how_it_works_3: '3. ادخل لمشاهدة مراحل الشواء على النار وسجل الفواتير السابقة.',
    orders_id_title: 'التحقق من هوية العميل',
    orders_id_subtitle: 'أدخل رقم الهاتف لتلقي رمز التحقق OTP',
    orders_input_label: 'رقم الهاتف أو البريد الإلكتروني:',
    orders_input_placeholder: 'مثال: 3470000000 39+ أو marco@gmail.com',
    orders_send_otp_btn: 'إرسال رمز الدخول OTP',
    orders_sending: 'جاري الإرسال...',
    orders_demo_shortcuts_label: 'دخول تجريبي سريع لزبائن شينتو (قاعدة بيانات SQL):',
    orders_sms_banner_title: 'رسالة SMS جديدة من: Braciami Cento',
    orders_paste_code_btn: 'لصق الرمز بنقرة واحدة',
    orders_verify_code_title: 'تأكيد رمز التحقق OTP',
    orders_verify_code_btn: 'تأكيد ودخول سجل الطلبات',
    orders_verify_in_progress: 'جاري التحقق...',
    orders_resend_code: 'إعادة إرسال رمز جديد',
    orders_change_phone: 'تعديل رقم الهاتف',
    orders_status_received: 'تم استلام الطلب',
    orders_status_in_grill: 'جاري الشواء على جمر البلوط',
    orders_status_ready: 'جاهز للاستلام عند المنصة',
    orders_status_in_delivery: 'في الطريق إليك',
    orders_status_completed: 'تم التسليم / الاستلام بنجاح',
    orders_reorder_btn: 'إعادة طلب الأطباق في السلة',
    orders_logout_btn: 'تسجيل الخروج',

    footer_newsletter_tag: 'نشرة متجر Braciami ancora البريدية',
    footer_newsletter_title: 'احصل على أخبار الجمر وكوبون ترحيبي بقيمة 5€',
    footer_newsletter_desc: 'اشترك لتكون أول من يعرف عن قطع اللحوم المعتقة ووصفات سامانتا مع كود الخصم BENVENUTO5.',
    footer_newsletter_placeholder: 'أدخل بريدك الإلكتروني...',
    footer_newsletter_btn: 'اشتراك',
    footer_newsletter_success: 'تم تأكيد اشتراكك! استخدم الكوبون BENVENUTO5 في عربة التسوق.',
    footer_about_desc: 'متجر الجزارة الإيطالية والمأكولات المشوية لمانويل وسامانتا في شينتو (FE)، إيطاليا. وجبات دافئة، لحوم معتقة، وكرم ضيافة حقيقي.',
    footer_rights: 'جميع الحقوق محفوظة. متجر الحرفيين في شينتو.',
    footer_guide_brace: 'دليل الطهي المثالي على الجمر',
    footer_privacy: 'سياسة الخصوصية وملفات تعريف الارتباط',

    close_modal: 'إغلاق',
    cancel_btn: 'إلغاء',
    confirm_btn: 'تأكيد',
    backoffice_login_title: 'إدارة المتجر وعلاقات العملاء CRM',
    backoffice_submit: 'دخول لوحة التحكم',
    backoffice_notice: 'منطقة خاصة بمانويل وسامانتا فقط.'
  }
};

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  ...RAW_TRANSLATIONS,
  nl_NL: {
    ...RAW_TRANSLATIONS.en_US,
    nav_home: 'NAAR DE WINKEL',
    nav_cart: 'Winkelwagen',
    cart_tooltip: 'Winkelwagen',
    store_name: 'Braciami ancora',
    store_address_short: 'Via Penzale, 25 · Cento (FE)',
    store_address_full: 'Via Penzale, 25, 44042 Cento FE'
  },
  sv_SE: {
    ...RAW_TRANSLATIONS.en_US,
    nav_home: 'TILL BUTIKEN',
    nav_cart: 'Varukorg',
    cart_tooltip: 'Varukorg',
    store_name: 'Braciami ancora',
    store_address_short: 'Via Penzale, 25 · Cento (FE)',
    store_address_full: 'Via Penzale, 25, 44042 Cento FE'
  }
} as Record<LanguageCode, Translations>;
