import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent {
  upcomingEvents = [
    { name: 'Summer Cup 2025', location: 'Skopje', date: 'Jul 15' },
    { name: 'StreetBall 3x3', location: 'Bitola', date: 'Aug 2' },
    { name: 'Winter League', location: 'Ohrid', date: 'Dec 10' },
    { name: 'Tennis Open', location: 'Kumanovo', date: 'Nov 5' },
  ];
}
