import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentDetailsDialog } from './tournament-details-dialog';

describe('TournamentDetailsDialog', () => {
  let component: TournamentDetailsDialog;
  let fixture: ComponentFixture<TournamentDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournamentDetailsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
