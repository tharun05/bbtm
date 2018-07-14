import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPageLoaderComponent } from './app-page-loader.component';

describe('AppPageLoaderComponent', () => {
  let component: AppPageLoaderComponent;
  let fixture: ComponentFixture<AppPageLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPageLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPageLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
