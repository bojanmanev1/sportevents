import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

type SelfRegistrationModel = {
  name: string;
  sport: string;
  discipline?: string;
  startDate: Date | null;
  location: string;
  registration: 'Open' | 'Closed' | 'Not open yet' | '';
  fee?: number | null;
  website?: string;
  description?: string;
};

@Component({
  selector: 'app-tournament-self-registration-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './tournament-self-registration-dialog.html',
  styleUrls: ['./tournament-self-registration-dialog.scss'],
})
export class TournamentSelfRegistrationDialog {
  sending = false;

  sports: string[] = ['Football', 'Basketball', 'Volleyball', 'Tennis', 'Handball'];

  model: SelfRegistrationModel = {
    name: '',
    sport: '',
    discipline: '',
    startDate: null,
    location: '',
    registration: '',
    fee: null,
    website: '',
    description: '',
  };

  constructor(
    private dialogRef: MatDialogRef<TournamentSelfRegistrationDialog>,
    private snackBar: MatSnackBar
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  // isValid(): boolean {
  //   return !!(
  //     this.model.name?.trim() &&
  //     this.model.sport &&
  //     this.model.startDate &&
  //     this.model.location?.trim() &&
  //     this.model.registration
  //   );
  // }

  async send(): Promise<void> {
    debugger
    // if (!this.isValid()) return;

    try {
      this.sending = true;

      // ✅ Step 2: Firestore addDoc(...) will go here
      await new Promise((r) => setTimeout(r, 400));

      this.dialogRef.close(true);

      this.snackBar.open(
        "Thanks! We’ll contact you after reviewing your registration.",
        'OK',
        { duration: 5000 }
      );
    } finally {
      this.sending = false;
    }
  }
}
