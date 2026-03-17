import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogContent, MatDialogActions, FormsModule, MatFormFieldModule,TranslateModule,  MatInputModule, MatButtonModule],
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent {
  name = '';
  phone = '';


  constructor(
    private firestore: Firestore,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<RegisterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

async submit() {
  if (!this.name || !this.phone) return;

  const registrationsCol = collection(this.firestore, 'registrations');

  await addDoc(registrationsCol, {
    tournamentName: this.data.tournament.name,
    sport: this.data.tournament.sport,
    discipline: this.data.tournament.discipline,
    userName: this.name,
    phone: this.phone,
    createdAt: new Date().toISOString()
  });

  this.dialogRef.close(true);

  this.snackBar.open(
    'Thank you! We will contact you shortly.',
    'OK',
    {
      horizontalPosition: 'center',
      verticalPosition: 'top'
    }
  );
}


  close() {
    this.dialogRef.close(false);
  }
}
