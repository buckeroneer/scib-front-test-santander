import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  tooltipText = 'Return to Home';

  constructor(private readonly router: Router) {}

  navigateHome() {
    this.router.navigate(['/']);
  }
}
