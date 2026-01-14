import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TournamentDetailsDialogComponent } from '../tournament-details-dialog/tournament-details-dialog';
import { TournamentService, Tournament } from '../../services/tournament.service';
import { GeocodingService } from '../../services/geocoding.service';
import { AfterViewInit,ElementRef } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter,provideNativeDateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'mk-MK' },
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit {
@ViewChild(MatCalendar) calendar!: MatCalendar<Date>;
  constructor(
    private dialog: MatDialog,
    private tournamentService: TournamentService,
    private geocoding: GeocodingService,
    private elRef: ElementRef<HTMLElement>,
  ) {}
  status: 'idle' | 'loading' | 'not-found' | 'no-coords' | 'ok' = 'idle';
  tooltipPos = { x: 0, y: 0 };
  loading = false;
  searched = false;
private calendarBodyEl: HTMLElement | null = null;
private onMouseOver?: (ev: Event) => void;
private onMouseLeave?: () => void;
  location = '';

  // ✅ keep all tournaments from Firestore
  allTournaments: Tournament[] = [];
 selectedDate: Date | null = null;
  // ✅ show results here (starts empty)
  nearby: Tournament[] = [];

    private byDay = new Map<string, Tournament[]>();

  hoverInfo: { date: Date; names: string[] } | null = null;

 ngOnInit(): void {
    this.tournamentService.getAll().subscribe(list => {
      this.allTournaments = list;


     

      // rebuild map
      this.byDay.clear();
      for (const t of list) {
        const d = this.toDate((t as any).startDate);
        if (!d) continue;

        const key = this.dayKey(d);
        const arr = this.byDay.get(key) ?? [];
        arr.push(t);
        this.byDay.set(key, arr);
      }

      // re-bind hover listeners when data changes
      queueMicrotask(() => {
  this.calendar?.updateTodaysDate(); // ✅ forces rerender so dateClass applies
  this.bindCalendarHover();
});
    });
  }

  
dateClass: MatCalendarCellClassFunction<Date> = (date) => {
  if (!date) return '';

  const key = this.dayKey(date);
  return this.byDay.has(key) ? 'has-tournament' : '';
};

  ngAfterViewInit(): void {
    this.bindCalendarHover();

   this.calendar.stateChanges.subscribe(() => {
    queueMicrotask(() => this.bindCalendarHover());
  });
  }

 
onSelect(d: Date | null) {
  this.selectedDate = d;

  if (!d) {
    this.hoverInfo = null;
    return;
  }

  const key = this.dayKey(d);
  const list = this.byDay.get(key) ?? [];

  this.hoverInfo = list.length
    ? { date: d, names: list.map(x => x.name) }
    : { date: d, names: ['No tournaments'] };
}

private bindCalendarHover() {
  const host = this.elRef.nativeElement;
  const wrap = host.querySelector('.calendar-wrap') as HTMLElement | null;
  const body = host.querySelector('.mat-calendar-body') as HTMLElement | null;
  if (!wrap || !body) return;

  // ✅ if body changed, detach old listeners
  if (this.calendarBodyEl && this.calendarBodyEl !== body) {
    if (this.onMouseOver) this.calendarBodyEl.removeEventListener('mouseover', this.onMouseOver);
    if (this.onMouseLeave) this.calendarBodyEl.removeEventListener('mouseleave', this.onMouseLeave);
  }

  // ✅ if same body and already bound, skip
  if (this.calendarBodyEl === body && this.onMouseOver) return;

  this.calendarBodyEl = body;

  // ✅ stable handler using data-mat-date (not aria-label)
  this.onMouseOver = (ev: Event) => {
    const cell = (ev.target as HTMLElement).closest('.mat-calendar-body-cell') as HTMLElement | null;
    if (!cell) return;

    const dateStr = cell.getAttribute('data-mat-date'); // e.g. "2026-01-14"
    if (!dateStr) {
      this.hoverInfo = null;
      return;
    }

    // parse yyyy-mm-dd
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);

    const key = this.dayKey(date);
    const list = this.byDay.get(key);
    if (!list?.length) {
      this.hoverInfo = null;
      return;
    }

    this.hoverInfo = { date, names: list.map(x => x.name) };

    // position tooltip near the cell
    const cellRect = cell.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    this.tooltipPos.x = (cellRect.right - wrapRect.left) + 8;
    this.tooltipPos.y = (cellRect.top - wrapRect.top) - 6;
  };

  this.onMouseLeave = () => {
    this.hoverInfo = null;
  };

  body.addEventListener('mouseover', this.onMouseOver);
  body.addEventListener('mouseleave', this.onMouseLeave);
}



  private dayKey(d: Date): string {
    // yyyy-mm-dd
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private toDate(v: any): Date | null {
    if (!v) return null;
    if (v instanceof Date) return v;
    if (typeof v?.toDate === 'function') return v.toDate(); // Firestore Timestamp
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }

onSearch() {
  this.nearby = [];

  const query = this.location.trim();
  if (!query) return;

  this.status = 'loading';

  this.geocoding.geocode(query).subscribe({
    next: center => {
      if (!center) {
        this.status = 'not-found';
        this.nearby = [];
        return;
      }

      const candidates = this.allTournaments.filter(
        t => typeof t.latitude === 'number' && typeof t.longitude === 'number'
      );

      if (candidates.length === 0) {
        this.status = 'no-coords';
        this.nearby = [];
        return;
      }

      const withCoords = candidates
        .map(t => ({
          t,
          d: this.haversineKm(
            center.lat,
            center.lon,
            t.latitude as number,
            t.longitude as number
          ),
        }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 3)
        .map(x => x.t);

      this.nearby = withCoords;
      this.status = 'ok';
    },
    error: _err => {
      this.status = 'not-found';
      this.nearby = [];
    }
  });
}



  private haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  private deg2rad(v: number): number {
    return v * (Math.PI / 180);
  }

  openTournamentDialog(t: Tournament) {
    this.dialog.open(TournamentDetailsDialogComponent, {
      width: '500px',
      maxHeight: '90vh',
      data: t
    });
  }
}
