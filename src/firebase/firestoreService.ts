import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { handleFirestoreError, OperationType } from './errors';
import {
  UserData,
  Product,
  Order,
  Promozione,
  Sconto,
  OrderHeader,
  OrderDetail,
  DeliveryType,
  OrderMessage,
  OrderEmailLog,
  StatoOrdine,
  UiElement,
  StoreConfig,
  UnitOfMeasureDefinition,
  AdminNotificationEvent,
  LocalGroceryStore30Km,
  ScrapingScheduleJob,
  CustomerSupportChatMessage,
  SlidingConfigItem,
  AccessoAdminLog,
  NewsletterSubscriber
} from '../types';
import { DEFAULT_SLIDINGS_CONFIG, DEFAULT_ACCESSO_ADMIN } from '../data/slidingsConfigData';
import {
  SEED_USERS,
  SEED_ORDERS,
  SEED_PROMOZIONI,
  SEED_SCONTI,
  SEED_DELIVERY_TYPES,
  SEED_ORDER_HEADERS,
  SEED_ORDER_DETAILS,
  SEED_ORDER_MESSAGES,
  SEED_ORDER_EMAILS,
  SEED_UI_ELEMENTS,
  SEED_STORE_CONFIG
} from '../data/seedData';
import { ENRICHED_SEED_PRODUCTS } from '../data/articlesArchitectureData';
import { SEED_UNITS_OF_MEASURE } from '../utils/unitConversion';
import { SEED_LOCAL_GROCERY_STORES_30KM, INITIAL_SCRAPING_JOBS } from '../data/localGroceryStores30KmData';
import { SEED_ADMIN_NOTIFICATIONS, buildCustomerVirtualCard } from '../utils/loyaltyAndNotifications';
import { TRANSLATIONS } from '../i18n/translations';

const SEED_PRODUCTS = ENRICHED_SEED_PRODUCTS;

export const FirestoreService = {
  /**
   * Complete database seeder for Firestore
   * Seeds: users, products, order_headers, order_details, delivery_types, order_messages, order_emails, promozioni, sconti, translations
   */
  async seedInitialDatabase(): Promise<{
    usersCount: number;
    productsCount: number;
    ordersCount: number;
    headersCount: number;
    detailsCount: number;
    deliveryCount: number;
    messagesCount: number;
    emailsCount: number;
    promosCount: number;
    scontiCount: number;
    translationsCount: number;
    uiElementsCount?: number;
  }> {
    let usersCount = 0;
    let productsCount = 0;
    let ordersCount = 0;
    let headersCount = 0;
    let detailsCount = 0;
    let deliveryCount = 0;
    let messagesCount = 0;
    let emailsCount = 0;
    let promosCount = 0;
    let scontiCount = 0;
    let translationsCount = 0;

    // 1. Seed Users
    for (const u of SEED_USERS) {
      try {
        const ref = doc(db, 'users', u.uid);
        await setDoc(ref, u, { merge: true });
        usersCount++;

        if (u.tipo_utente === 1) {
          const adminRef = doc(db, 'admins', u.uid);
          await setDoc(adminRef, { uid: u.uid, email: u.email, role: 'admin' }, { merge: true });
        }
      } catch (err) {
        console.warn('Notice seeding user:', u.email, err);
      }
    }

    // 2. Seed Products
    for (const p of SEED_PRODUCTS) {
      try {
        const ref = doc(db, 'products', p.id);
        await setDoc(ref, p, { merge: true });
        productsCount++;
      } catch (err) {
        console.warn('Notice seeding product:', p.name, err);
      }
    }

    // 3. Seed Delivery Types
    for (const dt of SEED_DELIVERY_TYPES) {
      try {
        const ref = doc(db, 'delivery_types', dt.id);
        await setDoc(ref, dt, { merge: true });
        deliveryCount++;
      } catch (err) {
        console.warn('Notice seeding delivery type:', dt.id, err);
      }
    }

    // 4. Seed Order Headers (testate ordine)
    for (const oh of SEED_ORDER_HEADERS) {
      try {
        const ref = doc(db, 'order_headers', oh.numero_ordine);
        await setDoc(ref, oh, { merge: true });
        headersCount++;
      } catch (err) {
        console.warn('Notice seeding order header:', oh.numero_ordine, err);
      }
    }

    // 5. Seed Order Details (dettagli ordine)
    for (const od of SEED_ORDER_DETAILS) {
      try {
        const ref = doc(db, 'order_details', od.id_dettaglio);
        await setDoc(ref, od, { merge: true });
        detailsCount++;
      } catch (err) {
        console.warn('Notice seeding order detail:', od.id_dettaglio, err);
      }
    }

    // 6. Seed Order Messages (messaggistica)
    for (const msg of SEED_ORDER_MESSAGES) {
      try {
        const ref = doc(db, 'order_messages', msg.id);
        await setDoc(ref, msg, { merge: true });
        messagesCount++;
      } catch (err) {
        console.warn('Notice seeding order message:', msg.id, err);
      }
    }

    // 7. Seed Order Emails (log email)
    for (const eml of SEED_ORDER_EMAILS) {
      try {
        const ref = doc(db, 'order_emails', eml.id);
        await setDoc(ref, eml, { merge: true });
        emailsCount++;
      } catch (err) {
        console.warn('Notice seeding order email:', eml.id, err);
      }
    }

    // 8. Seed Legacy Orders (for backward compatibility)
    for (const o of SEED_ORDERS) {
      try {
        const ref = doc(db, 'orders', o.id);
        await setDoc(ref, o, { merge: true });
        ordersCount++;
      } catch (err) {
        console.warn('Notice seeding legacy order:', o.id, err);
      }
    }

    // 9. Seed Promozioni
    for (const pr of SEED_PROMOZIONI) {
      try {
        const ref = doc(db, 'promozioni', pr.id);
        await setDoc(ref, pr, { merge: true });
        promosCount++;
      } catch (err) {
        console.warn('Notice seeding promo:', pr.id, err);
      }
    }

    // 10. Seed Sconti
    for (const sc of SEED_SCONTI) {
      try {
        const ref = doc(db, 'sconti', sc.id);
        await setDoc(ref, sc, { merge: true });
        scontiCount++;
      } catch (err) {
        console.warn('Notice seeding sconto:', sc.codice, err);
      }
    }

    // 11. Seed Multilingual Translations
    const locales = Object.keys(TRANSLATIONS) as (keyof typeof TRANSLATIONS)[];
    for (const loc of locales) {
      try {
        const ref = doc(db, 'translations', loc);
        await setDoc(ref, {
          id: loc,
          locale: loc,
          updatedAt: new Date().toISOString(),
          strings: TRANSLATIONS[loc]
        }, { merge: true });
        translationsCount++;
      } catch (err) {
        console.warn('Notice seeding translation:', loc, err);
      }
    }

    // 12. Seed User Interface Elements (tabella user_interface con ID per ogni elemento)
    let uiElementsCount = 0;
    for (const elem of SEED_UI_ELEMENTS) {
      try {
        const ref = doc(db, 'user_interface', elem.element_id);
        await setDoc(ref, elem, { merge: true });
        uiElementsCount++;
      } catch (err) {
        console.warn('Notice seeding ui element:', elem.element_id, err);
      }
    }

    // 13. Seed Store Configuration (distanza deperibilità e coordinate Cento)
    try {
      const ref = doc(db, 'store_config', SEED_STORE_CONFIG.id);
      await setDoc(ref, SEED_STORE_CONFIG, { merge: true });
    } catch (err) {
      console.warn('Notice seeding store config:', err);
    }

    // 14. Seed Units of Measure (tabella units_of_measure con conversioni e traduzioni)
    for (const unit of SEED_UNITS_OF_MEASURE) {
      try {
        const ref = doc(db, 'units_of_measure', unit.unit_id);
        await setDoc(ref, unit, { merge: true });
      } catch (err) {
        console.warn('Notice seeding unit of measure:', unit.unit_id, err);
      }
    }

    // 15. Seed Admin Notifications
    for (const notif of SEED_ADMIN_NOTIFICATIONS) {
      try {
        const ref = doc(db, 'admin_notifications', notif.id);
        await setDoc(ref, notif, { merge: true });
      } catch (err) {
        console.warn('Notice seeding admin notification:', notif.id, err);
      }
    }

    // 16. Seed Local Grocery Stores in 30km radius from Via Penzale 25, 44042 Cento FE (local_grocery_stores_30km)
    for (const store of SEED_LOCAL_GROCERY_STORES_30KM) {
      try {
        const ref = doc(db, 'local_grocery_stores_30km', store.id);
        await setDoc(ref, store, { merge: true });
      } catch (err) {
        console.warn('Notice seeding local_grocery_stores_30km:', store.id, err);
      }
    }

    // 17. Seed Scraping Schedule Jobs
    for (const job of INITIAL_SCRAPING_JOBS) {
      try {
        const ref = doc(db, 'scraping_jobs', job.id);
        await setDoc(ref, job, { merge: true });
      } catch (err) {
        console.warn('Notice seeding scraping_jobs:', job.id, err);
      }
    }

    // 18. Seed Tabella "configurazione" -> key "slidings" (JSON) & key "accessoAdmin"
    try {
      const slidingsRef = doc(db, 'configurazione', 'slidings');
      await setDoc(
        slidingsRef,
        {
          key: 'slidings',
          updatedAt: new Date().toISOString(),
          items: DEFAULT_SLIDINGS_CONFIG,
          json: JSON.stringify(DEFAULT_SLIDINGS_CONFIG, null, 2)
        },
        { merge: true }
      );
      const accessoRef = doc(db, 'configurazione', 'accessoAdmin');
      await setDoc(accessoRef, DEFAULT_ACCESSO_ADMIN, { merge: true });
    } catch (err) {
      console.warn('Notice seeding configurazione table:', err);
    }

    // 19. Seed collection "config" -> document "otp"
    try {
      const otpConfigRef = doc(db, 'config', 'otp');
      await setDoc(
        otpConfigRef,
        {
          testo: "Caro $email, per confermare l'accesso con il tuo provider $provider, inserisci il codice nnnnn",
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Notice seeding config/otp:', err);
    }

    return {
      usersCount,
      productsCount,
      ordersCount,
      headersCount,
      detailsCount,
      deliveryCount,
      messagesCount,
      emailsCount,
      promosCount,
      scontiCount,
      translationsCount,
      uiElementsCount
    };
  },

  /**
   * Fetch all order headers from Firestore
   */
  async getOrderHeaders(): Promise<OrderHeader[]> {
    const path = 'order_headers';
    try {
      const snap = await getDocs(collection(db, path));
      if (snap.empty) {
        return SEED_ORDER_HEADERS;
      }
      return snap.docs.map((d) => d.data() as OrderHeader);
    } catch (error) {
      console.warn('Could not fetch order headers, using fallback:', error);
      return SEED_ORDER_HEADERS;
    }
  },

  /**
   * Fetch order details for a specific order
   */
  async getOrderDetails(orderId: string): Promise<OrderDetail[]> {
    const path = 'order_details';
    try {
      const q = query(collection(db, path), where('id_ordine', '==', orderId));
      const snap = await getDocs(q);
      if (snap.empty) {
        return SEED_ORDER_DETAILS.filter((d) => d.id_ordine === orderId);
      }
      return snap.docs.map((d) => d.data() as OrderDetail);
    } catch (error) {
      console.warn('Could not fetch order details, using fallback:', error);
      return SEED_ORDER_DETAILS.filter((d) => d.id_ordine === orderId);
    }
  },

  /**
   * Fetch all order details
   */
  async getAllOrderDetails(): Promise<OrderDetail[]> {
    const path = 'order_details';
    try {
      const snap = await getDocs(collection(db, path));
      if (snap.empty) {
        return SEED_ORDER_DETAILS;
      }
      return snap.docs.map((d) => d.data() as OrderDetail);
    } catch {
      return SEED_ORDER_DETAILS;
    }
  },

  /**
   * Fetch delivery types
   */
  async getDeliveryTypes(): Promise<DeliveryType[]> {
    const path = 'delivery_types';
    try {
      const snap = await getDocs(collection(db, path));
      if (snap.empty) {
        return SEED_DELIVERY_TYPES;
      }
      return snap.docs.map((d) => d.data() as DeliveryType);
    } catch {
      return SEED_DELIVERY_TYPES;
    }
  },

  /**
   * Update order lifecycle status in Firestore
   */
  async updateOrderHeaderStatus(orderId: string, newStatus: StatoOrdine): Promise<void> {
    const path = `order_headers/${orderId}`;
    try {
      const ref = doc(db, 'order_headers', orderId);
      await setDoc(ref, { stato_ordine: newStatus }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  /**
   * Update order header Meet link
   */
  async updateOrderMeetLink(orderId: string, meetLink: string): Promise<void> {
    const path = `order_headers/${orderId}`;
    try {
      const ref = doc(db, 'order_headers', orderId);
      await setDoc(ref, { meet_link: meetLink }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  /**
   * Fetch messages for an order
   */
  async getOrderMessages(orderId: string): Promise<OrderMessage[]> {
    const path = 'order_messages';
    try {
      const q = query(collection(db, path), where('id_ordine', '==', orderId));
      const snap = await getDocs(q);
      if (snap.empty) {
        return SEED_ORDER_MESSAGES.filter((m) => m.id_ordine === orderId);
      }
      const msgs = snap.docs.map((d) => d.data() as OrderMessage);
      return msgs.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    } catch {
      return SEED_ORDER_MESSAGES.filter((m) => m.id_ordine === orderId);
    }
  },

  /**
   * Send a message on an order
   */
  async sendOrderMessage(message: OrderMessage): Promise<void> {
    const path = `order_messages/${message.id}`;
    try {
      const ref = doc(db, 'order_messages', message.id);
      await setDoc(ref, message);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Fetch emails logged for an order
   */
  async getOrderEmails(orderId: string): Promise<OrderEmailLog[]> {
    const path = 'order_emails';
    try {
      const q = query(collection(db, path), where('id_ordine', '==', orderId));
      const snap = await getDocs(q);
      if (snap.empty) {
        return SEED_ORDER_EMAILS.filter((e) => e.id_ordine === orderId);
      }
      return snap.docs.map((d) => d.data() as OrderEmailLog);
    } catch {
      return SEED_ORDER_EMAILS.filter((e) => e.id_ordine === orderId);
    }
  },

  /**
   * Log sent email in Firestore
   */
  async logOrderEmail(emailLog: OrderEmailLog): Promise<void> {
    const path = `order_emails/${emailLog.id}`;
    try {
      const ref = doc(db, 'order_emails', emailLog.id);
      await setDoc(ref, emailLog);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Fetch all users / customers from Firestore
   */
  async getAllUsers(): Promise<UserData[]> {
    const path = 'users';
    try {
      const snap = await getDocs(collection(db, path));
      if (snap.empty) {
        return SEED_USERS;
      }
      return snap.docs.map((d) => d.data() as UserData);
    } catch (error) {
      console.warn('Could not fetch users from Firestore, using fallback:', error);
      return SEED_USERS;
    }
  },

  /**
   * Get single user profile by UID or Email
   */
  async getUserProfile(uidOrEmail: string): Promise<UserData | null> {
    try {
      const ref = doc(db, 'users', uidOrEmail);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return snap.data() as UserData;
      }

      const q = query(collection(db, 'users'), where('email', '==', uidOrEmail));
      const emailSnap = await getDocs(q);
      if (!emailSnap.empty) {
        return emailSnap.docs[0].data() as UserData;
      }
    } catch (err) {
      console.warn('Notice loading user profile:', err);
    }

    const found = SEED_USERS.find(
      (u) => u.uid === uidOrEmail || u.email.toLowerCase() === uidOrEmail.toLowerCase()
    );
    return found || null;
  },

  /**
   * Save or update user profile
   */
  async saveUserProfile(user: UserData): Promise<void> {
    const path = `users/${user.uid}`;
    try {
      const ref = doc(db, 'users', user.uid);
      await setDoc(ref, user, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Fetch all products from Firestore, merging with enterprise schema defaults
   */
  async getAllProducts(): Promise<Product[]> {
    const path = 'products';
    try {
      const snap = await getDocs(collection(db, path));
      if (snap.empty) {
        return SEED_PRODUCTS;
      }
      const dbMap = new Map<string, Product>();
      snap.docs.forEach((d) => {
        const data = d.data() as Product;
        dbMap.set(data.id, data);
      });

      const merged: Product[] = SEED_PRODUCTS.map((seedProd) => {
        const fromDb = dbMap.get(seedProd.id);
        if (!fromDb) return seedProd;
        dbMap.delete(seedProd.id);
        return {
          ...seedProd,
          ...fromDb,
          identification: fromDb.identification || seedProd.identification,
          pricingAndWeight: fromDb.pricingAndWeight || seedProd.pricingAndWeight,
          supplierInfo: fromDb.supplierInfo || seedProd.supplierInfo,
          logisticsRules: fromDb.logisticsRules || seedProd.logisticsRules,
          competitorIntelligence: fromDb.competitorIntelligence || seedProd.competitorIntelligence
        };
      });

      // Include any extra custom products created by Admin in Firestore
      dbMap.forEach((extraProd) => merged.push(extraProd));
      return merged;
    } catch (error) {
      console.warn('Could not fetch products from Firestore, using fallback:', error);
      return SEED_PRODUCTS;
    }
  },

  /**
   * Save or update a product
   */
  async saveProduct(product: Product): Promise<void> {
    const path = `products/${product.id}`;
    try {
      const ref = doc(db, 'products', product.id);
      await setDoc(ref, product, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Save new order
   */
  async saveOrder(order: Order): Promise<void> {
    const path = `orders/${order.id}`;
    try {
      const ref = doc(db, 'orders', order.id);
      await setDoc(ref, order, { merge: true });

      // Also persist to normalized order_headers
      const headerRef = doc(db, 'order_headers', order.id);
      const cleanId = order.id.toLowerCase().replace(/[^a-z0-9]/g, '');
      const headerData: OrderHeader = {
        numero_ordine: order.id,
        data: order.date && order.date.includes('T') ? order.date : new Date().toISOString(),
        id_cliente: order.customer.email || order.customer.phone || 'GUEST',
        customerName: order.customer.fullName,
        customerEmail: order.customer.email,
        customerPhone: order.customer.phone,
        id_valuta: 'EUR',
        codice_sconto: order.appliedPromoCode || '',
        codice_promozione: order.appliedPromoCode || '',
        tipo_delivery: order.deliveryMethod === 'consegna_cento' ? 'deliv-cento' : 'deliv-banco',
        stato_ordine: 'in_lavorazione',
        totale_euro: order.total,
        totale_valuta_cliente: order.total,
        note: order.customer.notes || 'Ordine ricevuto dallo shop online',
        meet_link: `https://meet.google.com/bfe-ento-${cleanId}`,
        createdAt: new Date().toISOString()
      };
      await setDoc(headerRef, headerData, { merge: true });

      // And persist each item to order_details
      for (let i = 0; i < order.items.length; i++) {
        const item = order.items[i];
        const detailId = `det-${order.id}-${i + 1}`;
        const detailRef = doc(db, 'order_details', detailId);
        const detailData: OrderDetail = {
          id_dettaglio: detailId,
          id_ordine: order.id,
          id_prodotto: item.product.id,
          nome_prodotto: item.product.name,
          quantita: item.quantity,
          importo_euro: Number((item.product.price * item.quantity).toFixed(2)),
          importo_valuta_cliente: Number((item.product.price * item.quantity).toFixed(2)),
          codice_sconto: order.appliedPromoCode || '',
          codice_promozione: order.appliedPromoCode || '',
          note: item.specialInstructions || ''
        };
        await setDoc(detailRef, detailData, { merge: true });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Fetch all orders from Firestore
   */
  async getAllOrders(): Promise<Order[]> {
    const path = 'orders';
    try {
      const snap = await getDocs(collection(db, path));
      if (snap.empty) {
        return SEED_ORDERS;
      }
      return snap.docs.map((d) => d.data() as Order);
    } catch (error) {
      console.warn('Could not fetch orders from Firestore, using fallback:', error);
      return SEED_ORDERS;
    }
  },

  /**
   * Subscribe to customer orders
   */
  subscribeUserOrders(userId: string, onUpdate: (orders: Order[]) => void): () => void {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const orders = snapshot.docs.map((d) => d.data() as Order);
        onUpdate(orders);
      },
      (error) => {
        console.warn('Subscription notice:', error);
      }
    );
  },

  /**
   * Fetch active promotions
   */
  async getPromozioni(): Promise<Promozione[]> {
    try {
      const snap = await getDocs(collection(db, 'promozioni'));
      if (snap.empty) return SEED_PROMOZIONI;
      return snap.docs.map((d) => d.data() as Promozione);
    } catch {
      return SEED_PROMOZIONI;
    }
  },

  /**
   * Fetch active coupons & discounts
   */
  async getSconti(): Promise<Sconto[]> {
    try {
      const snap = await getDocs(collection(db, 'sconti'));
      if (snap.empty) return SEED_SCONTI;
      return snap.docs.map((d) => d.data() as Sconto);
    } catch {
      return SEED_SCONTI;
    }
  },

  /**
   * Build the official Welcome Confirmation Email HTML with legal unsubscribe links at the bottom
   */
  buildNewsletterWelcomeEmail(email: string, unsubscribeUrl: string, privacyUrl: string): {
    subject: string;
    html: string;
    text: string;
  } {
    const subject = 'Grazie per l\'iscrizione alla newsletter di Braciami Ancora - Cento';
    const html = `
<div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #1c1917; color: #f5f5f4; border-radius: 18px; overflow: hidden; border: 1px solid #44403c;">
  <div style="background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 24px 28px; color: #0c0a09;">
    <p style="margin: 0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">Braciami Ancora · Spaccio Carni, Salumi, Formaggi</p>
    <h1 style="margin: 6px 0 4px; font-size: 22px; font-weight: 900;">Grazie per l'iscrizione alla newsletter di Braciami Ancora - Cento!</h1>
    <p style="margin: 0; font-size: 13px; font-weight: 600;">Via Penzale 25, 44042 Cento (FE) · Tel. +39 051 6831000 · info@braciamiancora.it</p>
  </div>
  <div style="padding: 26px 28px; line-height: 1.6; font-size: 14px; color: #e7e5e4;">
    <p>Caro appassionato del buon cibo emiliano (<strong>${email}</strong>),</p>
    <p><strong>Grazie per l'iscrizione alla newsletter di Braciami Ancora - Cento!</strong> Manuel e Samanta ti danno il benvenuto ufficiale nella famiglia della nostra bottega.</p>
    <div style="background: #292524; border: 1px solid #f59e0b; border-radius: 12px; padding: 16px; margin: 18px 0;">
      <p style="margin: 0 0 6px; color: #fbbf24; font-weight: 800; font-size: 13px; text-transform: uppercase;">🎁 Il tuo Bonus di Benvenuto è già attivo:</p>
      <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #f5f5f4;">
        <li><strong>+25 Punti Fedeltà Brace</strong> accreditati immediatamente sulla tua scheda;</li>
        <li>Codice Sconto Benvenuto: <strong style="color: #fbbf24;">BENVENUTO10</strong> (-10% sul tuo prossimo ordine online o al banco);</li>
        <li>Anteprime esclusive sulle frollature Dry-Aged, serate degustazione birra &amp; grigliata e offerte settimanali dello Spaccio.</li>
      </ul>
    </div>
    <p style="font-size: 13px; color: #a8a29e;">Ti aspettiamo in bottega in <strong>Via Penzale 25, 44042 Cento (FE)</strong> dal Martedì alla Domenica oppure sul nostro catalogo online.</p>
  </div>
  <div style="background: #0c0a09; padding: 18px 28px; border-top: 1px solid #292524; font-size: 11px; color: #78716c; line-height: 1.5;">
    <p style="margin: 0 0 8px;"><strong>Informativa di Legge (Art. 13 GDPR UE 2016/679 e D.Lgs. 196/2003):</strong> Ricevi questa comunicazione perché l'indirizzo <em>${email}</em> è stato iscritto alla newsletter di Braciami Ancora - Via Penzale 25, 44042 Cento (FE).</p>
    <p style="margin: 0;">
      Non desideri più ricevere le nostre comunicazioni? Puoi esercitare in qualsiasi momento il diritto di cancellazione cliccando sui link di legge qui sotto:<br/>
      <a href="${unsubscribeUrl}" style="color: #f59e0b; text-decoration: underline; font-weight: 700;">Disiscriviti immediatamente dalla Newsletter (One-Click Unsubscribe)</a> &nbsp;|&nbsp;
      <a href="${privacyUrl}" style="color: #a8a29e; text-decoration: underline;">Informativa Privacy &amp; Diritti GDPR</a> &nbsp;|&nbsp;
      <a href="mailto:info@braciamiancora.it?subject=Cancellazione%20Newsletter%20${encodeURIComponent(email)}" style="color: #a8a29e; text-decoration: underline;">Revoca Consenso via Email</a>
    </p>
  </div>
</div>`.trim();

    const text = `Grazie per l'iscrizione alla newsletter di Braciami Ancora - Cento!\n\nBenvenuto da Manuel e Samanta (Via Penzale 25, 44042 Cento FE - Tel. +39 051 6831000).\nHai ricevuto +25 Punti Fedeltà e il codice sconto BENVENUTO10.\n\n---\nLink di legge per la disiscrizione (GDPR UE 2016/679):\nPer annullare l'iscrizione in qualsiasi momento visita: ${unsubscribeUrl}\nInformativa Privacy: ${privacyUrl}`;

    return { subject, html, text };
  },

  /**
   * Save newsletter subscription to Firebase "newsletter" table and dispatch welcome confirmation email
   */
  async subscribeNewsletter(email: string, language = 'it_IT'): Promise<NewsletterSubscriber> {
    const cleanEmail = email.toLowerCase().trim();
    const id = cleanEmail.replace(/[^a-z0-9]/g, '_');
    const path = `newsletter/${id}`;
    const nowIso = new Date().toISOString();
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://braciamiancora.it';
    const token = `unsub_${id}_${Date.now().toString(36)}`;
    const legalUnsubscribeUrl = `${origin}/?unsubscribe_newsletter=${encodeURIComponent(cleanEmail)}&token=${token}`;
    const legalPrivacyUrl = `${origin}/?page=privacy`;

    const welcomeMail = this.buildNewsletterWelcomeEmail(
      cleanEmail,
      legalUnsubscribeUrl,
      legalPrivacyUrl
    );

    const subscriberRecord: NewsletterSubscriber = {
      id,
      email: cleanEmail,
      subscribedAt: nowIso,
      language,
      status: 'attivo',
      unsubscribeToken: token,
      welcomeEmailSent: true,
      welcomeEmailSubject: welcomeMail.subject,
      welcomeEmailBodyHtml: welcomeMail.html,
      legalUnsubscribeUrl,
      legalPrivacyUrl
    };

    try {
      const ref = doc(db, 'newsletter', id);
      await setDoc(ref, subscriberRecord, { merge: true });

      // Also enqueue in Firebase "mail" collection (Firebase Trigger Email standard)
      const mailRef = doc(db, 'mail', `newsletter_welcome_${id}_${Date.now()}`);
      await setDoc(mailRef, {
        to: [cleanEmail],
        from: 'Braciami Ancora Cento <samantamanderioli083@gmail.com>',
        replyTo: 'samantamanderioli083@gmail.com',
        headers: {
          'List-Unsubscribe': `<${legalUnsubscribeUrl}>, <mailto:info@braciamiancora.it?subject=Unsubscribe>`
        },
        message: {
          subject: welcomeMail.subject,
          html: welcomeMail.html,
          text: welcomeMail.text
        },
        createdAt: nowIso
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }

    return subscriberRecord;
  },

  /**
   * Fetch all newsletter subscribers from Firebase "newsletter" table (Admin only)
   */
  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    const defaultSeed: NewsletterSubscriber[] = [
      (() => {
        const origin =
          typeof window !== 'undefined' ? window.location.origin : 'https://braciamiancora.it';
        const unsubUrl = `${origin}/?unsubscribe_newsletter=marco.bonora%40email.it&token=seed_01`;
        const privUrl = `${origin}/?page=privacy`;
        const mail = this.buildNewsletterWelcomeEmail('marco.bonora@email.it', unsubUrl, privUrl);
        return {
          id: 'marco_bonora_email_it',
          email: 'marco.bonora@email.it',
          subscribedAt: '2026-10-15T10:30:00.000Z',
          language: 'it_IT',
          status: 'attivo',
          unsubscribeToken: 'seed_01',
          welcomeEmailSent: true,
          welcomeEmailSubject: mail.subject,
          welcomeEmailBodyHtml: mail.html,
          legalUnsubscribeUrl: unsubUrl,
          legalPrivacyUrl: privUrl
        };
      })()
    ];

    try {
      const snap = await getDocs(collection(db, 'newsletter'));
      if (snap.empty) {
        return defaultSeed;
      }
      const list = snap.docs.map((d) => {
        const raw = d.data() as Partial<NewsletterSubscriber>;
        const cleanEmail = (raw.email || d.id).toLowerCase();
        const origin =
          typeof window !== 'undefined' ? window.location.origin : 'https://braciamiancora.it';
        const unsubUrl =
          raw.legalUnsubscribeUrl ||
          `${origin}/?unsubscribe_newsletter=${encodeURIComponent(cleanEmail)}`;
        const privUrl = raw.legalPrivacyUrl || `${origin}/?page=privacy`;
        const mail = this.buildNewsletterWelcomeEmail(cleanEmail, unsubUrl, privUrl);
        return {
          id: raw.id || d.id,
          email: cleanEmail,
          subscribedAt: raw.subscribedAt || new Date().toISOString(),
          language: raw.language || 'it_IT',
          status: raw.status || 'attivo',
          unsubscribedAt: raw.unsubscribedAt,
          unsubscribeToken: raw.unsubscribeToken || `token_${d.id}`,
          welcomeEmailSent: raw.welcomeEmailSent ?? true,
          welcomeEmailSubject: raw.welcomeEmailSubject || mail.subject,
          welcomeEmailBodyHtml: raw.welcomeEmailBodyHtml || mail.html,
          legalUnsubscribeUrl: unsubUrl,
          legalPrivacyUrl: privUrl
        } as NewsletterSubscriber;
      });
      return list.sort((a, b) => b.subscribedAt.localeCompare(a.subscribedAt));
    } catch {
      return defaultSeed;
    }
  },

  /**
   * Unsubscribe an email from the newsletter (via legal link at the bottom of the email or by Admin)
   */
  async unsubscribeNewsletter(emailOrId: string): Promise<void> {
    const clean = emailOrId.toLowerCase().trim();
    const id = clean.includes('@') ? clean.replace(/[^a-z0-9]/g, '_') : clean;
    try {
      const ref = doc(db, 'newsletter', id);
      await setDoc(
        ref,
        {
          id,
          status: 'disiscritto',
          unsubscribedAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (error) {
      console.warn('Notice unsubscribing newsletter:', error);
    }
  },

  /**
   * Delete a newsletter subscriber record from Firebase (Admin only)
   */
  async deleteNewsletterSubscriber(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'newsletter', id));
    } catch (error) {
      console.warn('Notice deleting newsletter subscriber:', error);
    }
  },

  /**
   * Fetch all UI Elements from user_interface collection
   * (con ID per ogni singolo elemento e traduzioni)
   */
  async getUiElements(): Promise<UiElement[]> {
    const path = 'user_interface';
    try {
      const snap = await getDocs(collection(db, path));
      if (snap.empty) {
        return SEED_UI_ELEMENTS;
      }
      return snap.docs.map((d) => d.data() as UiElement);
    } catch {
      return SEED_UI_ELEMENTS;
    }
  },

  /**
   * Save or update a UI Element translation in Firestore
   */
  async saveUiElement(element: UiElement): Promise<void> {
    const path = `user_interface/${element.element_id}`;
    try {
      const ref = doc(db, 'user_interface', element.element_id);
      await setDoc(ref, element, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Fetch store configuration (distanza chilometrica massima freschi, etc.)
   */
  async getStoreConfig(): Promise<StoreConfig> {
    const path = 'store_config/main';
    try {
      const snap = await getDoc(doc(db, 'store_config', 'main'));
      if (snap.exists()) {
        return snap.data() as StoreConfig;
      }
      return SEED_STORE_CONFIG;
    } catch {
      return SEED_STORE_CONFIG;
    }
  },

  /**
   * Update store configuration
   */
  async updateStoreConfig(config: Partial<StoreConfig>): Promise<void> {
    const path = 'store_config/main';
    try {
      const ref = doc(db, 'store_config', 'main');
      await setDoc(ref, config, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Fetch all Units of Measure from units_of_measure collection
   */
  async getUnitsOfMeasure(): Promise<UnitOfMeasureDefinition[]> {
    try {
      const snap = await getDocs(collection(db, 'units_of_measure'));
      if (snap.empty) return SEED_UNITS_OF_MEASURE;
      return snap.docs.map((d) => d.data() as UnitOfMeasureDefinition);
    } catch {
      return SEED_UNITS_OF_MEASURE;
    }
  },

  /**
   * Save or update a Unit of Measure definition in Firestore
   */
  async saveUnitOfMeasure(unit: UnitOfMeasureDefinition): Promise<void> {
    try {
      const ref = doc(db, 'units_of_measure', unit.unit_id);
      await setDoc(ref, unit, { merge: true });
    } catch (error) {
      console.warn('Could not save unit of measure to Firestore:', error);
    }
  },

  /**
   * Fetch Admin Notifications from admin_notifications collection
   */
  async getAdminNotifications(): Promise<AdminNotificationEvent[]> {
    try {
      const snap = await getDocs(collection(db, 'admin_notifications'));
      if (snap.empty) return SEED_ADMIN_NOTIFICATIONS;
      const list = snap.docs.map((d) => d.data() as AdminNotificationEvent);
      return list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    } catch {
      return SEED_ADMIN_NOTIFICATIONS;
    }
  },

  /**
   * Log a new Admin Notification Event (Order, User Connection, Failed Payment, Dispute, etc.)
   */
  async logAdminNotification(event: AdminNotificationEvent): Promise<void> {
    try {
      const ref = doc(db, 'admin_notifications', event.id);
      await setDoc(ref, event, { merge: true });
    } catch (error) {
      console.warn('Notice logging admin notification:', error);
    }
  },

  /**
   * Mark an Admin Notification as read
   */
  async markNotificationRead(id: string): Promise<void> {
    try {
      const ref = doc(db, 'admin_notifications', id);
      await setDoc(ref, { read: true }, { merge: true });
    } catch (error) {
      console.warn('Notice marking notification read:', error);
    }
  },

  /**
   * Fetch all Local Grocery Stores within 30km from Via Penzale 25, 44042 Cento FE
   */
  async getLocalGroceryStores30Km(): Promise<LocalGroceryStore30Km[]> {
    try {
      const snap = await getDocs(collection(db, 'local_grocery_stores_30km'));
      if (snap.empty) {
        // Seed automatically in background if empty
        SEED_LOCAL_GROCERY_STORES_30KM.forEach((s) => {
          setDoc(doc(db, 'local_grocery_stores_30km', s.id), s, { merge: true }).catch(() => {});
        });
        return SEED_LOCAL_GROCERY_STORES_30KM;
      }
      return snap.docs.map((d) => d.data() as LocalGroceryStore30Km);
    } catch {
      return SEED_LOCAL_GROCERY_STORES_30KM;
    }
  },

  /**
   * Save or update a Local Grocery Store 30Km record in Firestore
   */
  async saveLocalGroceryStore30Km(store: LocalGroceryStore30Km): Promise<void> {
    try {
      const ref = doc(db, 'local_grocery_stores_30km', store.id);
      await setDoc(ref, store, { merge: true });
    } catch (error) {
      console.warn('Notice saving local_grocery_stores_30km:', error);
    }
  },

  /**
   * Fetch Scraping Schedule Jobs from Firestore
   */
  async getScrapingJobs(): Promise<ScrapingScheduleJob[]> {
    try {
      const snap = await getDocs(collection(db, 'scraping_jobs'));
      if (snap.empty) return INITIAL_SCRAPING_JOBS;
      return snap.docs.map((d) => d.data() as ScrapingScheduleJob);
    } catch {
      return INITIAL_SCRAPING_JOBS;
    }
  },

  /**
   * Save a Scraping Schedule Job in Firestore
   */
  async saveScrapingJob(job: ScrapingScheduleJob): Promise<void> {
    try {
      const ref = doc(db, 'scraping_jobs', job.id);
      await setDoc(ref, job, { merge: true });
    } catch (error) {
      console.warn('Notice saving scraping_jobs:', error);
    }
  },

  /**
   * Save Customer Support Chat Message in Firestore
   */
  async saveSupportChatMessage(msg: CustomerSupportChatMessage): Promise<void> {
    try {
      const ref = doc(db, 'customer_support_chats', msg.id);
      await setDoc(ref, msg, { merge: true });
    } catch (error) {
      console.warn('Notice saving support chat message:', error);
    }
  },

  /**
   * Fetch key "slidings" from Firebase table "configurazione" (in JSON format)
   */
  async getSlidingsConfig(): Promise<SlidingConfigItem[]> {
    try {
      const ref = doc(db, 'configurazione', 'slidings');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (Array.isArray(data.items) && data.items.length > 0) {
          return data.items as SlidingConfigItem[];
        }
        if (typeof data.json === 'string') {
          const parsed = JSON.parse(data.json);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } else {
        // Seed default slidings in background
        await setDoc(
          ref,
          {
            key: 'slidings',
            updatedAt: new Date().toISOString(),
            items: DEFAULT_SLIDINGS_CONFIG,
            json: JSON.stringify(DEFAULT_SLIDINGS_CONFIG, null, 2)
          },
          { merge: true }
        );
      }
      return DEFAULT_SLIDINGS_CONFIG;
    } catch {
      return DEFAULT_SLIDINGS_CONFIG;
    }
  },

  /**
   * Save key "slidings" into Firebase table "configurazione" (in JSON format)
   */
  async saveSlidingsConfig(slidings: SlidingConfigItem[]): Promise<void> {
    try {
      const ref = doc(db, 'configurazione', 'slidings');
      await setDoc(
        ref,
        {
          key: 'slidings',
          updatedAt: new Date().toISOString(),
          items: slidings,
          json: JSON.stringify(slidings, null, 2)
        },
        { merge: true }
      );
      const mainConfigRef = doc(db, 'store_config', 'main');
      await setDoc(mainConfigRef, { slidings }, { merge: true });
    } catch (error) {
      console.warn('Notice saving configurazione/slidings:', error);
    }
  },

  /**
   * Fetch key "accessoAdmin" from Firebase table "configurazione"
   */
  async getAccessoAdminLog(): Promise<AccessoAdminLog> {
    try {
      const ref = doc(db, 'configurazione', 'accessoAdmin');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return snap.data() as AccessoAdminLog;
      }
      return DEFAULT_ACCESSO_ADMIN;
    } catch {
      return DEFAULT_ACCESSO_ADMIN;
    }
  },

  /**
   * Save administrator login event to configurazione -> accessoAdmin -> { lastUser, timeStamp, fromIp, browser }
   */
  async saveAccessoAdminLog(email: string): Promise<AccessoAdminLog> {
    let fromIp = '127.0.0.1';
    try {
      const res = await fetch('https://api.ipify.org?format=json', {
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) {
        const d = await res.json();
        if (d.ip) fromIp = d.ip;
      }
    } catch {
      try {
        const res2 = await fetch('https://ipwho.is/', {
          signal: AbortSignal.timeout(2500)
        });
        if (res2.ok) {
          const d2 = await res2.json();
          if (d2.ip) fromIp = d2.ip;
        }
      } catch {}
    }

    const logPayload: AccessoAdminLog = {
      lastUser: email.trim() || 'diegocimarosa@gmail.com',
      timeStamp: new Date().toISOString(),
      fromIp,
      browser: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Browser'
    };

    try {
      const ref = doc(db, 'configurazione', 'accessoAdmin');
      await setDoc(ref, logPayload, { merge: true });
      const mainConfigRef = doc(db, 'configurazione', 'main');
      await setDoc(mainConfigRef, { accessoAdmin: logPayload }, { merge: true });
      const storeConfigRef = doc(db, 'store_config', 'main');
      await setDoc(storeConfigRef, { accessoAdmin: logPayload }, { merge: true });
    } catch (error) {
      console.warn('Notice saving configurazione/accessoAdmin:', error);
    }

    return logPayload;
  },

  /**
   * Fetch OTP configuration template from collection "config" -> doc "otp"
   */
  async getOtpTemplate(): Promise<string> {
    const DEFAULT_TEMPLATE = "Caro $email, per confermare l'accesso con il tuo provider $provider, inserisci il codice nnnnn";
    try {
      const otpRef = doc(db, 'config', 'otp');
      const snap = await getDoc(otpRef);
      if (snap.exists() && snap.data()?.testo) {
        return snap.data().testo;
      }
      // Se non esiste, lo carichiamo su Firebase
      await setDoc(otpRef, {
        testo: DEFAULT_TEMPLATE,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return DEFAULT_TEMPLATE;
    } catch (err) {
      console.warn('Notice fetching config/otp from Firestore:', err);
      return DEFAULT_TEMPLATE;
    }
  },

  /**
   * Save/update OTP configuration template into collection "config" -> doc "otp"
   */
  async saveOtpTemplate(testo: string): Promise<void> {
    const otpRef = doc(db, 'config', 'otp');
    await setDoc(otpRef, {
      testo,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }
};
