import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LossLimitComponent } from './loss-limit.component';

describe('LossLimitComponent', () => {
  let component: LossLimitComponent;
  let fixture: ComponentFixture<LossLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LossLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LossLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
