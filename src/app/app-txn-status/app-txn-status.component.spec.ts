import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTxnStatusComponent } from './app-txn-status.component';

describe('AppTxnStatusComponent', () => {
  let component: AppTxnStatusComponent;
  let fixture: ComponentFixture<AppTxnStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppTxnStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTxnStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
