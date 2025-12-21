import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TournamentService, Tournament } from '../../services/tournament.service';
import { MatDialog } from '@angular/material/dialog';
import { TournamentDetailsDialogComponent } from '../tournament-details-dialog/tournament-details-dialog';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {

  upcomingEvents: Tournament[] = [];

  constructor(private tournamentService: TournamentService,
    private dialog: MatDialog) {}

 ngOnInit() {
  this.tournamentService.getTopMenu().subscribe(events => {
    this.upcomingEvents = events;
  });
}
  openTournament(event: Tournament) {
    this.dialog.open(TournamentDetailsDialogComponent, {
      width: '500px',
      maxHeight: '90vh', 
      data: event
    });
  }
}
