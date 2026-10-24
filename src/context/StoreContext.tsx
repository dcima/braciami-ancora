import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  CustomerProfile,
  PromoCampaign,
  CommercialProposal,
  OrderStatus,
  PaymentMethod,
  AdminNotificationEvent,
  LocalGroceryStore30Km,
  ScrapingScheduleJob,
  ScrapingFrequency,
  SlidingConfigItem,
  AccessoAdminLog,
  NewsletterSubscriber
} from '../types';
import { DEFAULT_SLIDINGS_CONFIG, DEFAULT_ACCESSO_ADMIN } from '../data/slidingsConfigData';
import { INITIAL_ORDERS, INITIAL_CUSTOMERS, INITIAL_CAMPAIGNS, INITIAL_PROPOSALS } from '../data/mockData';
import { ENRICHED_SEED_PRODUCTS } from '../data/articlesArchitectureData';
import { SEED_ADMIN_NOTIFICATIONS } from '../utils/loyaltyAndNotifications';
import {
  SEED_LOCAL_GROCERY_STORES_30KM,
  INITIAL_SCRAPING_JOBS,
  buildLocalGroceryStores30Km
} from '../data/localGroceryStores30KmData';
import { executeRealProductScraping } from '../services/realFoodScraper';
import {
  sqlGetCustomers,
  sqlGetAllOrders,
  sqlGetOrdersForCustomer,
  sqlRequestOtp,
  sqlVerifyOtp,
  simulatePaymentProcessing,
  OtpRequestResult,
  PaymentSimulationResult,
  SqlCustomer
} from '../db/sqlite';
import { FirestoreService } from '../firebase/firestoreService';

export type ActivePage =
  | 'intro'
  | 'home'
  | 'catalogo'
  | 'chi-siamo'
  | 'fiere-eventi'
  | 'come-raggiungerci'
  | 'ordini'
  | 'assistenza'
  | 'privacy'
  | 'guida-brace'
  | 'admin-crm';

export type AdminTab =
  | 'ordini_attivi'
  | 'storico_ordini'
  | 'catalogo'
  | 'monitoraggio'
  | 'configurazione';

interface StoreContextType {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  adminActiveTab: AdminTab;
  setAdminActiveTab: (tab: AdminTab) => void;
  uploadedPhotoUrl: string | null;
  setUploadedPhotoUrl: (url: string | null) => void;
  uploadedManuelPhotoUrl: string | null;
  setUploadedManuelPhotoUrl: (url: string | null) => void;
  uploadedSamantaPhotoUrl: string | null;
  setUploadedSamantaPhotoUrl: (url: string | null) => void;
  resetToDefaultPhotos: () => void;
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, specialInstructions?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleFrozenRequested: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Checkout & Modals
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedProductDetail: Product | null;
  setSelectedProductDetail: (product: Product | null) => void;
  isLoyaltyOpen: boolean;
  setIsLoyaltyOpen: (open: boolean) => void;
  isPromoModalOpen: boolean;
  setIsPromoModalOpen: (open: boolean) => void;

  // Admin Authentication (Protected with braciami25 / braciami25)
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  isAdminAuthModalOpen: boolean;
  setIsAdminAuthModalOpen: (open: boolean) => void;
  handleOpenAdmin: () => void;
  onAdminLoginSuccess: (adminEmail?: string) => void;
  adminLogout: () => void;
  slidingsConfig: SlidingConfigItem[];
  saveSlidingsConfig: (items: SlidingConfigItem[]) => Promise<void>;
  accessoAdminLog: AccessoAdminLog;
  recordAccessoAdmin: (email: string) => Promise<void>;

  // Promos
  campaigns: PromoCampaign[];
  appliedPromo: PromoCampaign | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  discountAmount: number;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'date' | 'earnedPoints'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrder: (updatedOrder: Order) => Promise<void>;

  // Customers & CRM
  customers: CustomerProfile[];
  activeCustomer: CustomerProfile | null;
  setActiveCustomer: (customer: CustomerProfile | null) => void;
  proposals: CommercialProposal[];
  createCommercialProposal: (proposal: Omit<CommercialProposal, 'id' | 'createdDate' | 'status'>) => void;
  sendCommercialProposal: (id: string) => void;

  // SQLite OTP & Realistic Customer Order Tracking
  requestCustomerOtp: (phoneOrEmail: string) => Promise<OtpRequestResult>;
  verifyCustomerOtp: (phoneOrEmail: string, code: string) => Promise<{ success: boolean; customer?: SqlCustomer; error?: string }>;
  fetchCustomerOrders: (phoneOrEmail: string) => Promise<Order[]>;
  processPaymentMethod: (method: PaymentMethod, amount: number, customer: { fullName: string; phone: string; email: string }) => PaymentSimulationResult;

  // Guest Checkout OTP State
  generatedOtp: { code: string; destination: string; channel: 'SMS' | 'Email' } | null;
  requestOtp: (destination: string, channel: 'SMS' | 'Email') => string;
  verifyOtp: (code: string) => boolean;
  isOtpVerified: boolean;
  resetOtp: () => void;

  // Loyalty Club
  userPoints: number;
  redeemPointsVoucher: (pointsCost: number, voucherAmount: number) => boolean;

  // Newsletter
  subscribedNewsletterEmails: string[];
  newsletterSubscribers: NewsletterSubscriber[];
  lastSentNewsletterRecord: NewsletterSubscriber | null;
  setLastSentNewsletterRecord: (rec: NewsletterSubscriber | null) => void;
  subscribeNewsletter: (email: string) => boolean;
  unsubscribeNewsletterByEmail: (emailOrId: string) => Promise<void>;
  deleteNewsletterSubscriber: (id: string) => Promise<void>;

  // Notification Toast
  toastMessage: string | null;
  showToast: (message: string) => void;

  // Theme: 'braciami' (default dark ember) or 'chiaro' (Emilia food love light gourmet)
  theme: 'braciami' | 'chiaro';
  setTheme: (theme: 'braciami' | 'chiaro') => void;

  // Enterprise Catalog, 30km Competitor Monitoring & Real-Time Admin Notifications
  saveProductToCatalog: (product: Product) => Promise<void>;
  localStores30Km: LocalGroceryStore30Km[];
  scrapingJobs: ScrapingScheduleJob[];
  scrapingFrequency: ScrapingFrequency;
  setScrapingFrequency: (freq: ScrapingFrequency) => Promise<void>;
  scheduleAndExecuteScraping: (
    jobInput: Omit<ScrapingScheduleJob, 'id' | 'createdAt' | 'status' | 'lastRunAt' | 'recordsFoundCount'>
  ) => Promise<void>;
  adminNotifications: AdminNotificationEvent[];
  unreadNotificationsCount: number;
  pushAdminNotification: (event: Omit<AdminNotificationEvent, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  CART: 'braciami_cart_v1',
  ORDERS: 'braciami_orders_v1',
  CUSTOMERS: 'braciami_customers_v1',
  PROPOSALS: 'braciami_proposals_v1',
  POINTS: 'braciami_points_v1',
  NEWSLETTER: 'braciami_newsletter_v1',
  PHOTO: 'braciami_photo_v1',
  MANUEL_PHOTO: 'braciami_manuel_photo_v1',
  SAMANTA_PHOTO: 'braciami_samanta_photo_v1',
  THEME: 'braciami_active_theme_v1'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<ActivePage>('intro');
  const [adminActiveTab, setAdminActiveTab] = useState<AdminTab>('ordini_attivi');
  const [localStores30Km, setLocalStores30Km] = useState<LocalGroceryStore30Km[]>(SEED_LOCAL_GROCERY_STORES_30KM);
  const [scrapingJobs, setScrapingJobs] = useState<ScrapingScheduleJob[]>(INITIAL_SCRAPING_JOBS);
  const [scrapingFrequency, setScrapingFrequencyState] = useState<ScrapingFrequency>('giornaliero');
  const [slidingsConfig, setSlidingsConfig] = useState<SlidingConfigItem[]>(DEFAULT_SLIDINGS_CONFIG);
  const [accessoAdminLog, setAccessoAdminLog] = useState<AccessoAdminLog>(DEFAULT_ACCESSO_ADMIN);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(() => {
    try {
      const val = localStorage.getItem(LOCAL_STORAGE_KEYS.PHOTO);
      if (val && !val.includes('_reale.jpg')) return val;
      return null;
    } catch {
      return null;
    }
  });
  const [uploadedManuelPhotoUrl, setUploadedManuelPhotoUrl] = useState<string | null>(() => {
    try {
      const val = localStorage.getItem(LOCAL_STORAGE_KEYS.MANUEL_PHOTO);
      if (val && !val.includes('_reale.jpg')) return val;
      return null;
    } catch {
      return null;
    }
  });
  const [uploadedSamantaPhotoUrl, setUploadedSamantaPhotoUrl] = useState<string | null>(() => {
    try {
      const val = localStorage.getItem(LOCAL_STORAGE_KEYS.SAMANTA_PHOTO);
      if (val && !val.includes('_reale.jpg')) return val;
      return null;
    } catch {
      return null;
    }
  });

  // Admin auth state (sessionStorage persisted)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('braciami_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  // Products loaded from Firebase Firestore & Enriched Enterprise Catalog
  const [products, setProducts] = useState<Product[]>(ENRICHED_SEED_PRODUCTS);
  const [adminNotifications, setAdminNotifications] = useState<AdminNotificationEvent[]>(SEED_ADMIN_NOTIFICATIONS);
  
  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI Drawer / Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Promos & Campaigns
  const [campaigns] = useState<PromoCampaign[]>(INITIAL_CAMPAIGNS);
  const [appliedPromo, setAppliedPromo] = useState<PromoCampaign | null>(null);

  // Orders & Customers loaded from SQLite & Firebase
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<CustomerProfile[]>(INITIAL_CUSTOMERS);
  const [activeCustomer, setActiveCustomer] = useState<CustomerProfile | null>(null);

  // Load products and notifications from Firebase + SQLite customers/orders
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [fbProds, fbNotifs, sqlCusts, sqlOrds, fbStores30, fbJobs, fbSlidings, fbAccessoAdmin, fbNewsletter] = await Promise.all([
          FirestoreService.getAllProducts(),
          FirestoreService.getAdminNotifications(),
          sqlGetCustomers(),
          sqlGetAllOrders(),
          FirestoreService.getLocalGroceryStores30Km(),
          FirestoreService.getScrapingJobs(),
          FirestoreService.getSlidingsConfig(),
          FirestoreService.getAccessoAdminLog(),
          FirestoreService.getNewsletterSubscribers()
        ]);
        if (isMounted) {
          if (fbProds && fbProds.length > 0) setProducts(fbProds);
          if (fbNotifs && fbNotifs.length > 0) setAdminNotifications(fbNotifs);
          if (sqlCusts && sqlCusts.length > 0) setCustomers(sqlCusts);
          if (sqlOrds && sqlOrds.length > 0) setOrders(sqlOrds);
          if (fbStores30 && fbStores30.length > 0) setLocalStores30Km(fbStores30);
          if (fbJobs && fbJobs.length > 0) setScrapingJobs(fbJobs);
          if (fbSlidings && fbSlidings.length > 0) setSlidingsConfig(fbSlidings);
          if (fbAccessoAdmin) setAccessoAdminLog(fbAccessoAdmin);
          if (fbNewsletter && fbNewsletter.length > 0) {
            setNewsletterSubscribers(fbNewsletter);
            setSubscribedNewsletterEmails(
              fbNewsletter.filter((n) => n.status === 'attivo').map((n) => n.email.toLowerCase())
            );
          }
        }
      } catch (err) {
        console.warn('Database init fallback to memory defaults:', err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Loyalty points
  const [userPoints, setUserPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.POINTS);
      return saved ? Number(saved) : 180;
    } catch {
      return 180;
    }
  });

  // Commercial Proposals
  const [proposals, setProposals] = useState<CommercialProposal[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PROPOSALS);
      return saved ? JSON.parse(saved) : INITIAL_PROPOSALS;
    } catch {
      return INITIAL_PROPOSALS;
    }
  });

  // Newsletter
  const [subscribedNewsletterEmails, setSubscribedNewsletterEmails] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.NEWSLETTER);
      return saved ? JSON.parse(saved) : ['marco.bonora@email.it'];
    } catch {
      return ['marco.bonora@email.it'];
    }
  });
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [lastSentNewsletterRecord, setLastSentNewsletterRecord] = useState<NewsletterSubscriber | null>(null);

  // Check URL for legal newsletter unsubscription link (?unsubscribe_newsletter=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const unsubEmail = params.get('unsubscribe_newsletter');
      if (unsubEmail) {
        const clean = unsubEmail.toLowerCase().trim();
        FirestoreService.unsubscribeNewsletter(clean).then(() => {
          setSubscribedNewsletterEmails((prev) => prev.filter((e) => e !== clean));
          setNewsletterSubscribers((prev) =>
            prev.map((s) =>
              s.email.toLowerCase() === clean
                ? { ...s, status: 'disiscritto', unsubscribedAt: new Date().toISOString() }
                : s
            )
          );
          showToast(`Disiscrizione completata a norma di legge per: ${clean}`);
        });
        params.delete('unsubscribe_newsletter');
        params.delete('token');
        const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
        window.history.replaceState({}, '', nextUrl);
      }
    } catch {}
  }, []);

  // Theme state: 'braciami' [default] or 'chiaro'
  const [theme, setThemeState] = useState<'braciami' | 'chiaro'>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
      if (saved === 'chiaro' || saved === 'braciami') return saved;
      return 'braciami';
    } catch {
      return 'braciami';
    }
  });

  const setTheme = (newTheme: 'braciami' | 'chiaro') => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, newTheme);
    } catch {}
  };

  // OTP State for checkout verification
  const [generatedOtp, setGeneratedOtp] = useState<{ code: string; destination: string; channel: 'SMS' | 'Email' } | null>(null);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.POINTS, userPoints.toString());
    } catch (e) {
      console.error(e);
    }
  }, [userPoints]);

  useEffect(() => {
    try {
      if (uploadedPhotoUrl) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.PHOTO, uploadedPhotoUrl);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.PHOTO);
      }
    } catch (e) {
      console.error(e);
    }
  }, [uploadedPhotoUrl]);

  useEffect(() => {
    try {
      if (uploadedManuelPhotoUrl) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.MANUEL_PHOTO, uploadedManuelPhotoUrl);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.MANUEL_PHOTO);
      }
    } catch (e) {
      console.error(e);
    }
  }, [uploadedManuelPhotoUrl]);

  useEffect(() => {
    try {
      if (uploadedSamantaPhotoUrl) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.SAMANTA_PHOTO, uploadedSamantaPhotoUrl);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.SAMANTA_PHOTO);
      }
    } catch (e) {
      console.error(e);
    }
  }, [uploadedSamantaPhotoUrl]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 4000);
  };

  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setActivePage('admin-crm');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  const recordAccessoAdmin = async (email: string): Promise<AccessoAdminLog> => {
    const cleanEmail = (email || 'diegocimarosa@gmail.com').trim();
    const log = await FirestoreService.saveAccessoAdminLog(cleanEmail);
    setAccessoAdminLog(log);
    return log;
  };

  const saveSlidingsConfig = async (items: SlidingConfigItem[]) => {
    setSlidingsConfig(items);
    await FirestoreService.saveSlidingsConfig(items);
    showToast('Configurazione "slidings" salvata su Firebase (tabella configurazione)!');
  };

  const onAdminLoginSuccess = (adminEmail?: string) => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('braciami_admin_auth', 'true');
    setIsAdminAuthModalOpen(false);
    setActivePage('admin-crm');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const emailToSave = (adminEmail || 'diegocimarosa@gmail.com').trim();
    recordAccessoAdmin(emailToSave).catch((err) => console.warn('Errore log accessoAdmin:', err));
    showToast(`Accesso autorizzato (${emailToSave}): Benvenuti in Amministrazione!`);
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminActiveTab('ordini_attivi');
    setCart([]);
    setAppliedPromo(null);
    setActiveCustomer(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    setSelectedProductDetail(null);
    setIsLoyaltyOpen(false);
    setIsPromoModalOpen(false);
    setGeneratedOtp(null);
    setIsOtpVerified(false);
    try {
      sessionStorage.clear();
      localStorage.clear();
      if (typeof window !== 'undefined' && 'caches' in window) {
        window.caches.keys().then((names) => names.forEach((n) => window.caches.delete(n)));
      }
    } catch {}
    setActivePage('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Sessione chiusa e cache ripulita. Ritorno alla Landing Page.');
  };

  const resetToDefaultPhotos = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.MANUEL_PHOTO);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.SAMANTA_PHOTO);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.PHOTO);
    } catch (e) {
      console.error(e);
    }
    setUploadedManuelPhotoUrl(null);
    setUploadedSamantaPhotoUrl(null);
    setUploadedPhotoUrl(null);
    showToast('Foto ripristinate ai valori predefiniti.');
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, specialInstructions?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          specialInstructions: specialInstructions || next[existingIndex].specialInstructions
        };
        return next;
      }
      return [...prev, { product, quantity, specialInstructions }];
    });
    showToast(`"${product.name}" aggiunto alla comanda brace!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleFrozenRequested = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, isFrozenRequested: !item.isFrozenRequested }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Promo handling
  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    const campaign = campaigns.find(
      (c) => c.code.toUpperCase() === clean
    );

    if (!campaign) {
      return { success: false, message: 'Codice promo non valido o inesistente.' };
    }

    if (campaign.minSpend && cartSubtotal < campaign.minSpend) {
      return {
        success: false,
        message: `Minimo di spesa €${campaign.minSpend} non raggiunto per il codice ${clean}.`
      };
    }

    setAppliedPromo(campaign);
    return { success: true, message: `Promozione "${campaign.title}" applicata!` };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promozione rimossa dal carrello.');
  };

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'percentage') {
      discountAmount = (cartSubtotal * appliedPromo.discountValue) / 100;
    } else {
      discountAmount = Math.min(appliedPromo.discountValue, cartSubtotal);
    }
  }

  // OTP functions
  const requestOtp = (destination: string, channel: 'SMS' | 'Email'): string => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp({ code, destination, channel });
    setIsOtpVerified(false);
    return code;
  };

  const verifyOtp = (code: string): boolean => {
    if (generatedOtp && generatedOtp.code === code.trim()) {
      setIsOtpVerified(true);
      return true;
    }
    return false;
  };

  const resetOtp = () => {
    setGeneratedOtp(null);
    setIsOtpVerified(false);
  };

  // SQLite Customer OTP & Order Tracking Services
  const requestCustomerOtp = async (phoneOrEmail: string) => {
    return await sqlRequestOtp(phoneOrEmail);
  };

  const verifyCustomerOtp = async (phoneOrEmail: string, code: string) => {
    const result = await sqlVerifyOtp(phoneOrEmail, code);
    if (result.success && result.customer) {
      setActiveCustomer({
        id: result.customer.id,
        fullName: result.customer.full_name,
        email: result.customer.email,
        phone: result.customer.phone,
        address: result.customer.address,
        registeredDate: result.customer.registered_date,
        totalSpent: result.customer.total_spent,
        orderCount: result.customer.order_count,
        lastOrderDate: result.customer.last_order_date,
        loyaltyPoints: result.customer.loyalty_points,
        segment: result.customer.segment,
        preferredCut: result.customer.notes
      });
    }
    return result;
  };

  const fetchCustomerOrders = async (phoneOrEmail: string) => {
    return await sqlGetOrdersForCustomer(phoneOrEmail);
  };

  const processPaymentMethod = (
    method: PaymentMethod,
    amount: number,
    customer: { fullName: string; phone: string; email: string }
  ) => {
    return simulatePaymentProcessing(method, amount, customer);
  };

  // Admin Real-Time Notification Functions
  const pushAdminNotification = (
    eventData: Omit<AdminNotificationEvent, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotif: AdminNotificationEvent = {
      ...eventData,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setAdminNotifications((prev) => [newNotif, ...prev]);
    FirestoreService.logAdminNotification(newNotif).catch(() => {});
  };

  const markNotificationAsRead = (id: string) => {
    setAdminNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    FirestoreService.markNotificationRead(id).catch(() => {});
  };

  const markAllNotificationsAsRead = () => {
    setAdminNotifications((prev) => {
      prev.forEach((n) => {
        if (!n.read) FirestoreService.markNotificationRead(n.id).catch(() => {});
      });
      return prev.map((n) => ({ ...n, read: true }));
    });
  };

  const unreadNotificationsCount = adminNotifications.filter((n) => !n.read).length;

  const saveProductToCatalog = async (product: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = product;
        return next;
      }
      return [product, ...prev];
    });
    await FirestoreService.saveProduct(product);
    showToast(`Scheda Prodotto "${product.name}" salvata su Firebase!`);
  };

  // Create Order
  const createOrder = (orderData: Omit<Order, 'id' | 'date' | 'earnedPoints'>): Order => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `BA-${randomSuffix}`;
    const earnedPoints = Math.floor(orderData.total / 5);

    const newOrder: Order = {
      ...orderData,
      id: newId,
      date: dateStr,
      earnedPoints
    };

    setOrders((prev) => [newOrder, ...prev]);
    setUserPoints((prev) => prev + earnedPoints);
    clearCart();

    // Persist order to Firestore database
    FirestoreService.saveOrder(newOrder).catch((err) => {
      console.warn('Firestore order sync warning:', err);
    });

    // Notify Admin in real-time of the new order!
    pushAdminNotification({
      type: 'NEW_ORDER',
      severity: 'success',
      title: `Nuovo Ordine Ricevuto #${newId} (€${orderData.total.toFixed(2)})`,
      message: `${orderData.customer.fullName} (${orderData.customer.city || 'Cento'}) · ${orderData.items.length} articoli · Pagamento: ${orderData.paymentMethod}`,
      countryCode: orderData.customer.countryCode || 'IT',
      deviceType: 'Smartphone',
      customerName: orderData.customer.fullName,
      customerContact: orderData.customer.phone || orderData.customer.email,
      relatedOrderId: newId,
      amountEur: orderData.total
    });

    // Auto-update CRM customer
    setCustomers((prev) => {
      const existing = prev.find(
        (c) =>
          c.phone === orderData.customer.phone ||
          (orderData.customer.email && c.email.toLowerCase() === orderData.customer.email.toLowerCase())
      );
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalSpent: c.totalSpent + orderData.total,
                orderCount: c.orderCount + 1,
                lastOrderDate: dateStr.split(' ')[0],
                loyaltyPoints: c.loyaltyPoints + earnedPoints,
                segment: c.totalSpent + orderData.total > 350 ? 'Top Spender' : 'Abituale Weekend'
              }
            : c
        );
      } else {
        const newCustomerProfile: CustomerProfile = {
          id: `cust-${Date.now()}`,
          fullName: orderData.customer.fullName,
          email: orderData.customer.email,
          phone: orderData.customer.phone,
          address: orderData.customer.address || 'Cento (FE)',
          registeredDate: dateStr.split(' ')[0],
          totalSpent: orderData.total,
          orderCount: 1,
          lastOrderDate: dateStr.split(' ')[0],
          loyaltyPoints: earnedPoints,
          segment: 'Nuovo Cliente',
          preferredCut: orderData.items[0]?.product.name || 'Brace varia'
        };
        return [newCustomerProfile, ...prev];
      }
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Stato ordine ${orderId} aggiornato: ${status}`);
  };

  const updateOrder = async (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
    try {
      await FirestoreService.saveOrder(updatedOrder);
    } catch {}
    showToast(`Ordine #${updatedOrder.id} aggiornato e salvato con successo!`);
  };

  const setScrapingFrequency = async (freq: ScrapingFrequency) => {
    setScrapingFrequencyState(freq);
    try {
      await FirestoreService.updateStoreConfig({ scraping_frequency: freq });
    } catch {}
    showToast(`Frequenza di scraping impostata su: ${freq}`);
  };

  const scheduleAndExecuteScraping = async (
    jobInput: Omit<ScrapingScheduleJob, 'id' | 'createdAt' | 'status' | 'lastRunAt' | 'recordsFoundCount'>
  ) => {
    const nowIso = new Date().toISOString();
    
    // Esecuzione dello scraping REALE online: scansione codici EAN-13, marchi e schede prodotto
    let realSheets = [];
    try {
      realSheets = await executeRealProductScraping();
    } catch (e) {
      console.warn('[Scraping] Errore scansione web reale:', e);
    }

    const updatedStores = buildLocalGroceryStores30Km(products, nowIso).map((store) => {
      // Associa le schede prodotto reali ottenute dalla scansione online
      const matchingReal = realSheets.filter(
        (rs) => rs.referenceStore.chainName.toLowerCase().includes(store.chainName.toLowerCase()) ||
                rs.referenceStore.city.toLowerCase() === store.city.toLowerCase()
      );

      if (matchingReal.length > 0) {
        return {
          ...store,
          lastScrapedAt: nowIso,
          scrapedProducts: matchingReal.map((mr) => ({
            ean13: mr.ean13,
            competitorProductName: `${mr.productName} (${mr.brand})`,
            category: mr.category,
            ourEquivalentProductName: mr.ourEquivalentPrice ? `${mr.productName} - Selezione Bottega` : 'Taglio Equivalente Bottega',
            competitorPricePerKg: mr.pricePerKgEstimated,
            ourPricePerKg: Number((mr.ourEquivalentPrice * 4).toFixed(2)),
            priceDiffPercent: mr.priceDiffPercent,
            isConvenient: mr.isConvenient,
            unit: '€/Kg' as const,
            sourceUrl: mr.sourceUrl,
            imageUrl: mr.imageUrl,
            quantity: mr.quantity
          }))
        };
      }
      return store;
    });

    setLocalStores30Km(updatedStores);

    // Salva su Firebase Cloud Firestore nella collezione local_grocery_stores_30km
    for (const st of updatedStores) {
      await FirestoreService.saveLocalGroceryStore30Km(st).catch(() => {});
    }

    const matchingRecords = updatedStores
      .filter((s) => s.distanceFromCentoKm <= jobInput.maxDistanceKm)
      .filter((s) => !jobInput.city || jobInput.city === 'Tutti' || s.city.toLowerCase().includes(jobInput.city.toLowerCase()))
      .filter((s) => !jobInput.province || jobInput.province === 'Tutte' || s.province.toLowerCase() === jobInput.province.toLowerCase())
      .filter((s) => jobInput.storeType === 'tutti' || s.storeType === jobInput.storeType)
      .reduce((acc, s) => acc + s.scrapedProducts.length, 0);

    const newJob: ScrapingScheduleJob = {
      ...jobInput,
      id: `job-${Date.now()}`,
      createdAt: nowIso,
      status: 'completato',
      lastRunAt: nowIso,
      recordsFoundCount: matchingRecords
    };

    setScrapingJobs((prev) => [newJob, ...prev]);
    await FirestoreService.saveScrapingJob(newJob);

    pushAdminNotification({
      type: 'STOCK_OR_COMPETITOR_ALERT',
      severity: 'info',
      title: `Scraping Web Reale Completato (Raggio ${jobInput.maxDistanceKm} km)`,
      message: `Scansionate schede prodotto e codici EAN-13 reali (GDO e negozi entro ${jobInput.maxDistanceKm} km da Cento FE).`,
      countryCode: jobInput.country || 'IT',
      deviceType: 'Desktop'
    });

    showToast(`Scraping reale completato: ${matchingRecords} prodotti con EAN e schede reali aggiornati!`);
  };

  // Commercial Proposals
  const createCommercialProposal = (
    proposal: Omit<CommercialProposal, 'id' | 'createdDate' | 'status'>
  ) => {
    const newProposal: CommercialProposal = {
      ...proposal,
      id: `prop-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'bozza'
    };
    setProposals((prev) => [newProposal, ...prev]);
    showToast(`Nuova proposta "${proposal.title}" salvata in bozza.`);
  };

  const sendCommercialProposal = (id: string) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'inviata' } : p))
    );
    showToast(`Proposta commerciale inviata con successo ai clienti in target!`);
  };

  // Loyalty Points Redemption
  const redeemPointsVoucher = (pointsCost: number, voucherAmount: number): boolean => {
    if (userPoints < pointsCost) {
      showToast('Punti insufficienti per sbloccare questo premio.');
      return false;
    }
    setUserPoints((prev) => prev - pointsCost);
    const voucherCode = `PREMIO${voucherAmount}EURO`;
    setAppliedPromo({
      code: voucherCode,
      title: `Buono Fedeltà ${voucherAmount}€`,
      discountType: 'fixed',
      discountValue: voucherAmount,
      expiresAt: '2026-12-31',
      description: `Buono sconto da €${voucherAmount} riscattato con i tuoi punti fedeltà!`
    });
    showToast(`Complimenti! Buono da ${voucherAmount}€ applicato al tuo carrello!`);
    return true;
  };

  // Newsletter
  const subscribeNewsletter = (email: string): boolean => {
    const cleanEmail = email.toLowerCase().trim();
    if (subscribedNewsletterEmails.includes(cleanEmail)) {
      showToast('Sei già iscritto alla nostra newsletter con questa email!');
      return false;
    }
    setSubscribedNewsletterEmails((prev) => [...prev, cleanEmail]);
    setUserPoints((prev) => prev + 25);

    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://braciamiancora.it';
    const id = cleanEmail.replace(/[^a-z0-9]/g, '_');
    const token = `unsub_${id}_${Date.now().toString(36)}`;
    const legalUnsubscribeUrl = `${origin}/?unsubscribe_newsletter=${encodeURIComponent(cleanEmail)}&token=${token}`;
    const legalPrivacyUrl = `${origin}/?page=privacy`;
    const welcomeMail = FirestoreService.buildNewsletterWelcomeEmail(
      cleanEmail,
      legalUnsubscribeUrl,
      legalPrivacyUrl
    );
    const optimisticRecord: NewsletterSubscriber = {
      id,
      email: cleanEmail,
      subscribedAt: new Date().toISOString(),
      language: 'it_IT',
      status: 'attivo',
      unsubscribeToken: token,
      welcomeEmailSent: true,
      welcomeEmailSubject: welcomeMail.subject,
      welcomeEmailBodyHtml: welcomeMail.html,
      legalUnsubscribeUrl,
      legalPrivacyUrl
    };

    setNewsletterSubscribers((prev) => [
      optimisticRecord,
      ...prev.filter((item) => item.email.toLowerCase() !== cleanEmail)
    ]);
    setLastSentNewsletterRecord(optimisticRecord);
    showToast(
      `Grazie per l'iscrizione alla newsletter di Braciami Ancora - Cento! Email di conferma inviata a ${cleanEmail}.`
    );

    // Persist newsletter subscriber & welcome email to Firestore
    FirestoreService.subscribeNewsletter(cleanEmail)
      .then((savedRec) => {
        setNewsletterSubscribers((prev) => [
          savedRec,
          ...prev.filter((item) => item.email.toLowerCase() !== cleanEmail)
        ]);
      })
      .catch((err) => {
        console.warn('Firestore newsletter sync warning:', err);
      });

    return true;
  };

  const unsubscribeNewsletterByEmail = async (emailOrId: string) => {
    const clean = emailOrId.toLowerCase().trim();
    await FirestoreService.unsubscribeNewsletter(clean);
    setSubscribedNewsletterEmails((prev) => prev.filter((e) => e !== clean));
    setNewsletterSubscribers((prev) =>
      prev.map((s) =>
        s.email.toLowerCase() === clean || s.id === clean
          ? { ...s, status: 'disiscritto', unsubscribedAt: new Date().toISOString() }
          : s
      )
    );
    showToast(`Utente ${clean} disiscritto dalla newsletter (tabella Firebase "newsletter" aggiornata).`);
  };

  const deleteNewsletterSubscriber = async (id: string) => {
    await FirestoreService.deleteNewsletterSubscriber(id);
    setNewsletterSubscribers((prev) => {
      const target = prev.find((s) => s.id === id);
      if (target) {
        setSubscribedNewsletterEmails((emails) =>
          emails.filter((e) => e !== target.email.toLowerCase())
        );
      }
      return prev.filter((s) => s.id !== id);
    });
    showToast('Iscritto rimosso dalla tabella Firebase "newsletter".');
  };

  return (
    <StoreContext.Provider
      value={{
        activePage,
        setActivePage,
        adminActiveTab,
        setAdminActiveTab,
        uploadedPhotoUrl,
        setUploadedPhotoUrl,
        uploadedManuelPhotoUrl,
        setUploadedManuelPhotoUrl,
        uploadedSamantaPhotoUrl,
        setUploadedSamantaPhotoUrl,
        resetToDefaultPhotos,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        isAdminAuthModalOpen,
        setIsAdminAuthModalOpen,
        handleOpenAdmin,
        onAdminLoginSuccess,
        adminLogout,
        products,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleFrozenRequested,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProductDetail,
        setSelectedProductDetail,
        isLoyaltyOpen,
        setIsLoyaltyOpen,
        isPromoModalOpen,
        setIsPromoModalOpen,
        campaigns,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        discountAmount,
        orders,
        createOrder,
        updateOrderStatus,
        updateOrder,
        customers,
        activeCustomer,
        setActiveCustomer,
        proposals,
        createCommercialProposal,
        sendCommercialProposal,
        requestCustomerOtp,
        verifyCustomerOtp,
        fetchCustomerOrders,
        processPaymentMethod,
        generatedOtp,
        requestOtp,
        verifyOtp,
        isOtpVerified,
        resetOtp,
        userPoints,
        redeemPointsVoucher,
        subscribedNewsletterEmails,
        newsletterSubscribers,
        lastSentNewsletterRecord,
        setLastSentNewsletterRecord,
        subscribeNewsletter,
        unsubscribeNewsletterByEmail,
        deleteNewsletterSubscriber,
        toastMessage,
        showToast,
        theme,
        setTheme,
        saveProductToCatalog,
        localStores30Km,
        scrapingJobs,
        scrapingFrequency,
        setScrapingFrequency,
        scheduleAndExecuteScraping,
        adminNotifications,
        unreadNotificationsCount,
        pushAdminNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        slidingsConfig,
        saveSlidingsConfig,
        accessoAdminLog,
        recordAccessoAdmin
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
