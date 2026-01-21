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
import { TournamentDetailsDialogComponent } from '../tournament-details-dialog/tournament-details-dialog';
import { TournamentService, Tournament } from '../../services/tournament.service';

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
    MatPaginatorModule
  ],
  templateUrl: './events-grid.component.html',
  styleUrls: ['./events-grid.component.scss'],
})
export class EventsGridComponent
  implements OnInit, AfterViewInit, OnChanges {
  allTournaments: Tournament[] = [];

  constructor(
    private dialog: MatDialog,
    private svc: TournamentService
  ) {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() selectedSports: string[] = ['All'];

  @ViewChild(MatSort) sort!: MatSort;

  searchText = '';
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
    this.allTournaments = tournaments;      // ✅ keep master copy
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
  return (item as any)[property] ?? '';
};
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedSports']) {
      this.applyFilters();
    }
  }

applyFilters() {
  let list = [...this.allTournaments]; // ✅ always start fresh

  // 1. Sport filter
  if (!this.selectedSports.includes('All')) {
    list = list.filter(e =>
      this.selectedSports.includes(e.sport)
    );
  }

  const text = this.searchText.toLowerCase().trim();
if (text) {
  list = list.filter(e => {
    const startDateText = e.startDate ? e.startDate.toLocaleDateString('mk-MK') : '';

    return (
      (
        (e.name ?? '') +
        (e.sport ?? '') +
        (e.discipline ?? '') +
        (e.location ?? '') +
        (e.registration ?? '') +
        startDateText
      )
        .toLowerCase()
        .includes(text)
    );
  });
}


  this.dataSource.data = list;
}


  openTournamentDialog(tournament: Tournament) {
    this.dialog.open(TournamentDetailsDialogComponent, {
      width: '500px',
      maxHeight: '90vh', 
      data: tournament
    });
  }
}
