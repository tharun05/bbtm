import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSlotsComponent } from './app-slots.component';

describe('AppSlotsComponent', () => {
  let component: AppSlotsComponent;
  let fixture: ComponentFixture<AppSlotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSlotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
