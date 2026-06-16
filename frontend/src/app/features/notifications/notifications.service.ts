import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { unwrapData } from '../../core/utils/api.utils';
import { ApiResponse } from '../../core/models/api.model';
import { NotificationFilter, PaginatedNotifications, NotificationDetail } from '../../core/models/notification.model';

const BASE = `${environment.apiUrl}/api/v1/notification-engine/notifications`;

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private http = inject(HttpClient);

  search(filter: NotificationFilter) {
    let params = new HttpParams();
    Object.entries(filter).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v)); });
    return this.http.get<ApiResponse<PaginatedNotifications>>(BASE, { params }).pipe(unwrapData());
  }

  getOne(id: string) {
    return this.http.get<ApiResponse<NotificationDetail>>(`${BASE}/${id}`).pipe(unwrapData());
  }
}
