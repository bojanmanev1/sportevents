import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tournament-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './tournament-details.component.html',
  styleUrls: ['./tournament-details.component.scss']
})
export class TournamentDetailsComponent implements OnInit {
  tournament: any;

  constructor(private route: ActivatedRoute,  private location: Location) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // For now we just use dummy data:
    this.tournament = {
      id,
      name: 'National 3x3 Street Basketball Cup',
      sport: 'Basketball',
      startDate: '2025-11-12',
      registrationStatus: 'Open',
      prize: '€1,000 + Trophy',
      location: 'Skopje, Macedonia',
      description:
        'Join the best street basketball teams in the country for an exciting weekend event. Teams from across the region will compete in knockout format. Music, food, and entertainment on site!'
    };
  }

   goBack() {
    this.location.back();
  }
}
