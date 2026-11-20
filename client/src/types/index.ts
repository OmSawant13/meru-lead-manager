export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';

export type LeadSource =
  | 'Website'
  | 'Referral'
  | 'Cold Outreach'
  | 'LinkedIn'
  | 'Advertisement'
  | 'Event'
  | 'Other';

export interface Lead {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  source: LeadSource;
  status: LeadStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LeadStats {
  total: number;
  byStatus: {
    New: number;
    Contacted: number;
    Qualified: number;
    Lost: number;
  };
}

export interface LeadQueryParams {
  search?: string;
  status?: string;
  source?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'email' | 'company' | 'status' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}
