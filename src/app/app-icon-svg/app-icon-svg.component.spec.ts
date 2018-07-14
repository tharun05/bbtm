import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppIconSvgComponent } from './app-icon-svg.component';

describe('AppIconSvgComponent', () => {
  let component: AppIconSvgComponent;
  let fixture: ComponentFixture<AppIconSvgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppIconSvgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
