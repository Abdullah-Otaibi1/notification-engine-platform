import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'nep-workload',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './workload.component.html',
  styleUrl: './workload.component.scss',
})
export class WorkloadComponent {}
