import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';

@Component({
  selector: 'app-tournament-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule,MatCardModule],
  templateUrl: './tournament-details-dialog.html',
  styleUrls: ['./tournament-details-dialog.scss']
})
export class TournamentDetailsDialogComponent {
    tournament: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TournamentDetailsDialogComponent>,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // For now we just use dummy data:
    this.tournament = {
      id,
      name: 'National 3x3 Street Basketball Cup',
      sport: 'Basketball',
      startDate: '2025-11-12',
      registrationStatus: 'Open',
      prize: '€1,000 + Trophy',
      location: 'Skopje, Macedonia',
      description:
        'Join the best street basketball teams in the country for an exciting weekend event. Teams from across the region will compete in knockout format. Music, food, and entertainment on site!'
    };
  }
    openRegisterDialog() {
    this.dialog.open(RegisterDialogComponent, {
      data: { tournament: this.tournament },
      width: '400px',
      panelClass: 'custom-dialog-container'
    });
  }
  close() {
    this.dialogRef.close();
  }
}
