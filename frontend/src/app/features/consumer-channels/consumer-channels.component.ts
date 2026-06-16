import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'nep-consumer-channels',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './consumer-channels.component.html',
  styleUrl: './consumer-channels.component.scss',
})
export class ConsumerChannelsComponent {}
