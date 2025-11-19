import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';

@Component({
  selector: 'app-tournament-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatCardModule],
  templateUrl: './tournament-details-dialog.html',
  styleUrls: ['./tournament-details-dialog.scss']
})
export class TournamentDetailsDialogComponent {

  tournament: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TournamentDetailsDialogComponent>,
    private dialog: MatDialog
  ) {
    this.tournament = data; 
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
