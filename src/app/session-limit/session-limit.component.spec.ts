import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionLimitComponent } from './session-limit.component';

describe('SessionLimitComponent', () => {
  let component: SessionLimitComponent;
  let fixture: ComponentFixture<SessionLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
