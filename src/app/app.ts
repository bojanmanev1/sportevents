import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocomplete } from '@angular/material/autocomplete';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,MatSlideToggleModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('sportevents');
}
