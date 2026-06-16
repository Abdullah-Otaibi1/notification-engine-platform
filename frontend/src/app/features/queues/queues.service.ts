import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { unwrapData } from '../../core/utils/api.utils';
import { ApiResponse } from '../../core/models/api.model';

export interface Queue {
  id: string; name: string; channel: string | null;
  capacity: number; currentDepth: number; drainRate: number;
  oldestMessageMs: number; status: string;
}

@Injectable({ providedIn: 'root' })
export class QueuesService {
  private http = inject(HttpClient);
  getAll() {
    return this.http.get<ApiResponse<Queue[]>>(
      `${environment.apiUrl}/api/v1/notification-engine/queues`
    ).pipe(unwrapData());
  }
}
