import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'nep-sla',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './sla.component.html',
  styleUrl: './sla.component.scss',
})
export class SlaComponent {}
