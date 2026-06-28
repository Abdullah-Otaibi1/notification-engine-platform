import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgApexchartsModule } from 'ng-apexcharts';
import { interval, Subscription, forkJoin } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { DashboardService, DashboardSummary, ChartData } from './dashboard.service';
import { PageHeaderComponent, LoadingStateComponent, StatCardComponent } from '../../shared';

@Component({
  selector: 'nep-dashboard',
  standalone: true,
  imports: [
    CommonModule, DatePipe,
    MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule,
    NgApexchartsModule,
    PageHeaderComponent, LoadingStateComponent, StatCardComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private svc = inject(DashboardService);

  loading  = true;
  error    = '';
  summary: DashboardSummary | null = null;
  charts:  ChartData  | null = null;

  private sub?: Subscription;

  kpiCards = [
    { key: 'total',       label: 'Total Notifications', icon: 'inbox',            color: '#0d9488' },
    { key: 'success',     label: 'Delivered',           icon: 'check_circle',     color: '#059669' },
    { key: 'failure',     label: 'Failed',              icon: 'cancel',           color: '#e11d48' },
    { key: 'pending',     label: 'Pending',             icon: 'hourglass_empty',  color: '#d97706' },
    { key: 'inFlight',    label: 'In-Flight',           icon: 'send',             color: '#0891b2' },
    { key: 'successRate', label: 'Success Rate',        icon: 'trending_up',      color: '#059669', suffix: '%' },
    { key: 'failureRate', label: 'Failure Rate',        icon: 'trending_down',    color: '#e11d48', suffix: '%' },
    { key: 'queueDepth',  label: 'Queue Depth',         icon: 'queue',            color: '#7c3aed' },
  ];

  // ApexCharts options
  trendOptions: any     = null;
  donutOptions: any     = null;
  channelOptions: any   = null;
  providerOptions: any  = null;

  ngOnInit() {
    this.error = '';
    this.sub = interval(30_000).pipe(startWith(0), switchMap(() =>
      forkJoin({ summary: this.svc.getSummary(), charts: this.svc.getCharts() })
    )).subscribe({
      next: ({ summary, charts }) => {
        this.summary = summary;
        this.charts  = charts;
        this.error   = '';
        this.loading = false;
        this.buildCharts(charts);
      },
      error: (err) => {
        this.summary = null;
        this.charts  = null;
        this.error   = err?.error?.error?.message ?? 'Failed to load dashboard data';
        this.loading = false;
      },
    });
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }

  getValue(key: string): number {
    return (this.summary as any)?.[key] ?? 0;
  }

  private buildCharts(data: ChartData) {
    const isDark = document.body.classList.contains('dark-theme');
    const tc  = isDark ? '#94a3b8' : '#64748b';
    const gc  = isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9';
    const bg  = 'transparent';
    const tip = isDark ? 'dark' : 'light';

    const base = (height = 230) => ({
      height, toolbar: { show: false }, background: bg,
      fontFamily: '"DM Sans", "Roboto", sans-serif',
      animations: { enabled: true, speed: 500 },
    });

    // Trend
    this.trendOptions = {
      series: [
        { name: 'Success', data: data.trend.map(t => t.success) },
        { name: 'Failure', data: data.trend.map(t => t.failure) },
        { name: 'Total',   data: data.trend.map(t => t.total)   },
      ],
      chart:  { ...base(220), type: 'area' },
      colors: ['#059669', '#e11d48', '#0d9488'],
      fill:   { type: 'gradient', gradient: { opacityFrom: 0.3, opacityTo: 0.02, stops: [0, 90] } },
      stroke: { curve: 'smooth', width: 2 },
      markers: { size: 3, strokeWidth: 0 },
      xaxis:  { categories: data.trend.map(t => t.date.slice(5)), labels: { style: { colors: tc, fontSize: '11px' } }, axisBorder: { show: false } },
      yaxis:  { labels: { style: { colors: tc, fontSize: '11px' } } },
      grid:   { borderColor: gc, strokeDashArray: 4 },
      legend: { labels: { colors: tc }, fontSize: '12px', markers: { size: 6, shape: 'circle' } },
      tooltip: { theme: tip },
    };

    // Donut
    const sv = data.successVsFailure;
    this.donutOptions = {
      series:  [sv.success, sv.failure, sv.other],
      chart:   { ...base(220), type: 'donut' },
      labels:  ['Success', 'Failure', 'Other'],
      colors:  ['#059669', '#e11d48', '#94a3b8'],
      legend:  { position: 'bottom', labels: { colors: tc }, fontSize: '12px' },
      tooltip: { theme: tip },
      dataLabels: { enabled: true, style: { fontSize: '12px', colors: ['#fff'] }, dropShadow: { enabled: false } },
      plotOptions: { pie: { donut: { size: '62%', labels: { show: true, total: { show: true, label: 'Total', color: tc, fontSize: '12px' } } } } },
    };

    // Channel bar
    this.channelOptions = {
      series:  [{ name: 'Notifications', data: data.channelDistribution.map(c => c.count) }],
      chart:   { ...base(220), type: 'bar' },
      colors:  ['#0d9488'],
      xaxis:   { categories: data.channelDistribution.map(c => c.channel), labels: { style: { colors: tc, fontSize: '12px' } }, axisBorder: { show: false } },
      yaxis:   { labels: { style: { colors: tc, fontSize: '11px' } } },
      grid:    { borderColor: gc, strokeDashArray: 4, yaxis: { lines: { show: true } }, xaxis: { lines: { show: false } } },
      tooltip: { theme: tip },
      plotOptions: { bar: { borderRadius: 6, columnWidth: '45%', distributed: true } },
      dataLabels: { enabled: false },
      legend: { show: false },
    };

    // Provider success rate
    this.providerOptions = {
      series:  [{ name: 'Success Rate', data: data.providerDistribution.map(p => +p.successRate.toFixed(1)) }],
      chart:   { ...base(220), type: 'bar' },
      colors:  ['#0d9488'],
      xaxis:   { categories: data.providerDistribution.map(p => p.name), labels: { style: { colors: tc, fontSize: '11px' }, rotate: -20, trim: false } },
      yaxis:   { min: 80, max: 100, labels: { style: { colors: tc, fontSize: '11px' }, formatter: (v: number) => v + '%' } },
      grid:    { borderColor: gc, strokeDashArray: 4 },
      tooltip: { theme: tip, y: { formatter: (v: number) => v + '%' } },
      plotOptions: { bar: { borderRadius: 4, columnWidth: '52%' } },
      dataLabels: { enabled: true, style: { fontSize: '11px', colors: ['#fff'] }, formatter: (v: number) => v + '%' },
    };
  }

  refresh() { this.sub?.unsubscribe(); this.loading = true; this.ngOnInit(); }
}
