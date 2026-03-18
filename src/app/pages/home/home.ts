import { Component } from '@angular/core';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { EventsGridComponent } from '../../components/events-grid/events-grid.component';
import { SportsMenuComponent } from '../../components/sports-menu/sports-menu.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopBarComponent,SportsMenuComponent,EventsGridComponent, SidebarComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home {

 selectedSports: string[] = ['all'];  // <-- required for grid input

  onSportsChanged(sports: string[]) {  // <-- required for menu output
    this.selectedSports = sports;
  }

}
