import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogContent, MatDialogActions, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent {
  name = '';
  surname = '';
  phone = '';


  constructor(
    private firestore: Firestore,
    public dialogRef: MatDialogRef<RegisterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

   async submit() {
    if (!this.name || !this.surname || !this.phone) return;

    const registrationsCol = collection(this.firestore, 'registrations');

    await addDoc(registrationsCol, {
      tournamentName: this.data.tournament.name,
      sport: this.data.tournament.sport,
      discipline: this.data.tournament.discipline,
      userName: this.name,
      userSurname: this.surname,
      phone: this.phone,
      createdAt: new Date().toISOString()
    });

    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close(false);
  }
}
