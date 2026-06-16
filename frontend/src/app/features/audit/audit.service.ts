import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { unwrapData } from '../../core/utils/api.utils';
import { ApiResponse } from '../../core/models/api.model';

export interface AuditLog {
  id: string; username: string; role: string; action: string; resource: string;
  resourceId: string | null; beforeState: unknown; afterState: unknown;
  reason: string | null; ipAddress: string | null; createdAt: string;
}
export interface PaginatedAudit { items: AuditLog[]; total: number; page: number; pageSize: number; totalPages: number; }

@Injectable({ providedIn: 'root' })
export class AuditService {
  private http = inject(HttpClient);
  getAll(filter: { resource?: string; username?: string; action?: string; page?: number; pageSize?: number } = {}) {
    let params = new HttpParams();
    Object.entries(filter).forEach(([k, v]) => { if (v !== undefined && v !== '') params = params.set(k, String(v)); });
    return this.http.get<ApiResponse<PaginatedAudit>>(
      `${environment.apiUrl}/api/v1/notification-engine/audit`, { params }
    ).pipe(unwrapData());
  }
}
