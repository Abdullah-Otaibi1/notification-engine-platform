import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { unwrapData } from '../../core/utils/api.utils';
import { ApiResponse } from '../../core/models/api.model';

export interface Provider {
  id: string; name: string; channel: string; isEnabled: boolean;
  throughput: number; successRate: number; failureRate: number; avgLatencyMs: number; status: string;
}

@Injectable({ providedIn: 'root' })
export class ProvidersService {
  private http = inject(HttpClient);
  getAll() {
    return this.http.get<ApiResponse<Provider[]>>(
      `${environment.apiUrl}/api/v1/notification-engine/providers`
    ).pipe(unwrapData());
  }
}
