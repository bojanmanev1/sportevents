import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
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
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  provideNativeDateAdapter
} from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';

export const MK_DATE_FORMATS = {
  parse: {
    dateInput: { day: '2-digit', month: '2-digit', year: 'numeric' } as any,
  },
  display: {
    dateInput: { day: '2-digit', month: '2-digit', year: 'numeric' } as any,
    monthYearLabel: { month: 'short', year: 'numeric' } as any,
    dateA11yLabel: { day: '2-digit', month: '2-digit', year: 'numeric' } as any,
    monthYearA11yLabel: { month: 'long', year: 'numeric' } as any,
  },
};


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
    providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'mk-MK' },
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MK_DATE_FORMATS }
  ],
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
    TranslateModule
  ],
  templateUrl: './tournament-self-registration-dialog.html',
  styleUrls: ['./tournament-self-registration-dialog.scss'],
})
export class TournamentSelfRegistrationDialog {
  
  sending = false;

  sports: string[] = [
  'Animal Sports',
  'Athletics',
  'Badminton',
  'Basketball',
  'Billiard',
  'Board Sports',
  'Bowling',
  'Combat Sports',
  'Cycling',
  'ESports',
  'Football',
  'Golf',
  'Gymnastics',
  'Handball',
  'Ice Sports',
  'Mountain Sports',
  'Padel',
  'Parasports',
  'Ping Pong',
  'Racing',
  'Rugby',
  'Tennis',
  'Teqball',
  'Volleyball',
  'Water Sports',
  'Weapons'
];
  model: SelfRegistrationModel = {
    name: '',
    sport: '',
    discipline: '',
    startDate: null as Date | null,
    location: '',
    registration: '',
    fee: null,
    website: '',
    description: '',
  };

  constructor(
    private dialogRef: MatDialogRef<TournamentSelfRegistrationDialog>,
    private snackBar: MatSnackBar,
    private dateAdapter: DateAdapter<Date>,
    private firestore: Firestore

  ) {
    this.dateAdapter.setLocale('mk-MK');
  }

  close(): void {
    this.dialogRef.close();
  }

  isValid(): boolean {
    return !!(
      this.model.name?.trim() &&
      this.model.sport &&
      this.model.startDate &&
      this.model.location?.trim() &&
      this.model.registration
    );
  }

async send(): Promise<void> {
  if (!this.isValid()) return;

  try {
    this.sending = true;

    const ref = collection(this.firestore, 'selfregistrations');

    const payload = {
      name: this.model.name.trim(),
      sport: this.model.sport,
      discipline: (this.model.discipline ?? '').trim(),
      startDate: this.model.startDate,              // Date -> Firestore Timestamp automatically
      location: this.model.location.trim(),
      registration: this.model.registration,
      fee: this.model.fee ?? null,
      website: (this.model.website ?? '').trim(),
      description: (this.model.description ?? '').trim(),

      status: 'pending',                            // ✅ important for admin
      createdAt: serverTimestamp(),                 // ✅ created time
      source: 'public',                             // optional
    };

    await addDoc(ref, payload);

    this.dialogRef.close(true);

    this.snackBar.open(
      "Thanks! We’ll contact you after reviewing your registration.",
      'OK',
      { duration: 5000 }
    );
  } catch (err) {
    console.error(err);
    this.snackBar.open('Failed to submit. Please try again.', 'OK', { duration: 5000 });
  } finally {
    this.sending = false;
  }
}

}
