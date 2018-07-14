import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFooterSvgComponent } from './app-footer-svg.component';

describe('AppFooterSvgComponent', () => {
  let component: AppFooterSvgComponent;
  let fixture: ComponentFixture<AppFooterSvgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppFooterSvgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFooterSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
