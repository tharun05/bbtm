import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRegistrationFormComponent } from './app-registration-form.component';

describe('AppRegistrationFormComponent', () => {
  let component: AppRegistrationFormComponent;
  let fixture: ComponentFixture<AppRegistrationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppRegistrationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
