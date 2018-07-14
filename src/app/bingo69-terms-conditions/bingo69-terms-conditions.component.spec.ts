import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Bingo69TermsConditionsComponent } from './bingo69-terms-conditions.component';

describe('Bingo69TermsConditionsComponent', () => {
  let component: Bingo69TermsConditionsComponent;
  let fixture: ComponentFixture<Bingo69TermsConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Bingo69TermsConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Bingo69TermsConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
