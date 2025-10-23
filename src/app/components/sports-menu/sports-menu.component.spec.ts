import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportsMenuComponent } from './sports-menu.component';

describe('SportsMenuComponent', () => {
  let component: SportsMenuComponent;
  let fixture: ComponentFixture<SportsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportsMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
