// ─── API Base ────────────────────────────────────────────────────────────────

export const API_BASE = "http://localhost:8081";
export const AUTH_BASE = "http://localhost:8000";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ProductImage {
  id: number;
  url: string;
  sortOrder: number;
}

export interface ProductDto {
  id: number;
  categoryId: number;
  title: string;
  description: string;
  sellerId: number;
  price: number;
  status: string;
  images: ProductImage[];
}

export interface AuctionDto {
  id: number;
  product: ProductDto;
  startTime: string;
  endTime: string;
  startingPrice: number;
  minimumStep: number;
  currentPrice: number;
  highestBidderId: number | null;
  version: number;
  status: string;
  enableExtentTime: boolean;
  threshhold: number;
}

export interface BidDto {
  id: number;
  auctionId: number;
  bidderId: number;
  amount: number;
  createdAt: string;
}

export interface SearchAuctionDto {
  auctionId: number;
  product: ProductDto;
  currentPrice: number;
  status: string;
}

export interface CategoryDto {
  id: number;
  name: string;
}

// ─── Auth Helpers ─────────────────────────────────────────────────────────────

export interface UserInfo {
  id: number;
  email: string;
  fullName: string;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getUser(): UserInfo | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAuth(token: string, user: UserInfo) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<UserInfo> {
  const res = await fetch(`${AUTH_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    let msg = "Đăng nhập thất bại";
    try {
      const json = JSON.parse(text);
      msg = json.error ?? json.message ?? msg;
    } catch { /* keep default */ }
    throw new Error(msg);
  }

  const { token } = await res.json() as { token: string };

  // Fetch profile to get user info
  const profileRes = await fetch(`${AUTH_BASE}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  let info: UserInfo;
  if (profileRes.ok) {
    const profile = await profileRes.json() as { id: number; email: string; full_name: string };
    info = { id: profile.id, email: profile.email, fullName: profile.full_name };
  } else {
    // Fallback: decode userID from JWT payload
    const payload = JSON.parse(atob(token.split(".")[1]));
    info = { id: Number(payload.userID ?? payload.sub), email, fullName: email };
  }

  setAuth(token, info);
  return info;
}

export async function register(
  fullName: string,
  email: string,
  password: string
): Promise<UserInfo> {
  const res = await fetch(`${AUTH_BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ full_name: fullName, email, password, phone: "" }),
  });

  if (!res.ok) {
    const text = await res.text();
    let msg = "Đăng ký thất bại";
    try {
      const json = JSON.parse(text);
      msg = json.error ?? json.message ?? msg;
    } catch { /* keep default */ }
    throw new Error(msg);
  }

  // Login to get token after successful registration
  return login(email, password);
}

// ─── Request Helper ───────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  const json: ApiResponse<T> = await res.json();
  return json.data;
}

// ─── Auctions ────────────────────────────────────────────────────────────────

export async function listAuctions(): Promise<AuctionDto[]> {
  return request<AuctionDto[]>("/auctions");
}

export async function getAuction(id: number | string): Promise<AuctionDto> {
  return request<AuctionDto>(`/auctions/${id}`);
}

export async function searchAuctions(
  q = "",
  status = "OPEN",
  size = 40
): Promise<SearchAuctionDto[]> {
  return request<SearchAuctionDto[]>(
    `/search/auctions?q=${encodeURIComponent(q)}&status=${status}&size=${size}`
  );
}

// ─── Bids ─────────────────────────────────────────────────────────────────────

export async function listBids(auctionId: number | string): Promise<BidDto[]> {
  return request<BidDto[]>(`/auctions/${auctionId}/bids`);
}

export async function placeBid(
  auctionId: number | string,
  bidderId: number,
  amount: number,
  currentBudget: number,
  idempotencyKey?: string
): Promise<BidDto> {
  const headers: Record<string, string> = {};
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
  return request<BidDto>(`/auctions/${auctionId}/bids`, {
    method: "POST",
    body: JSON.stringify({ bidderId, amount, currentBudget }),
    headers,
  });
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function listCategories(): Promise<CategoryDto[]> {
  return request<CategoryDto[]>("/categories");
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProduct(id: number | string): Promise<ProductDto> {
  return request<ProductDto>(`/products/${id}`);
}
