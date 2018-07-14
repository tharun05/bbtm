import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusFieldComponent } from './bonus-field.component';

describe('BonusFieldComponent', () => {
  let component: BonusFieldComponent;
  let fixture: ComponentFixture<BonusFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonusFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
