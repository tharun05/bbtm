import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLoadingScreenComponent } from './app-loading-screen.component';

describe('AppLoadingScreenComponent', () => {
  let component: AppLoadingScreenComponent;
  let fixture: ComponentFixture<AppLoadingScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppLoadingScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLoadingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
