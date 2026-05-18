import { Component, EventEmitter, Output, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { I18nService } from '../../services/i18n.service';
@Component({
  selector: 'app-sports-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule,TranslateModule],
  templateUrl: './sports-menu.component.html',
  styleUrls: ['./sports-menu.component.scss'],
})
export class SportsMenuComponent implements OnInit {
  @Output() sportFilterChanged = new EventEmitter<string[]>();

sports = [
  { name: 'all', icon: 'emoji_events' },
  { name: 'animalsports', icon: 'pets' },
  { name: 'athletics', icon: 'directions_run' },
  { name: 'badminton', icon: 'sports_tennis' },
  { name: 'basketball', icon: 'sports_basketball' },
  { name: 'billiard', icon: 'sports' },
  { name: 'boardsports', icon: 'surfing' },
  { name: 'bowling', icon: 'sports' },
  { name: 'combatsports', icon: 'sports_mma' },
  { name: 'cycling', icon: 'directions_bike' },
  { name: 'esports', icon: 'sports_esports' },
  { name: 'football', icon: 'sports_soccer' },
  { name: 'gymnastics', icon: 'self_improvement' },
  { name: 'handball', icon: 'sports_handball' },
  { name: 'icesports', icon: 'ac_unit' },
  { name: 'mountainsports', icon: 'terrain' },
  { name: 'padel', icon: 'sports_tennis' },
  { name: 'parasports', icon: 'accessible' },
  { name: 'pingpong', icon: 'sports_tennis' },
  { name: 'racing', icon: 'sports_motorsports' },
  { name: 'rugby', icon: 'sports_rugby' },
  { name: 'tennis', icon: 'sports_tennis' },
  { name: 'teqball', icon: 'sports' },
  { name: 'triathlon', icon: 'directions_run' },
  { name: 'volleyball', icon: 'sports_volleyball' },
  { name: 'watersports', icon: 'pool' },
  { name: 'weapons', icon: 'sports_kabaddi' },
];

  selectedSports: string[] = ['all'];

  /** Mobile logic */
  isMobile = false;
  showAllMobile = false;
  mobileLimit = 8;

   constructor(
    public i18n: I18nService // ✅ inject
  ) {}

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
  if (sport === 'all') {
    this.selectedSports = ['all'];
    this.sportFilterChanged.emit(this.selectedSports);
    return;
  }

  this.selectedSports = this.selectedSports.filter(s => s !== 'all');

  if (this.selectedSports.includes(sport)) {
    this.selectedSports = this.selectedSports.filter(s => s !== sport);
  } else {
    this.selectedSports.push(sport);
  }

  if (this.selectedSports.length === 0) {
    this.selectedSports = ['all'];
  }

  this.sportFilterChanged.emit(this.selectedSports);
}

 isSelected(sport: string): boolean {
  return this.selectedSports.includes(sport);
}
}
