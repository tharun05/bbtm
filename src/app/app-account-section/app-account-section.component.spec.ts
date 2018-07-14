import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAccountSectionComponent } from './app-account-section.component';

describe('AppAccountSectionComponent', () => {
  let component: AppAccountSectionComponent;
  let fixture: ComponentFixture<AppAccountSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppAccountSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAccountSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
