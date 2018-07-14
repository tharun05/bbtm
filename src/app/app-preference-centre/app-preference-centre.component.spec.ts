import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPreferenceCentreComponent } from './app-preference-centre.component';

describe('AppPreferenceCentreComponent', () => {
  let component: AppPreferenceCentreComponent;
  let fixture: ComponentFixture<AppPreferenceCentreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPreferenceCentreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPreferenceCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
