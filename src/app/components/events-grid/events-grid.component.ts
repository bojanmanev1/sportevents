import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface EventItem {
  name: string;
  sport: string;
  registration: 'Open' | 'Closed';
  startDate: string;
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
   constructor(private router: Router) {}
  searchText = '';
  displayedColumns = ['name', 'sport', 'registration', 'startDate', 'location'];

  events: EventItem[] = [
    {
      name: 'Skopje Summer Cup',
      sport: 'Football',
      registration: 'Open',
      startDate: '2025-11-02',
      location: 'Skopje',
    },
    {
      name: 'Bitola Basketball Fest',
      sport: 'Basketball',
      registration: 'Closed',
      startDate: '2025-10-25',
      location: 'Bitola',
    },
    {
      name: 'Ohrid Tennis Masters',
      sport: 'Tennis',
      registration: 'Open',
      startDate: '2025-11-10',
      location: 'Ohrid',
    },
    {
      name: '3x3 Street Challenge',
      sport: '3x3',
      registration: 'Open',
      startDate: '2025-10-29',
      location: 'Tetovo',
    },
  ];

  get filteredEvents() {
    return this.events.filter(e =>
      e.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

    openDetails(eventId: number) {
    this.router.navigate(['/tournament', eventId]);
  }
}
