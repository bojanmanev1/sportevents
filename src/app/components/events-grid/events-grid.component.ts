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
    this.svc.getAll().subscribe(tournaments => {
      this.allTournaments = tournaments;
      this.dataSource.data = tournaments;
      this.applyFilters();
    });
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
        return this.i18n.key(item.registration ?? '');
      }

      return ((item as any)[property] ?? '').toString().toLowerCase();
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedSports']) {
      this.applyFilters();
    }
  }

  applyFilters() {
    let list = [...this.allTournaments];
    const selected = this.selectedSports?.length ? this.selectedSports : ['all'];

    // 1. Sport filter from top menu
    if (!selected.includes('all')) {
      list = list.filter(e => {
        const sportKey = this.i18n.key(e.sport);
        return selected.includes(sportKey);
      });
    }

    // 2. Search filter
    const text = this.searchText.toLowerCase().trim();
    if (text) {
      list = list.filter(e => {
        const startDateText = e.startDate
          ? e.startDate.toLocaleDateString('mk-MK')
          : '';

        return (
          (
            (e.name ?? '') + ' ' +
            (e.sport ?? '') + ' ' +
            (e.discipline ?? '') + ' ' +
            (e.location ?? '') + ' ' +
            (e.registration ?? '') + ' ' +
            startDateText
          )
            .toLowerCase()
            .includes(text)
        );
      });
    }

    // 3. Location filter
    const location = this.locationFilter.toLowerCase().trim();
    if (location) {
      list = list.filter(e =>
        (e.location ?? '').toLowerCase().includes(location)
      );
    }

    // 4. Discipline filter
    const discipline = this.disciplineFilter.toLowerCase().trim();
    if (discipline) {
      list = list.filter(e =>
        (e.discipline ?? '').toLowerCase().includes(discipline)
      );
    }

    // 5. Registration filter
    if (this.registrationFilter !== 'all') {
      list = list.filter(e =>
        this.i18n.key(e.registration ?? '') === this.registrationFilter
      );
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