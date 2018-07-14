import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPaymentContainerFieldsComponent } from './app-payment-container-fields.component';

describe('AppPaymentContainerFieldsComponent', () => {
  let component: AppPaymentContainerFieldsComponent;
  let fixture: ComponentFixture<AppPaymentContainerFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPaymentContainerFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPaymentContainerFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
