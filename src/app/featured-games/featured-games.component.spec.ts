import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedGamesComponent } from './featured-games.component';

describe('FeaturedGamesComponent', () => {
  let component: FeaturedGamesComponent;
  let fixture: ComponentFixture<FeaturedGamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedGamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
