import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent {
  formData = {
    name: '',
    surname: '',
    phone: ''
  };

  constructor(
    public dialogRef: MatDialogRef<RegisterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  submitForm() {
    if (!this.formData.name || !this.formData.surname || !this.formData.phone) {
      alert('Please fill in all fields');
      return;
    }

    // Option 1: Send via backend API (recommended)
    // this.http.post('/api/send-mail', this.formData).subscribe(...)

    // Option 2: Temporary mailto link (simple fallback)
    const subject = encodeURIComponent(`Tournament Registration: ${this.data.tournament.name}`);
    const body = encodeURIComponent(
      `Name: ${this.formData.name}\nSurname: ${this.formData.surname}\nPhone: ${this.formData.phone}`
    );
    window.location.href = `mailto:youremail@example.com?subject=${subject}&body=${body}`;

    this.dialogRef.close(this.formData);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
