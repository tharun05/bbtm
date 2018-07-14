import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCashierComponent } from './app-cashier.component';

describe('AppCashierComponent', () => {
  let component: AppCashierComponent;
  let fixture: ComponentFixture<AppCashierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCashierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCashierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
