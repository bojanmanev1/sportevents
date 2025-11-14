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
    { name: 'All', icon: 'emoji_events' },
    { name: 'Animal Sports', icon: 'pets' },
    { name: 'Athletics', icon: 'directions_run' },
    { name: 'Badminton', icon: 'sports_tennis' },
    { name: 'Basketball', icon: 'sports_basketball' },
    { name: 'Billiard', icon: 'sports' },
    { name: 'Board Sports', icon: 'surfing' },
    { name: 'Bowling', icon: 'sports' },
    { name: 'Climbing', icon: 'terrain' },
    { name: 'Combat Sports', icon: 'sports_mma' },
    { name: 'Cycling', icon: 'directions_bike' },
    { name: 'ESports', icon: 'sports_esports' },
    { name: 'Football', icon: 'sports_soccer' },
    { name: 'Golf', icon: 'sports_golf' },
    { name: 'Gymnastics', icon: 'self_improvement' },
    { name: 'Handball', icon: 'sports_handball' },
    { name: 'Hiking', icon: 'hiking' },
    { name: 'Ice Sports', icon: 'ac_unit' },
    { name: 'Padel', icon: 'sports_tennis' },
    { name: 'Parasports', icon: 'accessible' },
    { name: 'Racing', icon: 'sports_motorsports' },
    { name: 'Rugby', icon: 'sports_rugby' },
    { name: 'Tennis', icon: 'sports_tennis' },
    { name: 'Teqball', icon: 'sports' },
    { name: 'Volleyball', icon: 'sports_volleyball' },
    { name: 'Water Sports', icon: 'pool' },
    { name: 'Weapons', icon: 'sports_kabaddi' },
  ];

selectedSports: string[] = ['All'];

  selectSport(sport: string) {
    if (sport === 'All') {
      // If "All" clicked → reset selection to only "All"
      this.selectedSports = ['All'];
      return;
    }

    // Remove "All" if another sport is selected
    this.selectedSports = this.selectedSports.filter(s => s !== 'All');

    // Toggle individual sport
    if (this.selectedSports.includes(sport)) {
      this.selectedSports = this.selectedSports.filter(s => s !== sport);
    } else {
      this.selectedSports.push(sport);
    }

    // If nothing is selected, revert back to "All"
    if (this.selectedSports.length === 0) {
      this.selectedSports = ['All'];
    }
  }

  isSelected(sport: string): boolean {
    return this.selectedSports.includes(sport);
  }
}
