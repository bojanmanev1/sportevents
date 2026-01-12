import { Component, Inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import * as L from 'leaflet';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';

@Component({
  selector: 'app-tournament-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatCardModule],
  templateUrl: './tournament-details-dialog.html',
  styleUrls: ['./tournament-details-dialog.scss']
})
export class TournamentDetailsDialogComponent implements AfterViewInit {

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  tournament: any;
  map!: L.Map;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TournamentDetailsDialogComponent>,
    private dialog: MatDialog
  ) {
    this.tournament = data;

    const sd = this.tournament?.startDate as any;
if (sd?.toDate) {
  this.tournament.startDate = sd.toDate(); // Timestamp -> Date
}
  }

  ngAfterViewInit(): void {
    if (!this.tournament.latitude || !this.tournament.longitude) return;

    this.initMap();
  }

 initMap() {
  // 1. CUSTOM ICON
  const customIcon = L.icon({
    iconUrl: 'assets/map-marker.svg',
    iconSize: [25, 25],       // adjust size depending on your SVG
    iconAnchor: [19, 38],     // center bottom point
    popupAnchor: [0, -40]     // popup position
  });

  // 2. CREATE MAP
  this.map = L.map(this.mapContainer.nativeElement, {
    center: [this.tournament.latitude, this.tournament.longitude],
    zoom: 14,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(this.map);

  const googleMapsUrl = `https://www.google.com/maps?q=${this.tournament.latitude},${this.tournament.longitude}`;

L.marker(
  [this.tournament.latitude, this.tournament.longitude],
  { icon: customIcon }
)
  .addTo(this.map)
  .bindPopup(`
    <b>${this.tournament.location}</b><br>
    <a href="${googleMapsUrl}" target="_blank">Open in Google Maps</a>
  `)
  .openPopup();

  setTimeout(() => {
    this.map.invalidateSize();
  }, 300);
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
