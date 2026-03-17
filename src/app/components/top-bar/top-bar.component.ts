import { TournamentSelfRegistrationDialog } from './../tournament-self-registration-dialog/tournament-self-registration-dialog';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TournamentService, Tournament } from '../../services/tournament.service';
import { MatDialog } from '@angular/material/dialog';
import { TournamentDetailsDialogComponent } from '../tournament-details-dialog/tournament-details-dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    TranslateModule // ✅ needed for | translate pipe
  ],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {
  upcomingEvents: Tournament[] = [];

  constructor(
    private tournamentService: TournamentService,
    private dialog: MatDialog,
    public i18n: I18nService // ✅ inject
  ) {}

  ngOnInit() {
    this.tournamentService.getTopMenu().subscribe(events => {
      this.upcomingEvents = events;
    });
  }

  get currentLang() {
    return this.i18n.current;
  }

  toggleLang() {
    this.i18n.toggle();
  }

  openTournament(event: Tournament) {
    this.dialog.open(TournamentDetailsDialogComponent, {
      width: '500px',
      maxHeight: '90vh',
      data: event
    });
  }

  openSelfRegistrationDialog(): void {
    this.dialog.open(TournamentSelfRegistrationDialog, {
      width: '560px',
      maxWidth: '95vw',
      disableClose: false,
      hasBackdrop: true,
      panelClass: 'turniri-dialog'
    });
  }
}
