import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChannelsService, ChannelHealth } from './channels.service';

@Component({
  selector: 'nep-channels',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatChipsModule, MatTooltipModule],
  templateUrl: './channels.component.html',
  styleUrl: './channels.component.scss',
})
export class ChannelsComponent implements OnInit {
  private svc = inject(ChannelsService);
  loading = true; error = ''; channels: ChannelHealth[] = [];

  channelIcon: Record<string, string> = { SMS: 'sms', EMAIL: 'email', PUSH: 'notifications_active' };

  ngOnInit() {
    this.svc.getHealth().subscribe({
      next:  (data) => { this.channels = data; this.loading = false; },
      error: (err)  => { this.error = err?.error?.error?.message ?? 'Failed to load channel health'; this.loading = false; },
    });
  }
}
