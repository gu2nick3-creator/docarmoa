import type { Category, Product, Order, OrderStatus } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE || '';

async function request<T>(path: string, init?: RequestInit & { token?: string }): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (init?.token) headers.Authorization = `Bearer ${init.token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Public
  getCategories: () => request<Category[]>('/api/categories'),
  getProducts: (params?: { search?: string; categoryId?: string; subcategoryId?: string; featured?: boolean; isNew?: boolean }) => {
    const usp = new URLSearchParams();
    if (params?.search) usp.set('search', params.search);
    if (params?.categoryId) usp.set('categoryId', params.categoryId);
    if (params?.subcategoryId) usp.set('subcategoryId', params.subcategoryId);
    if (params?.featured) usp.set('featured', 'true');
    if (params?.isNew) usp.set('isNew', 'true');
    const q = usp.toString();
    return request<Product[]>(`/api/products${q ? `?${q}` : ''}`);
  },
  getProduct: (id: string) => request<Product>(`/api/products/${id}`),

  // Checkout
  checkout: (body: { items: { productId: string; quantity: number; selectedSize: string; selectedColor: string }[]; buyer: any }) =>
    request<{ orderNumber: string; checkoutUrl: string }>(`/api/checkout`, { method: 'POST', body: JSON.stringify(body) }),

  // Admin auth
  adminLogin: (email: string, password: string) => request<{ token: string }>(`/api/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) }),
  adminMe: (token: string) => request<{ ok: boolean; user: { id: string; email: string } }>(`/api/admin/me`, { token }),

  // Admin categories
  adminGetCategories: (token: string) => request<Category[]>(`/api/admin/categories`, { token }),
  adminCreateCategory: (token: string, name: string) => request<Category>(`/api/admin/categories`, { method: 'POST', token, body: JSON.stringify({ name }) }),
  adminDeleteCategory: (token: string, id: string) => request<{ ok: boolean }>(`/api/admin/categories/${id}`, { method: 'DELETE', token }),
  adminCreateSubcategory: (token: string, categoryId: string, name: string) => request<{ id: string; name: string; categoryId: string }>(`/api/admin/categories/${categoryId}/subcategories`, { method: 'POST', token, body: JSON.stringify({ name }) }),
  adminDeleteSubcategory: (token: string, subId: string) => request<{ ok: boolean }>(`/api/admin/subcategories/${subId}`, { method: 'DELETE', token }),

  // Admin products
  adminGetProducts: (token: string) => request<Product[]>(`/api/admin/products`, { token }),
  adminCreateProduct: (token: string, product: Partial<Product>) => request<Product>(`/api/admin/products`, { method: 'POST', token, body: JSON.stringify(product) }),
  adminUpdateProduct: (token: string, id: string, product: Partial<Product>) => request<Product>(`/api/admin/products/${id}`, { method: 'PUT', token, body: JSON.stringify(product) }),
  adminDeleteProduct: (token: string, id: string) => request<{ ok: boolean }>(`/api/admin/products/${id}`, { method: 'DELETE', token }),

  // Admin upload
  adminUpload: async (token: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_BASE}/api/admin/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<{ url: string }>;
  },

  // Admin orders
  adminGetOrders: (token: string) => request<(Order & { dbId: string; paymentStatus: string })[]>(`/api/admin/orders`, { token }),
  adminUpdateOrderStatus: (token: string, orderId: string, status: OrderStatus) =>
    request<{ ok: boolean; status: string }>(`/api/admin/orders/${orderId}/status`, { method: 'PATCH', token, body: JSON.stringify({ status }) }),
};

