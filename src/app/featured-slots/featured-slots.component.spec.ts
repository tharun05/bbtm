import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedSlotsComponent } from './featured-slots.component';

describe('FeaturedSlotsComponent', () => {
  let component: FeaturedSlotsComponent;
  let fixture: ComponentFixture<FeaturedSlotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedSlotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
