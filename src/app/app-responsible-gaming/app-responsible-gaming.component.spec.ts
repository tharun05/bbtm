import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppResponsibleGamingComponent } from './app-responsible-gaming.component';

describe('AppResponsibleGamingComponent', () => {
  let component: AppResponsibleGamingComponent;
  let fixture: ComponentFixture<AppResponsibleGamingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppResponsibleGamingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppResponsibleGamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
