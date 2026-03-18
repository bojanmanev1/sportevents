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
import { TranslateModule } from '@ngx-translate/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { TournamentDetailsDialogComponent } from '../tournament-details-dialog/tournament-details-dialog';
import { TournamentService, Tournament } from '../../services/tournament.service';
import { GeocodingService } from '../../services/geocoding.service';

type FcEvent = {
  title: string;
  start: Date;
  allDay: true;
  extendedProps: { tournament: Tournament };
};

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
    FullCalendarModule,
    TranslateModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private tournamentService: TournamentService,
    private geocoding: GeocodingService,
  ) {}

  status: 'idle' | 'loading' | 'not-found' | 'no-coords' | 'no-nearby' | 'ok' = 'idle';
  loading = false;

  location = '';
  allTournaments: Tournament[] = [];
  nearby: Tournament[] = [];

  private readonly maxRadiusKm = 50;

  calendarOptions: any = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    height: 'auto',
    firstDay: 1,
    headerToolbar: { left: 'prev,next', center: 'title', right: '' },

    events: [] as FcEvent[],

    eventMouseEnter: (info: any) => {
      info.el.title = info.event.title;
    },

    eventClick: (info: any) => {
      const t = info.event.extendedProps?.tournament as Tournament | undefined;
      if (!t) return;

      this.dialog.open(TournamentDetailsDialogComponent, {
        width: '500px',
        maxHeight: '90vh',
        data: t,
      });
    },
  };

  ngOnInit(): void {
    this.tournamentService.getAll().subscribe(list => {
      this.allTournaments = list;

      const events: FcEvent[] = list
        .map(t => {
          const d = this.toDate((t as any).startDate);
          if (!d) return null;

          return {
            title: t.name,
            start: d,
            allDay: true,
            extendedProps: { tournament: t },
          } as FcEvent;
        })
        .filter(Boolean) as FcEvent[];

      this.calendarOptions = {
        ...this.calendarOptions,
        events,
      };
    });
  }

  onSearch() {
    this.nearby = [];

    const query = this.location.trim();
    if (!query) return;

    this.status = 'loading';
    this.loading = true;

    this.geocoding.geocode(query).subscribe({
      next: center => {
        if (!center) {
          this.status = 'not-found';
          this.nearby = [];
          this.loading = false;
          return;
        }

        const candidates = this.allTournaments.filter(
          t =>
            typeof (t as any).latitude === 'number' &&
            typeof (t as any).longitude === 'number'
        );

        if (candidates.length === 0) {
          this.status = 'no-coords';
          this.nearby = [];
          this.loading = false;
          return;
        }

        const withCoords = candidates
          .map(t => ({
            t,
            d: this.haversineKm(
              center.lat,
              center.lon,
              (t as any).latitude as number,
              (t as any).longitude as number
            ),
          }))
          .filter(x => x.d <= this.maxRadiusKm)
          .sort((a, b) => a.d - b.d)
          .slice(0, 3)
          .map(x => x.t);

        if (withCoords.length === 0) {
          this.status = 'no-nearby';
          this.nearby = [];
          this.loading = false;
          return;
        }

        this.nearby = withCoords;
        this.status = 'ok';
        this.loading = false;
      },
      error: () => {
        this.status = 'not-found';
        this.nearby = [];
        this.loading = false;
      },
    });
  }

  private toDate(v: any): Date | null {
    if (!v) return null;
    if (v instanceof Date) return v;
    if (typeof v?.toDate === 'function') return v.toDate();
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }

  private haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

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