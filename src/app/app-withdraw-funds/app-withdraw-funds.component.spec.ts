import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppWithdrawFundsComponent } from './app-withdraw-funds.component';

describe('AppWithdrawFundsComponent', () => {
  let component: AppWithdrawFundsComponent;
  let fixture: ComponentFixture<AppWithdrawFundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppWithdrawFundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppWithdrawFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
