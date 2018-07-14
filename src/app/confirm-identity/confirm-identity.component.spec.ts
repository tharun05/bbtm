import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmIdentityComponent } from './confirm-identity.component';

describe('ConfirmIdentityComponent', () => {
  let component: ConfirmIdentityComponent;
  let fixture: ComponentFixture<ConfirmIdentityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmIdentityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
