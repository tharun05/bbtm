import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppChangePasswordComponent } from './app-change-password.component';

describe('AppChangePasswordComponent', () => {
  let component: AppChangePasswordComponent;
  let fixture: ComponentFixture<AppChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
