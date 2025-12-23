import { Component, EventEmitter, Output, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sports-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './sports-menu.component.html',
  styleUrls: ['./sports-menu.component.scss'],
})
export class SportsMenuComponent implements OnInit {
  @Output() sportFilterChanged = new EventEmitter<string[]>();

  sports = [
    { name: 'All', icon: 'emoji_events' },
    { name: 'Animal Sports', icon: 'pets' },
    { name: 'Athletics', icon: 'directions_run' },
    { name: 'Badminton', icon: 'sports_tennis' },
    { name: 'Basketball', icon: 'sports_basketball' },
    { name: 'Billiard', icon: 'sports' },
    { name: 'Board Sports', icon: 'surfing' },
    { name: 'Bowling', icon: 'sports' },
    { name: 'Combat Sports', icon: 'sports_mma' },
    { name: 'Cycling', icon: 'directions_bike' },
    { name: 'ESports', icon: 'sports_esports' },
    { name: 'Football', icon: 'sports_soccer' },
    { name: 'Golf', icon: 'sports_golf' },
    { name: 'Gymnastics', icon: 'self_improvement' },
    { name: 'Handball', icon: 'sports_handball' },
    { name: 'Ice Sports', icon: 'ac_unit' },
    { name: 'Mountain Sports', icon: 'terrain' },
    { name: 'Padel', icon: 'sports_tennis' },
    { name: 'Parasports', icon: 'accessible' },
    { name: 'Ping Pong', icon: 'sports_tennis' },
    { name: 'Racing', icon: 'sports_motorsports' },
    { name: 'Rugby', icon: 'sports_rugby' },
    { name: 'Tennis', icon: 'sports_tennis' },
    { name: 'Teqball', icon: 'sports' },
    { name: 'Volleyball', icon: 'sports_volleyball' },
    { name: 'Water Sports', icon: 'pool' },
    { name: 'Weapons', icon: 'sports_kabaddi' },
  ];

  selectedSports: string[] = ['All'];

  /** Mobile logic */
  isMobile = false;
  showAllMobile = false;
  mobileLimit = 8;

  ngOnInit() {
    this.checkViewport();
  }

  @HostListener('window:resize')
  checkViewport() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.showAllMobile = true; // desktop always shows all
    }
  }

  get visibleSports() {
    if (!this.isMobile) return this.sports;
    return this.showAllMobile
      ? this.sports
      : this.sports.slice(0, this.mobileLimit);
  }

  selectSport(sport: string) {
    if (sport === 'All') {
      this.selectedSports = ['All'];
      this.sportFilterChanged.emit(this.selectedSports);
      return;
    }

    this.selectedSports = this.selectedSports.filter(s => s !== 'All');

    if (this.selectedSports.includes(sport)) {
      this.selectedSports = this.selectedSports.filter(s => s !== sport);
    } else {
      this.selectedSports.push(sport);
    }

    if (this.selectedSports.length === 0) {
      this.selectedSports = ['All'];
    }

    this.sportFilterChanged.emit(this.selectedSports);
  }

  isSelected(sport: string): boolean {
    return this.selectedSports.includes(sport);
  }
}
