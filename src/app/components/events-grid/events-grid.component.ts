import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { EventsGridFiltersDialogComponent,GridFiltersDialogData  } from '../filter/filter.component';
import { TournamentDetailsDialogComponent } from '../tournament-details-dialog/tournament-details-dialog';
import { TournamentService, Tournament } from '../../services/tournament.service';
import { TranslateModule } from '@ngx-translate/core';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-events-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './events-grid.component.html',
  styleUrls: ['./events-grid.component.scss'],
})
export class EventsGridComponent implements OnInit, AfterViewInit, OnChanges {
  allTournaments: Tournament[] = [];
countdowns: Record<string, string> = {}; 
  private timerIntervalId: any;
  constructor(
    private dialog: MatDialog,
    private svc: TournamentService,
    public i18n: I18nService
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() selectedSports: string[] = ['all'];

  searchText = '';
  locationFilter = '';
  disciplineFilter = '';
  registrationFilter = 'all';
  dateFrom: Date | null = null;
  dateTo: Date | null = null;

  registrationOptions = ['all', 'open', 'closed', 'notopenyet'];

  displayedColumns = [
    'name',
    'sport',
    'discipline',
    'location',
    'registration',
    'startDate'
  ];

  dataSource = new MatTableDataSource<Tournament>([]);

ngOnInit() {
  this.svc.getUpcoming().subscribe(tournaments => {
    this.allTournaments = tournaments;
    this.dataSource.data = tournaments;

    // Set defaults safely before the view locks in the check pass
    if (this.sort) {
      this.sort.active = 'startDate';
      this.sort.direction = 'asc';
    }

    this.applyFilters();
    this.startLiveCountdownLoop();
  });
}

private startLiveCountdownLoop() {
  if (this.timerIntervalId) clearInterval(this.timerIntervalId);

  const updateTimers = () => {
    // --- UPDATED: Uses Macedonian Time instead of local device time ---
    const now = this.getMacedonianNowTime();
    const nextCountdowns: Record<string, string> = {}; 
    
    this.allTournaments.forEach(e => {
      if (!e.id || !e.registration) return;
      
      const regDate = e.registration instanceof Date ? e.registration : new Date(e.registration);
      const endOfDayDate = new Date(regDate);
      endOfDayDate.setHours(23, 59, 59, 999);
      
      const targetTime = endOfDayDate.getTime();
      const diff = targetTime - now;

      if (diff > 0 && diff <= 48 * 60 * 60 * 1000) {
        const totalSeconds = Math.floor(diff / 1000);
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        const pad = (num: number) => num.toString().padStart(2, '0');
        nextCountdowns[e.id] = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
      }
    });

    this.countdowns = nextCountdowns;
  };

  updateTimers(); 
  this.timerIntervalId = setInterval(updateTimers, 1000);
}
  

ngAfterViewInit() {
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;

  this.dataSource.sortingDataAccessor = (item, property) => {
    if (property === 'startDate') {
      return item.startDate?.getTime?.() ?? Number.MAX_SAFE_INTEGER;
    }
    if (property === 'sport') {
      return this.i18n.key(item.sport ?? '');
    }
    if (property === 'registration') {
      return this.getRegistrationData(item).key; 
    }
    return ((item as any)[property] ?? '').toString().toLowerCase();
  };

  // REMOVE the programmatic sort assignment and emission from here!
}

private getMacedonianNowTime(): number {
  const now = new Date();
  // Format the current global time into Macedonia's time zone explicitly
  const tzString = now.toLocaleString('en-US', { timeZone: 'Europe/Skopje' });
  return new Date(tzString).getTime();
}


// Add or replace this method in events-grid.component.ts
getRegistrationData(e: Tournament): { key: string; hours?: number } {
  const rawReg = e.registration;
  if (!rawReg) return { key: 'Not open yet' };

  let regDate: Date;
  if (typeof (rawReg as any).toDate === 'function') {
    regDate = (rawReg as any).toDate();
  } else {
    regDate = new Date(rawReg);
  }

  if (isNaN(regDate.getTime())) return { key: 'Not open yet' };

  const endOfDeadlineDay = new Date(regDate);
  endOfDeadlineDay.setHours(23, 59, 59, 999);

  // --- UPDATED: Calculates remaining hours using Macedonian Time ---
  const now = this.getMacedonianNowTime();
  const timeDifferenceMs = endOfDeadlineDay.getTime() - now;
  const hoursRemaining = Math.ceil(timeDifferenceMs / (1000 * 60 * 60));

  if (hoursRemaining <= 0) return { key: 'Closed' };
  if (hoursRemaining <= 48) return { key: 'OpenWithHours', hours: hoursRemaining };

  return { key: 'Open' };
}

 ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedSports']) {
      this.applyFilters();
    }
  }


  ngOnDestroy() {
    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
    }
  }

applyFilters() {
  let list = [...this.allTournaments];
  const selected = this.selectedSports?.length ? this.selectedSports : ['all'];

  const normalizeSearch = (value: string): string => {
    const map: Record<string, string> = {
      а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ѓ: 'g', е: 'e', ж: 'z', з: 'z',
      ѕ: 'dz', и: 'i', ј: 'j', к: 'k', л: 'l', љ: 'l', м: 'm', н: 'n', њ: 'n',
      о: 'o', п: 'p', р: 'r', с: 's', т: 't', ќ: 'k', у: 'u', ф: 'f', х: 'h',
      ц: 'c', ч: 'c', џ: 'dz', ш: 's'
    };

    return (value ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/kj/g, 'k')
      .replace(/gj/g, 'g')
      .replace(/ch/g, 'c')
      .replace(/sh/g, 's')
      .replace(/zh/g, 'z')
      .replace(/lj/g, 'l')
      .replace(/nj/g, 'n')
      .split('')
      .map(ch => map[ch] ?? ch)
      .join('')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // 1. Sport filter from top menu
  if (!selected.includes('all')) {
    list = list.filter(e => {
      const sportKey = this.i18n.key(e.sport);
      return selected.includes(sportKey);
    });
  }

  // 2. Search filter - works Latin <-> Cyrillic
  const text = normalizeSearch(this.searchText);

  if (text) {
    list = list.filter(e => {
      const startDateText = e.startDate
        ? e.startDate.toLocaleDateString('mk-MK')
        : '';

      // Get the calculated human-readable status string for indexing search queries
      const currentRegStatus = this.getRegistrationData(e);

      const searchable = normalizeSearch(
        (e.name ?? '') + ' ' +
        (e.sport ?? '') + ' ' +
        (e.discipline ?? '') + ' ' +
        (e.location ?? '') + ' ' +
        currentRegStatus + ' ' +
        this.i18n.key(e.sport ?? '') + ' ' +
        startDateText
      );

      return searchable.includes(text);
    });
  }

  // 3. Location filter
  const location = normalizeSearch(this.locationFilter);
  if (location) {
    list = list.filter(e =>
      normalizeSearch(e.location ?? '').includes(location)
    );
  }

  // 4. Discipline filter
  const discipline = normalizeSearch(this.disciplineFilter);
  if (discipline) {
    list = list.filter(e =>
      normalizeSearch(e.discipline ?? '').includes(discipline)
    );
  }

  // 5. Updated Registration Filter (Handles new dynamic string definitions)
  if (this.registrationFilter !== 'all') {
    list = list.filter(e => {
      const status = this.getRegistrationData(e).key.toLowerCase();
      
      if (this.registrationFilter === 'open') {
        // Matches standard "Open" and urgent states containing "remaining"
        return status.includes('open');
      }
      if (this.registrationFilter === 'closed') {
        return status === 'closed';
      }
      if (this.registrationFilter === 'notopenyet') {
        return status === 'not open yet';
      }
      return true;
    });
  }

  // 6. Date from
  if (this.dateFrom) {
    const from = this.startOfDay(this.dateFrom).getTime();
    list = list.filter(e => {
      if (!e.startDate) return false;
      return e.startDate.getTime() >= from;
    });
  }

  // 7. Date to
  if (this.dateTo) {
    const to = this.endOfDay(this.dateTo).getTime();
    list = list.filter(e => {
      if (!e.startDate) return false;
      return e.startDate.getTime() <= to;
    });
  }

  this.dataSource.data = list;

  if (this.paginator) {
    this.paginator.firstPage();
  }
}

  clearFilters() {
    this.searchText = '';
    this.locationFilter = '';
    this.disciplineFilter = '';
    this.registrationFilter = 'all';
    this.dateFrom = null;
    this.dateTo = null;
    this.applyFilters();
  }

  private startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  openTournamentDialog(tournament: Tournament) {
    this.dialog.open(TournamentDetailsDialogComponent, {
      width: '500px',
      maxHeight: '90vh',
      data: tournament
    });
  }

  openFiltersDialog() {
  const dialogRef = this.dialog.open(EventsGridFiltersDialogComponent, {
    width: '420px',
    maxWidth: '95vw',
    panelClass: 'dark-dialog',
    data: {
      locationFilter: this.locationFilter,
      disciplineFilter: this.disciplineFilter,
      registrationFilter: this.registrationFilter,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo
    } as GridFiltersDialogData
  });

  dialogRef.afterClosed().subscribe(result => {
    if (!result) return;

    this.locationFilter = result.locationFilter;
    this.disciplineFilter = result.disciplineFilter;
    this.registrationFilter = result.registrationFilter;
    this.dateFrom = result.dateFrom;
    this.dateTo = result.dateTo;

    this.applyFilters();
  });
}
}