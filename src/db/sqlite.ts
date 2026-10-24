import initSqlJs, { Database } from 'sql.js';
import { INITIAL_SQL_CUSTOMERS, ALL_SQL_PRODUCTS, SqlCustomer, SqlProduct } from './seedData';
export type { SqlCustomer, SqlProduct };
import { Product, CustomerProfile, Order, OrderStatus, CartItem, DeliveryMethod, PaymentMethod } from '../types';

// In-Memory Relational SQL Store (Guarantees zero-failure operation even if WASM fails to load in preview iframe)
interface StoredOtp {
  phoneOrEmail: string;
  code: string;
  expiresAt: number;
  attempts: number;
}

interface StoredOrderItem {
  id: number;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  instructions: string;
}

class InMemorySqlStore {
  customers: Map<string, SqlCustomer> = new Map();
  products: Map<string, SqlProduct> = new Map();
  orders: Map<string, any> = new Map();
  orderItems: StoredOrderItem[] = [];
  otps: Map<string, StoredOtp> = new Map();

  constructor() {
    this.seed();
  }

  seed() {
    INITIAL_SQL_CUSTOMERS.forEach((c) => this.customers.set(c.id, { ...c }));
    ALL_SQL_PRODUCTS.forEach((p) => this.products.set(p.id, { ...p }));

    // Seed starter orders
    const sampleStatuses: OrderStatus[] = ['ricevuto', 'in_griglia', 'pronto', 'in_consegna', 'completato', 'completato'];
    const sampleFiscalCodes = [
      'BNRMRC82H14C469X', 'GLLSRN88M45C469K', 'VRDGPP75C12A944W', 'FRRLCU90A01F257Z',
      'MNTNNA85D55C469P', 'RSSMRA79E20C469T', 'BLDFNC83L11A944Q', 'CSTGNN92H18C469V',
      'ZNNPLA77B08F257M', 'CAVLCU86S42C469R', 'BRTGPP81T15C469J', 'MZZLSN94C50A944E',
      'FBBMTT80P12C469Y', 'GRNCLD87E62C469B', 'LMBFNC76A19F257N', 'PRNSRA91L48C469G',
      'SNTMRK84D03C469H', 'TSSLRA89R54A944S', 'VLLGNN78M22C469D', 'GDILCA93B41C469U'
    ];
    for (let i = 0; i < 20; i++) {
      const cust = INITIAL_SQL_CUSTOMERS[i];
      const orderId = `BA-${8400 + i}`;
      const status = sampleStatuses[i % sampleStatuses.length];
      const isPickup = i % 2 === 0;
      const deliveryMethod: DeliveryMethod = isPickup ? 'ritiro_bottega' : 'consegna_cento';

      const p1 = ALL_SQL_PRODUCTS[i % ALL_SQL_PRODUCTS.length];
      const p2 = ALL_SQL_PRODUCTS[(i + 7) % ALL_SQL_PRODUCTS.length];
      const item1Subtotal = Number(p1.price.toFixed(2));
      const item2Subtotal = Number((p2.price * 2).toFixed(2));

      const subtotal = Number((item1Subtotal + item2Subtotal).toFixed(2));
      const discount = i % 3 === 0 ? 3.00 : 0;
      const fee = isPickup ? 0 : 3.50;
      const total = Number(Math.max(1, subtotal - discount + fee).toFixed(2));
      const pMethod = cust.payment_method;
      const pStatus = pMethod === 'contanti_ritiro' ? 'in_attesa_al_ritiro' : 'pagato';
      const txnId = pMethod === 'carta_credito' ? `PCI_TXN_AUTH_${77000 + i}` : pMethod === 'satispay' ? `SATISPAY_OK_${i}` : `PAYPAL_TXN_${i}`;
      const isBusiness = i % 4 === 0;

      this.orders.set(orderId, {
        id: orderId,
        customer_id: cust.id,
        customer_first_name: cust.first_name,
        customer_last_name: cust.last_name,
        customer_name: cust.full_name,
        customer_company: isBusiness ? `${cust.last_name} Gastronomia & Ristorazione S.r.l.` : 'Privato',
        customer_vat: isBusiness ? `IT0${(192837465 + i * 111).toString().slice(0, 10)}` : '-',
        customer_fiscal_code: sampleFiscalCodes[i % sampleFiscalCodes.length],
        customer_phone: cust.phone,
        customer_email: cust.email,
        customer_address: cust.address || 'Via Penzale 25',
        customer_cap: cust.cap || '44042',
        customer_city: cust.city || 'Cento',
        customer_province: cust.province || 'FE',
        customer_country: 'IT',
        delivery_method: deliveryMethod,
        delivery_time_slot: isPickup ? '12:30 (Ritiro Bottega Cento)' : '20:00 (Consegna a domicilio)',
        status,
        subtotal,
        discount,
        delivery_fee: fee,
        total,
        payment_method: pMethod,
        payment_status: pStatus,
        payment_transaction_id: txnId,
        earned_points: Math.floor(total / 5),
        created_at: `2026-03-${(15 + (i % 5)).toString().padStart(2, '0')} 11:${(10 + i * 2).toString().padStart(2, '0')}:00`
      });

      this.orderItems.push({
        id: this.orderItems.length + 1,
        orderId,
        productId: p1.id,
        productName: p1.name,
        quantity: 1,
        unitPrice: p1.price,
        subtotal: item1Subtotal,
        instructions: 'Cottura al sangue con osso alto sulla brace'
      });
      this.orderItems.push({
        id: this.orderItems.length + 1,
        orderId,
        productId: p2.id,
        productName: p2.name,
        quantity: 2,
        unitPrice: p2.price,
        subtotal: item2Subtotal,
        instructions: 'Porzione calda espressa'
      });
    }
  }

  findCustomer(phoneOrEmail: string): SqlCustomer | undefined {
    const clean = phoneOrEmail.trim().toLowerCase();
    const cleanDigits = phoneOrEmail.replace(/\D/g, '');

    for (const cust of this.customers.values()) {
      if (cust.email.toLowerCase() === clean) return cust;
      const custDigits = cust.phone.replace(/\D/g, '');
      if (cleanDigits.length >= 6 && custDigits.includes(cleanDigits)) return cust;
      if (cust.phone.toLowerCase().includes(clean)) return cust;
    }
    return undefined;
  }
}

export const inMemSql = new InMemorySqlStore();

let dbInstance: Database | null = null;
let initPromise: Promise<Database | null> | null = null;

// Initialize SQLite WASM (with graceful fallback to inMemSql if WASM loading is blocked in iframe)
export async function getSqliteDb(): Promise<Database | null> {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      if (typeof window === 'undefined') {
        return null;
      }
      const SQL = await initSqlJs({
        locateFile: (file) => `/${file}`
      });

      const db = new SQL.Database();
      dbInstance = db;

      // Create tables
      db.run(`
        CREATE TABLE IF NOT EXISTS customers (
          id TEXT PRIMARY KEY,
          first_name TEXT,
          last_name TEXT,
          full_name TEXT,
          email TEXT,
          phone TEXT,
          address TEXT,
          city TEXT,
          cap TEXT,
          province TEXT,
          is_registered INTEGER,
          payment_method TEXT,
          payment_details TEXT,
          registered_date TEXT,
          total_spent REAL,
          order_count INTEGER,
          last_order_date TEXT,
          loyalty_points INTEGER,
          segment TEXT,
          notes TEXT
        );

        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT,
          category TEXT,
          sub_category TEXT,
          price REAL,
          original_price REAL,
          price_unit TEXT,
          portion TEXT,
          description TEXT,
          curator TEXT,
          curator_note TEXT,
          cooking_time TEXT,
          is_ready_to_eat INTEGER,
          is_popular INTEGER,
          heat_scale INTEGER,
          frollatura_days INTEGER,
          allergens TEXT,
          ingredients TEXT,
          tags TEXT
        );

        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          customer_id TEXT,
          customer_name TEXT,
          customer_phone TEXT,
          customer_email TEXT,
          customer_address TEXT,
          delivery_method TEXT,
          delivery_time_slot TEXT,
          status TEXT,
          subtotal REAL,
          discount REAL,
          delivery_fee REAL,
          total REAL,
          payment_method TEXT,
          payment_status TEXT,
          payment_transaction_id TEXT,
          earned_points INTEGER,
          created_at TEXT
        );

        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id TEXT,
          product_id TEXT,
          product_name TEXT,
          quantity INTEGER,
          unit_price REAL,
          subtotal REAL,
          instructions TEXT
        );

        CREATE TABLE IF NOT EXISTS otps (
          phone_or_email TEXT PRIMARY KEY,
          code TEXT,
          expires_at INTEGER,
          attempts INTEGER
        );
      `);

      const insertCustomerStmt = db.prepare(`
        INSERT OR REPLACE INTO customers (
          id, first_name, last_name, full_name, email, phone, address, city, cap, province,
          is_registered, payment_method, payment_details, registered_date, total_spent,
          order_count, last_order_date, loyalty_points, segment, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      INITIAL_SQL_CUSTOMERS.forEach((c) => {
        insertCustomerStmt.run([
          c.id, c.first_name, c.last_name, c.full_name, c.email, c.phone, c.address, c.city, c.cap, c.province,
          c.is_registered ? 1 : 0, c.payment_method, c.payment_details, c.registered_date, c.total_spent,
          c.order_count, c.last_order_date, c.loyalty_points, c.segment, c.notes
        ]);
      });
      insertCustomerStmt.free();

      const insertProductStmt = db.prepare(`
        INSERT OR REPLACE INTO products (
          id, name, category, sub_category, price, original_price, price_unit, portion,
          description, curator, curator_note, cooking_time, is_ready_to_eat, is_popular,
          heat_scale, frollatura_days, allergens, ingredients, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      ALL_SQL_PRODUCTS.forEach((p) => {
        insertProductStmt.run([
          p.id, p.name, p.category, p.sub_category, p.price, p.original_price, p.price_unit, p.portion,
          p.description, p.curator, p.curator_note, p.cooking_time, p.is_ready_to_eat ? 1 : 0, p.is_popular ? 1 : 0,
          p.heat_scale, p.frollatura_days, p.allergens, p.ingredients, p.tags
        ]);
      });
      insertProductStmt.free();

      return db;
    } catch (err) {
      console.warn('[SQLite Local] WASM engine initialization notice (using resilient in-memory engine):', err);
      return null;
    }
  })();

  return initPromise;
}

// -------------------------------------------------------------
// QUERY HELPERS
// -------------------------------------------------------------

export async function sqlGetProducts(category?: string, search?: string): Promise<Product[]> {
  const allProds = Array.from(inMemSql.products.values());
  let filtered = allProds;

  if (category && category !== 'tutti') {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.tags.toLowerCase().includes(term)
    );
  }

  filtered.sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0) || b.price - a.price);

  return filtered.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    category: row.category as any,
    portion: String(row.portion),
    description: String(row.description),
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    curator: row.curator as any,
    curatorNote: String(row.curator_note),
    cookingTime: String(row.cooking_time),
    isReadyToEat: Boolean(row.is_ready_to_eat),
    isPopular: Boolean(row.is_popular),
    tags: row.tags ? JSON.parse(String(row.tags)) : [],
    allergens: row.allergens ? JSON.parse(String(row.allergens)) : []
  }));
}

export async function sqlGetCustomers(segmentFilter?: string): Promise<CustomerProfile[]> {
  let custs = Array.from(inMemSql.customers.values());
  if (segmentFilter && segmentFilter !== 'tutti') {
    custs = custs.filter((c) => c.segment === segmentFilter);
  }
  custs.sort((a, b) => b.total_spent - a.total_spent);

  return custs.map((row) => ({
    id: String(row.id),
    fullName: String(row.full_name),
    email: String(row.email),
    phone: String(row.phone),
    address: String(row.address),
    registeredDate: String(row.registered_date),
    totalSpent: Number(row.total_spent),
    orderCount: Number(row.order_count),
    lastOrderDate: String(row.last_order_date),
    loyaltyPoints: Number(row.loyalty_points),
    segment: row.segment as any,
    preferredCut: String(row.notes)
  }));
}

export async function sqlGetOrderItems(orderId: string): Promise<CartItem[]> {
  const items = inMemSql.orderItems.filter((i) => i.orderId === orderId);
  return items.map((row) => ({
    product: {
      id: String(row.productId),
      name: String(row.productName),
      category: 'carne_fresca',
      portion: '1 porzione',
      description: 'Piatto della bottega di Manuel e Samanta a Cento',
      price: Number(row.unitPrice),
      curator: 'Manuel',
      curatorNote: 'Cotto a legna dura di rovere',
      isReadyToEat: true,
      tags: []
    },
    quantity: Number(row.quantity),
    specialInstructions: String(row.instructions || '')
  }));
}

export async function sqlGetAllOrders(): Promise<Order[]> {
  const ordersList = Array.from(inMemSql.orders.values());
  ordersList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const results: Order[] = [];
  for (const row of ordersList) {
    const items = await sqlGetOrderItems(row.id);
    const fullNameStr = String(row.customer_name || '').trim();
    const nameParts = fullNameStr.split(/\s+/);
    const firstName = String(row.customer_first_name || nameParts[0] || '');
    const lastName = String(row.customer_last_name || nameParts.slice(1).join(' ') || '');
    results.push({
      id: row.id,
      date: String(row.created_at),
      items,
      subtotal: Number(row.subtotal),
      discount: Number(row.discount),
      deliveryFee: Number(row.delivery_fee),
      total: Number(row.total),
      status: row.status as any,
      deliveryMethod: row.delivery_method as any,
      deliveryTimeSlot: String(row.delivery_time_slot),
      paymentMethod: row.payment_method as any,
      paymentStatus: row.payment_status as any,
      customer: {
        firstName,
        lastName,
        fullName: fullNameStr,
        companyName: String(row.customer_company || 'Privato'),
        vatNumber: String(row.customer_vat || '-'),
        fiscalCode: String(row.customer_fiscal_code || 'BNRMRC82H14C469X'),
        email: String(row.customer_email || ''),
        phone: String(row.customer_phone || ''),
        address: String(row.customer_address || 'Via Penzale 25'),
        postalCode: String(row.customer_cap || '44042'),
        city: String(row.customer_city || 'Cento'),
        province: String(row.customer_province || 'FE'),
        countryCode: String(row.customer_country || 'IT'),
        isGuest: !row.customer_address,
        isOtpVerified: true
      },
      earnedPoints: Number(row.earned_points)
    });
  }
  return results;
}

export async function sqlGetOrdersForCustomer(phoneOrEmail: string): Promise<Order[]> {
  const cleanTerm = phoneOrEmail.trim().toLowerCase();
  const cleanDigits = phoneOrEmail.replace(/\D/g, '');

  const ordersList = Array.from(inMemSql.orders.values()).filter((o) => {
    if (o.customer_email && o.customer_email.toLowerCase() === cleanTerm) return true;
    if (o.customer_phone) {
      const oDigits = o.customer_phone.replace(/\D/g, '');
      if (cleanDigits.length >= 6 && oDigits.includes(cleanDigits)) return true;
      if (o.customer_phone.toLowerCase().includes(cleanTerm)) return true;
    }
    return false;
  });

  ordersList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const results: Order[] = [];
  for (const row of ordersList) {
    const items = await sqlGetOrderItems(row.id);
    const fullNameStr = String(row.customer_name || '').trim();
    const nameParts = fullNameStr.split(/\s+/);
    const firstName = String(row.customer_first_name || nameParts[0] || '');
    const lastName = String(row.customer_last_name || nameParts.slice(1).join(' ') || '');
    results.push({
      id: row.id,
      date: String(row.created_at),
      items,
      subtotal: Number(row.subtotal),
      discount: Number(row.discount),
      deliveryFee: Number(row.delivery_fee),
      total: Number(row.total),
      status: row.status as any,
      deliveryMethod: row.delivery_method as any,
      deliveryTimeSlot: String(row.delivery_time_slot),
      paymentMethod: row.payment_method as any,
      paymentStatus: row.payment_status as any,
      customer: {
        firstName,
        lastName,
        fullName: fullNameStr,
        companyName: String(row.customer_company || 'Privato'),
        vatNumber: String(row.customer_vat || '-'),
        fiscalCode: String(row.customer_fiscal_code || 'BNRMRC82H14C469X'),
        email: String(row.customer_email || ''),
        phone: String(row.customer_phone || ''),
        address: String(row.customer_address || 'Via Penzale 25'),
        postalCode: String(row.customer_cap || '44042'),
        city: String(row.customer_city || 'Cento'),
        province: String(row.customer_province || 'FE'),
        countryCode: String(row.customer_country || 'IT'),
        isGuest: false,
        isOtpVerified: true
      },
      earnedPoints: Number(row.earned_points)
    });
  }
  return results;
}

// -------------------------------------------------------------
// OTP VERIFICATION SYSTEM (Simulated SMS / WhatsApp for realistic Order tracking)
// -------------------------------------------------------------

export interface OtpRequestResult {
  success: boolean;
  code: string;
  phoneOrEmail: string;
  customer?: SqlCustomer;
  expiresInSeconds: number;
  message: string;
}

export async function sqlRequestOtp(phoneOrEmail: string): Promise<OtpRequestResult> {
  const term = phoneOrEmail.trim();
  const normalizedKey = term.toLowerCase().replace(/\s+/g, '');

  // 1. Find customer in database (matches exact, partial digits, or email)
  let customer = inMemSql.findCustomer(term);

  // If customer not found, create a guest customer profile dynamically so the user can test ANY phone/email
  if (!customer) {
    const isEmail = term.includes('@');
    const guestId = `CUST-GUEST-${Math.floor(1000 + Math.random() * 9000)}`;
    customer = {
      id: guestId,
      first_name: 'Cliente',
      last_name: 'Bottega',
      full_name: 'Cliente Bottega Cento',
      email: isEmail ? term : `cliente.${Math.floor(100 + Math.random() * 900)}@bottegacento.it`,
      phone: !isEmail ? term : '+39 347 1234567',
      address: 'Via Penzale, 25',
      city: 'Cento',
      cap: '44042',
      province: 'FE',
      is_registered: true,
      payment_method: 'contanti_ritiro',
      payment_details: JSON.stringify({ type: 'Contanti o POS al Ritiro in Bottega', location: 'Via Penzale, 25 · Cento' }),
      registered_date: new Date().toISOString().split('T')[0],
      total_spent: 85.00,
      order_count: 2,
      last_order_date: '2026-03-18',
      loyalty_points: 17,
      segment: 'Nuovo Cliente',
      notes: 'Accesso con verifica cellulare OTP'
    };
    inMemSql.customers.set(guestId, customer);

    // Create an initial sample order for this new guest so they see tracking immediately
    const sampleOrderId = `BA-${9000 + Math.floor(Math.random() * 900)}`;
    inMemSql.orders.set(sampleOrderId, {
      id: sampleOrderId,
      customer_id: guestId,
      customer_name: customer.full_name,
      customer_phone: customer.phone,
      customer_email: customer.email,
      customer_address: 'Via Penzale, 25 · Cento (FE)',
      delivery_method: 'ritiro_bottega',
      delivery_time_slot: '19:45 (Ritiro Bottega)',
      status: 'in_griglia',
      subtotal: 42.00,
      discount: 0,
      delivery_fee: 0,
      total: 42.00,
      payment_method: 'contanti_ritiro',
      payment_status: 'in_attesa_al_ritiro',
      payment_transaction_id: 'SCONTRINO_BANCO_104',
      earned_points: 8,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    });

    const p1 = ALL_SQL_PRODUCTS[0];
    const p2 = ALL_SQL_PRODUCTS[2];
    inMemSql.orderItems.push({
      id: inMemSql.orderItems.length + 1,
      orderId: sampleOrderId,
      productId: p1.id,
      productName: p1.name,
      quantity: 1,
      unitPrice: p1.price,
      subtotal: p1.price,
      instructions: 'Fiorentina su brace di rovere frollata 45gg'
    });
    inMemSql.orderItems.push({
      id: inMemSql.orderItems.length + 1,
      orderId: sampleOrderId,
      productId: p2.id,
      productName: p2.name,
      quantity: 1,
      unitPrice: p2.price,
      subtotal: p2.price,
      instructions: 'Patate al forno con rosmarino di Samanta'
    });
  }

  // 2. Generate 6-digit numeric OTP code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  inMemSql.otps.set(normalizedKey, {
    phoneOrEmail: term,
    code,
    expiresAt,
    attempts: 0
  });

  // Try also storing in WASM db if available
  try {
    const db = await getSqliteDb();
    if (db) {
      db.run('INSERT OR REPLACE INTO otps (phone_or_email, code, expires_at, attempts) VALUES (?, ?, ?, ?)', [
        term, code, expiresAt, 0
      ]);
    }
  } catch (e) {
    // Non-fatal, inMemSql has the OTP
  }

  const targetName = customer ? customer.full_name : 'Cliente Bottega Cento';
  return {
    success: true,
    code,
    phoneOrEmail: term,
    customer,
    expiresInSeconds: 300,
    message: `Codice OTP di verifica per ${targetName}: ${code}`
  };
}

export async function sqlVerifyOtp(
  phoneOrEmail: string,
  code: string
): Promise<{ success: boolean; customer?: SqlCustomer; error?: string }> {
  const term = phoneOrEmail.trim();
  const normalizedKey = term.toLowerCase().replace(/\s+/g, '');
  const cleanCode = code.trim();

  const stored = inMemSql.otps.get(normalizedKey);

  if (!stored) {
    // Check if any otp in store matches code (for convenient demo testing)
    for (const [key, otpEntry] of inMemSql.otps.entries()) {
      if (otpEntry.code === cleanCode && otpEntry.expiresAt > Date.now()) {
        inMemSql.otps.delete(key);
        const cust = inMemSql.findCustomer(otpEntry.phoneOrEmail);
        return { success: true, customer: cust };
      }
    }
    return { success: false, error: 'Nessun codice OTP richiesto per questo recapito o sessione scaduta.' };
  }

  if (Date.now() > stored.expiresAt) {
    inMemSql.otps.delete(normalizedKey);
    return { success: false, error: 'Codice OTP scaduto. Richiedine uno nuovo.' };
  }

  if (stored.code !== cleanCode) {
    stored.attempts += 1;
    return { success: false, error: 'Codice OTP errato. Controlla il messaggio e riprova.' };
  }

  // Clear OTP on success
  inMemSql.otps.delete(normalizedKey);

  // Lookup customer
  const customer = inMemSql.findCustomer(term);
  return { success: true, customer };
}

// -------------------------------------------------------------
// PAYMENT SIMULATION LOGIC (PCI-DSS Credit Card, Bancomat, PayPal, Satispay)
// -------------------------------------------------------------

export interface PaymentSimulationResult {
  success: boolean;
  method: string;
  transactionId: string;
  statusText: string;
  details: Record<string, unknown>;
  receiptMessage: string;
}

export function simulatePaymentProcessing(
  method: PaymentMethod,
  amount: number,
  customerData: { fullName: string; phone: string; email: string }
): PaymentSimulationResult {
  const timestamp = new Date().toISOString();
  const amountStr = `€${amount.toFixed(2)}`;

  switch (method) {
    case 'carta': {
      const pciToken = `PCI_DSS_TOKEN_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const authCode = `AUTH_${Math.floor(100000 + Math.random() * 900000)}`;
      return {
        success: true,
        method: 'Carta di Credito / Debito (PCI-DSS)',
        transactionId: pciToken,
        statusText: 'PAGAMENTO AUTORIZZATO (3D-SECURE V2)',
        details: {
          protocol: 'PCI-DSS Compliant Tokenization',
          authorization_code: authCode,
          masked_card: '**** **** **** 4242',
          card_brand: 'Mastercard / Visa',
          timestamp
        },
        receiptMessage: `Transazione ${amountStr} autorizzata con protocollo sicuro PCI-DSS (Cod. Auth: ${authCode}).`
      };
    }

    case 'paypal': {
      const payId = `PAYID-BRACE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      return {
        success: true,
        method: 'PayPal Express Checkout',
        transactionId: payId,
        statusText: 'CONFERMATO PAYPAL',
        details: {
          paypal_account: customerData.email || 'cliente@paypal.fake',
          payer_status: 'VERIFIED',
          timestamp
        },
        receiptMessage: `Pagamento ${amountStr} elaborato con successo tramite PayPal (ID Transazione: ${payId}).`
      };
    }

    case 'satispay': {
      const satisChargeId = `SATIS_CHARGE_${Math.floor(1000000 + Math.random() * 9000000)}`;
      return {
        success: true,
        method: 'Satispay Smart Payment',
        transactionId: satisChargeId,
        statusText: 'AUTORIZZATO SATISPAY',
        details: {
          satispay_id: `SATIS_USER_${customerData.phone.replace(/[^0-9]/g, '')}`,
          cashback_applicable: '1% Cashback Bottega Braciami ancora',
          timestamp
        },
        receiptMessage: `Addebito ${amountStr} confermato istantaneamente su Satispay (ID: ${satisChargeId}).`
      };
    }

    case 'contanti':
    default: {
      const receiptNum = `SCONTRINO_FISC_${Math.floor(1000 + Math.random() * 9000)}`;
      return {
        success: true,
        method: 'Pagamento al Ritiro in Bottega',
        transactionId: receiptNum,
        statusText: 'DA SALDARE AL BANCO',
        details: {
          pickup_address: 'Via Penzale, 25 · 44042 Cento FE',
          desk: 'Cassa Saltafila Brace',
          timestamp
        },
        receiptMessage: `Prenotazione registrata per ${amountStr}. Pagamento in contanti o POS al ritiro in via Penzale 25.`
      };
    }
  }
}
