import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'nep-idm',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './idm.component.html',
  styleUrl: './idm.component.scss',
})
export class IdmComponent {}
