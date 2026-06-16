import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { unwrapData } from '../../core/utils/api.utils';
import { ApiResponse } from '../../core/models/api.model';

export interface ChannelHealth {
  channel: string; status: string;
  throughput: number; errorRate: number; avgLatencyMs: number; providerCount: number;
  providers?: { name: string; status: string; isEnabled: boolean }[];
}

@Injectable({ providedIn: 'root' })
export class ChannelsService {
  private http = inject(HttpClient);
  getHealth() {
    return this.http.get<ApiResponse<ChannelHealth[]>>(
      `${environment.apiUrl}/api/v1/notification-engine/channels/health`
    ).pipe(unwrapData());
  }
}
