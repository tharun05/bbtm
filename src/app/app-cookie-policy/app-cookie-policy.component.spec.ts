import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCookiePolicyComponent } from './app-cookie-policy.component';

describe('AppCookiePolicyComponent', () => {
  let component: AppCookiePolicyComponent;
  let fixture: ComponentFixture<AppCookiePolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCookiePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCookiePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
