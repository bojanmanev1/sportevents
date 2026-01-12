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
    MatProgressSpinnerModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private tournamentService: TournamentService,
    private geocoding: GeocodingService
  ) {}
  status: 'idle' | 'loading' | 'not-found' | 'no-coords' | 'ok' = 'idle';

  loading = false;
  searched = false;

  location = '';

  // ✅ keep all tournaments from Firestore
  allTournaments: Tournament[] = [];

  // ✅ show results here (starts empty)
  nearby: Tournament[] = [];

  ngOnInit(): void {
    this.tournamentService.getAll().subscribe(list => {
      this.allTournaments = list;
    });
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
