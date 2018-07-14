import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickDepositCallBackComponent } from './quick-deposit-call-back.component';

describe('QuickDepositCallBackComponent', () => {
  let component: QuickDepositCallBackComponent;
  let fixture: ComponentFixture<QuickDepositCallBackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickDepositCallBackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickDepositCallBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
