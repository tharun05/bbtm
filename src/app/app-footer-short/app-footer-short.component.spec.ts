import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFooterShortComponent } from './app-footer-short.component';

describe('AppFooterShortComponent', () => {
  let component: AppFooterShortComponent;
  let fixture: ComponentFixture<AppFooterShortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppFooterShortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFooterShortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
