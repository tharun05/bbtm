import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WagerLimitComponent } from './wager-limit.component';

describe('WagerLimitComponent', () => {
  let component: WagerLimitComponent;
  let fixture: ComponentFixture<WagerLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WagerLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WagerLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
