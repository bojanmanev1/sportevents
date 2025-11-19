import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { TournamentDetailsDialogComponent } from '../tournament-details-dialog/tournament-details-dialog';
import { MatDialog } from '@angular/material/dialog';
import { TournamentService, Tournament } from '../../services/tournament.service';
import { Observable } from 'rxjs';

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
  constructor(private dialog: MatDialog, private svc: TournamentService) {}
 @Input() selectedSports: string[] = ['All'];
 
  searchText = '';
  displayedColumns = ['name', 'sport', 'discipline', 'location', 'registration'];

  events: Tournament[] = [];

  ngOnInit() {
    this.svc.list().subscribe(tournaments => {
      this.events = tournaments;
    });
  }

get filteredEvents() {
  let list = this.events;

  if (!this.selectedSports.includes('All')) {
    list = list.filter(e => this.selectedSports.includes(e.sport));
  }

  return list.filter(e =>
    e.name.toLowerCase().includes(this.searchText.toLowerCase())
  );
}

onSportsChanged(sports: string[]) {
  this.selectedSports = sports;
}

  openTournamentDialog(tournament: any) {
    this.dialog.open(TournamentDetailsDialogComponent, {
      width: '500px',
      data: tournament
    });
  }
}
