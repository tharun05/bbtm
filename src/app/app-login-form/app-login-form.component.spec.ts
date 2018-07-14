import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLoginFormComponent } from './app-login-form.component';

describe('AppLoginFormComponent', () => {
  let component: AppLoginFormComponent;
  let fixture: ComponentFixture<AppLoginFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppLoginFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
