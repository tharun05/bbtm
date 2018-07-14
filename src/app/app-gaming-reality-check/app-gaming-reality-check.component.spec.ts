import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGamingRealityCheckComponent } from './app-gaming-reality-check.component';

describe('AppGamingRealityCheckComponent', () => {
  let component: AppGamingRealityCheckComponent;
  let fixture: ComponentFixture<AppGamingRealityCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppGamingRealityCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGamingRealityCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
