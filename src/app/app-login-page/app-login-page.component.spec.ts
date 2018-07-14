import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLoginPageComponent } from './app-login-page.component';

describe('AppLoginPageComponent', () => {
  let component: AppLoginPageComponent;
  let fixture: ComponentFixture<AppLoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppLoginPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
