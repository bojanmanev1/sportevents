import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { TournamentDetailsDialogComponent } from '../tournament-details-dialog/tournament-details-dialog';
import { MatDialog } from '@angular/material/dialog';

interface EventItem {
  name: string;
  sport: string;
  discipline: string;
  registration: 'Open' | 'Closed';
  location: string;
}

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
  ],
  templateUrl: './events-grid.component.html',
  styleUrls: ['./events-grid.component.scss'],
})
export class EventsGridComponent {
  constructor(private dialog: MatDialog) {}

  searchText = '';
  displayedColumns = ['name', 'sport', 'discipline', 'location', 'registration'];

  events: EventItem[] = [
    {
      name: 'Skopje Summer Cup',
      sport: 'Football',
      discipline: '5v5',
      registration: 'Open',
      location: 'Skopje',
    },
    {
      name: 'Bitola Basketball Fest',
      sport: 'Basketball',
      discipline: 'Streetball',
      registration: 'Closed',
      location: 'Bitola',
    },
    {
      name: 'Ohrid Tennis Masters',
      sport: 'Tennis',
      discipline: 'Singles',
      registration: 'Open',
      location: 'Ohrid',
    },
    {
      name: '3x3 Street Challenge',
      sport: 'Basketball',
      discipline: '3x3',
      registration: 'Open',
      location: 'Tetovo',
    },
  ];

  get filteredEvents() {
    return this.events.filter(e =>
      e.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

   openTournamentDialog(tournament: any) {
    this.dialog.open(TournamentDetailsDialogComponent, {
      width: '500px',
      data: tournament
    });
  }
}
