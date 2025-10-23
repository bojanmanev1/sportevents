import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sports-menu',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule, MatIconModule,FormsModule],
  templateUrl: './sports-menu.component.html',
  styleUrls: ['./sports-menu.component.scss'],
})
export class SportsMenuComponent {
  sports = [
    { name: 'Football', icon: 'sports_soccer' },
    { name: 'Basketball', icon: 'sports_basketball' },
    { name: 'Tennis', icon: 'sports_tennis' },
    { name: 'Volleyball', icon: 'sports_volleyball' },
    { name: '3x3', icon: 'sports' },
    { name: 'Running', icon: 'directions_run' },
  ];

  selectedSport = 'Football';

  selectSport(sport: string) {
    this.selectedSport = sport;
    // later you can emit an event or filter events here
  }
}
