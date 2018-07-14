import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPaymentMethodsComponent } from './app-payment-methods.component';

describe('AppPaymentMethodsComponent', () => {
  let component: AppPaymentMethodsComponent;
  let fixture: ComponentFixture<AppPaymentMethodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPaymentMethodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPaymentMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
