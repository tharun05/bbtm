import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalModalComponent } from './withdrawal-modal.component';

describe('WithdrawalModalComponent', () => {
  let component: WithdrawalModalComponent;
  let fixture: ComponentFixture<WithdrawalModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawalModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
