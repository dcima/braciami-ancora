import { Order, Product } from '../types';

export function getAdminDashboardMetrics(products: Product[], orders: Order[], now = new Date()) {
  const openOrders = orders.filter((order) => !['annullato', 'completato'].includes(order.status));
  const orderedProducts = new Set(openOrders.flatMap((order) => order.items.map((item) => item.product.id)));
  const suppliers = new Set(products.map((product) => product.supplierInfo?.supplierId).filter(Boolean));
  const paid = orders.filter((order) => order.paymentStatus === 'pagato' && order.status !== 'annullato');
  const period = (date: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit' }).format(date);
  const currentPeriod = period(now);
  const year = now.toLocaleDateString('en-CA', { timeZone: 'Europe/Rome', year: 'numeric' });
  const sum = (items: Order[]) => items.reduce((total, order) => total + order.total, 0);
  return {
    catalog: products.length,
    warehouse: products.every((product) => typeof product.stockQuantity === 'number') ? products.filter((product) => product.stockQuantity! > 0).length : null,
    ordered: orderedProducts.size,
    received: orders.filter((order) => order.status === 'ricevuto').length,
    processing: orders.filter((order) => ['in_griglia', 'pronto', 'in_consegna'].includes(order.status)).length,
    fulfilled: orders.filter((order) => order.status === 'completato').length,
    suppliers: suppliers.size,
    paidMonth: sum(paid.filter((order) => !isNaN(Date.parse(order.date)) && period(new Date(order.date)) === currentPeriod)),
    paidYear: sum(paid.filter((order) => !isNaN(Date.parse(order.date)) && new Date(order.date).toLocaleDateString('en-CA', { timeZone: 'Europe/Rome', year: 'numeric' }) === year)),
    paidHistory: sum(paid)
  };
}
