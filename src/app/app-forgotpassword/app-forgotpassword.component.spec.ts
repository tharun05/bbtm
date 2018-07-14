import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppForgotpasswordComponent } from './app-forgotpassword.component';

describe('AppForgotpasswordComponent', () => {
  let component: AppForgotpasswordComponent;
  let fixture: ComponentFixture<AppForgotpasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppForgotpasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppForgotpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
