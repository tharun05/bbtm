import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppBetHistoryComponent } from './app-bet-history.component';

describe('AppBetHistoryComponent', () => {
  let component: AppBetHistoryComponent;
  let fixture: ComponentFixture<AppBetHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppBetHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppBetHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
