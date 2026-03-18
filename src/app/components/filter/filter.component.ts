import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { provideNativeDateAdapter } from '@angular/material/core';

export interface GridFiltersDialogData {
  locationFilter: string;
  disciplineFilter: string;
  registrationFilter: string;
  dateFrom: Date | null;
  dateTo: Date | null;
}

@Component({
  selector: 'app-events-grid-filters-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  template: `
    <h2 style="color:white" mat-dialog-title>{{ 'filters' | translate }}</h2>

    <mat-dialog-content class="dialog-content">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ 'location' | translate }}</mat-label>
        <input matInput [(ngModel)]="model.locationFilter" />
        <mat-icon style="color: white;" matSuffix>place</mat-icon>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ 'discipline' | translate }}</mat-label>
        <input matInput [(ngModel)]="model.disciplineFilter" />
        <mat-icon style="color: white;" matSuffix>sports</mat-icon>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ 'registration' | translate }}</mat-label>
        <mat-select [(ngModel)]="model.registrationFilter">
          <mat-option value="all">{{ 'all' | translate }}</mat-option>
          <mat-option value="open">{{ 'open' | translate }}</mat-option>
          <mat-option value="closed">{{ 'closed' | translate }}</mat-option>
          <mat-option value="notopenyet">{{ 'notopenyet' | translate }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width" style="color: white;">
        <mat-label>{{ 'datefrom' | translate }}</mat-label>
        <input matInput [matDatepicker]="pickerFrom" [(ngModel)]="model.dateFrom" />
        <mat-datepicker-toggle matIconSuffix [for]="pickerFrom"></mat-datepicker-toggle>
        <mat-datepicker #pickerFrom></mat-datepicker>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ 'dateto' | translate }}</mat-label>
        <input matInput [matDatepicker]="pickerTo" [(ngModel)]="model.dateTo" />
        <mat-datepicker-toggle matIconSuffix [for]="pickerTo"></mat-datepicker-toggle>
        <mat-datepicker #pickerTo></mat-datepicker>
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-stroked-button type="button" (click)="clear()">
        {{ 'clearfilters' | translate }}
      </button>

      <button mat-button type="button" (click)="close()">
        {{ 'back' | translate }}
      </button>

      <button mat-flat-button color="primary" type="button" (click)="apply()">
        {{ 'apply' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 320px;
      padding-top: 8px;
    }

    .full-width {
      width: 100%;
    }
  `]
})
export class EventsGridFiltersDialogComponent {
  model: GridFiltersDialogData;

  constructor(
    private dialogRef: MatDialogRef<EventsGridFiltersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: GridFiltersDialogData
  ) {
    this.model = { ...data };
  }

  clear() {
    this.model = {
      locationFilter: '',
      disciplineFilter: '',
      registrationFilter: 'all',
      dateFrom: null,
      dateTo: null
    };
  }

  close() {
    this.dialogRef.close();
  }

  apply() {
    this.dialogRef.close(this.model);
  }
}