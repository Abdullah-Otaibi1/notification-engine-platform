import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { unwrapData } from '../../core/utils/api.utils';
import { ApiResponse } from '../../core/models/api.model';

export interface Template {
  id: string; templateCode: string; notificationCode: string; eventCode: string;
  channel: string; language: string; isEnabled: boolean; retryCount: number;
  subject: string | null; bodyTemplate: string; createdAt: string;
}
export interface PaginatedTemplates { items: Template[]; total: number; page: number; pageSize: number; totalPages: number; }

@Injectable({ providedIn: 'root' })
export class TemplatesService {
  private http = inject(HttpClient);
  getAll(filter: { channel?: string; page?: number; pageSize?: number } = {}) {
    let params = new HttpParams();
    Object.entries(filter).forEach(([k, v]) => { if (v !== undefined && v !== '') params = params.set(k, String(v)); });
    return this.http.get<ApiResponse<PaginatedTemplates>>(
      `${environment.apiUrl}/api/v1/notification-engine/templates`, { params }
    ).pipe(unwrapData());
  }
}
