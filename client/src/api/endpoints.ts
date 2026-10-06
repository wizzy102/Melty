import { api } from './client';
import type {
  AdminOrderDetail,
  AdminOrdersList,
  CartLinePayload,
  CreateOrderPayload,
  DeliveryArea,
  Menu,
  OrderConfirmation,
  OrderStatus,
  Product,
  Quote,
} from './types';

// ---- Public

export const publicApi = {
  menu: () => api<Menu>('/menu'),
  deliveryAreas: () => api<{ areas: DeliveryArea[] }>('/delivery-areas').then((r) => r.areas),
  quote: (items: CartLinePayload[], areaId?: string) =>
    api<Quote>('/orders/quote', { method: 'POST', json: { items, areaId } }),
  createOrder: (payload: CreateOrderPayload) =>
    api<{ order: OrderConfirmation }>('/orders', { method: 'POST', json: payload }).then((r) => r.order),
};

// ---- Admin (cookie-authenticated; the server enforces access)

export const adminApi = {
  login: (username: string, password: string) =>
    api<{ admin: { username: string } }>('/admin/auth/login', { method: 'POST', json: { username, password } }),
  logout: () => api<{ ok: true }>('/admin/auth/logout', { method: 'POST', json: {} }),
  me: () => api<{ admin: { username: string } }>('/admin/auth/me'),

  orders: (status?: OrderStatus) =>
    api<AdminOrdersList>('/admin/orders' + (status ? `?status=${status}` : '')),
  order: (id: string) => api<{ order: AdminOrderDetail }>(`/admin/orders/${id}`).then((r) => r.order),
  setStatus: (id: string, status: OrderStatus) =>
    api<{ order: AdminOrderDetail }>(`/admin/orders/${id}/status`, { method: 'PATCH', json: { status } }).then(
      (r) => r.order,
    ),

  products: () => api<Menu>('/admin/products'),
  setAvailability: (id: string, available: boolean) =>
    api<{ product: Product }>(`/admin/products/${id}/availability`, { method: 'PATCH', json: { available } }).then(
      (r) => r.product,
    ),
};
