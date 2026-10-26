import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getAdminDashboardMetrics } from '../src/utils/adminDashboard';
import { Order, Product } from '../src/types';

const products = [
  { id: 'a', stockQuantity: 3, supplierInfo: { supplierId: 'one' } },
  { id: 'b', stockQuantity: 0, supplierInfo: { supplierId: 'one' } },
  { id: 'c', stockQuantity: 2, supplierInfo: { supplierId: 'two' } }
] as Product[];
function order(status: Order['status'], date: string, total: number, paymentStatus: Order['paymentStatus'] = 'pagato'): Order {
  return { status, date, total, paymentStatus, items: [{ product: products[0] }, { product: products[0] }] } as Order;
}
test('dashboard deduplicates articles and suppliers and separates order statuses', () => {
  const result = getAdminDashboardMetrics(products, [order('ricevuto', '2026-10-01', 10), order('in_griglia', '2026-10-01', 20), order('completato', '2026-10-01', 30), order('annullato', '2026-10-01', 100)]);
  assert.equal(result.catalog, 3);
  assert.equal(result.warehouse, 2);
  assert.equal(result.ordered, 1);
  assert.equal(result.suppliers, 2);
  assert.equal(result.received, 1);
  assert.equal(result.processing, 1);
  assert.equal(result.fulfilled, 1);
});
test('paid totals use Rome calendar periods and exclude unpaid and cancelled orders', () => {
  const result = getAdminDashboardMetrics(products, [
    order('completato', '2026-09-30T22:30:00Z', 10),
    order('completato', '2026-01-01', 20),
    order('completato', '2025-01-01', 30),
    order('annullato', '2026-10-01', 100),
    order('ricevuto', '2026-10-01', 200, 'in_attesa_al_ritiro')
  ], new Date('2026-10-26T12:00:00Z'));
  assert.equal(result.paidMonth, 10);
  assert.equal(result.paidYear, 30);
  assert.equal(result.paidHistory, 60);
});
test('missing stock is unknown rather than zero', () => {
  assert.equal(getAdminDashboardMetrics([{ id: 'unknown' }] as Product[], []).warehouse, null);
});
