import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutBellaBingoComponent } from './about-bellaBingo.component';

describe('AboutLottodayComponent', () => {
  let component: AboutBellaBingoComponent;
  let fixture: ComponentFixture<AboutBellaBingoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutBellaBingoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutBellaBingoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
