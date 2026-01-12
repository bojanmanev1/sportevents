import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TournamentDetailsDialogComponent } from '../tournament-details-dialog/tournament-details-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatIconModule,
    MatButtonModule,
    MatListModule
    
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
   constructor(private dialog: MatDialog) {}
  location = '';
  distance = 50;

   tournaments = [
    
  ];

  onSearch() {
    console.log('Searching tournaments near:', this.location, 'within', this.distance, 'km');
  }

   openTournamentDialog(tournament: any) {
    this.dialog.open(TournamentDetailsDialogComponent, {
      width: '500px',
      data: tournament
    });
  }
}
