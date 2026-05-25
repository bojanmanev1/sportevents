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
  {
    name: 'all',
    iconType: 'material',
    icon: 'emoji_events'
  },
  {
    name: 'animalsports',
    iconType: 'material',
    icon: 'pets'
  },
  {
    name: 'athletics',
    iconType: 'material',
    icon: 'directions_run'
  },
  {
    name: 'badminton',
    iconType: 'material',
    icon: 'sports_tennis'
  },
  {
    name: 'basketball',
    iconType: 'material',
    icon: 'sports_basketball'
  },
  {
    name: 'billiard',
    iconType: 'material',
    icon: 'sports'
  },
  {
    name: 'boardsports',
    iconType: 'fa',
    icon: 'fa-solid fa-person-snowboarding'
  },
  {
    name: 'bowling',
    iconType: 'fa',
    icon: 'fa-solid fa-bowling-ball'
  },
  {
    name: 'combatsports',
    iconType: 'material',
    icon: 'sports_mma'
  },
  {
    name: 'cycling',
    iconType: 'material',
    icon: 'directions_bike'
  },
  {
    name: 'esports',
    iconType: 'material',
    icon: 'sports_esports'
  },
  {
    name: 'football',
    iconType: 'material',
    icon: 'sports_soccer'
  },
  {
    name: 'gymnastics',
    iconType: 'material',
    icon: 'self_improvement'
  },
  {
    name: 'handball',
    iconType: 'material',
    icon: 'sports_handball'
  },
  {
    name: 'icesports',
    iconType: 'material',
    icon: 'ac_unit'
  },
  {
    name: 'mountainsports',
    iconType: 'material',
    icon: 'terrain'
  },
  {
    name: 'padel',
    iconType: 'fa',
    icon: 'fa-solid fa-table-tennis-paddle-ball'
  },
  {
    name: 'parasports',
    iconType: 'material',
    icon: 'accessible'
  },
  {
    name: 'pingpong',
    iconType: 'fa',
    icon: 'fa-solid fa-table-tennis-paddle-ball'
  },
  {
    name: 'racing',
    iconType: 'material',
    icon: 'sports_motorsports'
  },
  {
    name: 'rugby',
    iconType: 'material',
    icon: 'sports_rugby'
  },
  {
    name: 'tennis',
    iconType: 'material',
    icon: 'sports_tennis'
  },
  {
    name: 'teqball',
    iconType: 'material',
    icon: 'sports'
  },
  {
    name: 'triathlon',
    iconType: 'material',
    icon: 'directions_run'
  },
  {
    name: 'volleyball',
    iconType: 'material',
    icon: 'sports_volleyball'
  },
  {
    name: 'watersports',
    iconType: 'material',
    icon: 'pool'
  },
  {
    name: 'weapons',
    iconType: 'material',
    icon: 'sports_kabaddi'
  }
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
