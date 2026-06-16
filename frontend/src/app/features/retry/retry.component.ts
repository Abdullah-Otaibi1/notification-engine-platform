import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'nep-retry',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './retry.component.html',
  styleUrl: './retry.component.scss',
})
export class RetryComponent {}
