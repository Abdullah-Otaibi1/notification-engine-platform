import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { unwrapData } from '../../core/utils/api.utils';
import { ApiResponse } from '../../core/models/api.model';

const BASE = `${environment.apiUrl}/api/v1/notification-engine/dashboard`;

export interface DashboardSummary {
  total: number; success: number; failure: number;
  pending: number; inFlight: number;
  successRate: number; failureRate: number;
  queueDepth: number; lastUpdated: string;
}

export interface TrendPoint  { date: string; success: number; failure: number; total: number; }
export interface ChartData {
  trend: TrendPoint[];
  channelDistribution: { channel: string; count: number }[];
  providerDistribution: { name: string; successRate: number; channel: string }[];
  successVsFailure: { success: number; failure: number; other: number };
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  getSummary() {
    return this.http.get<ApiResponse<DashboardSummary>>(`${BASE}/summary`).pipe(unwrapData());
  }

  getCharts() {
    return this.http.get<ApiResponse<ChartData>>(`${BASE}/charts`).pipe(unwrapData());
  }
}
