import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentSelfRegistrationDialog } from './tournament-self-registration-dialog';

describe('TournamentSelfRegistrationDialog', () => {
  let component: TournamentSelfRegistrationDialog;
  let fixture: ComponentFixture<TournamentSelfRegistrationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournamentSelfRegistrationDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentSelfRegistrationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
