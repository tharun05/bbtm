import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDepositLimitComponent } from './app-deposit-limit.component';

describe('AppDepositLimitComponent', () => {
  let component: AppDepositLimitComponent;
  let fixture: ComponentFixture<AppDepositLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppDepositLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDepositLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
