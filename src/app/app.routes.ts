import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { TournamentDetailsComponent } from './components/tournament-details/tournament-details.component';

export const routes: Routes = [
  { path: '', component: Home },
   { path: 'tournament/:id', component: TournamentDetailsComponent },
  { path: '**', redirectTo: '' },
];
