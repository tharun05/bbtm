import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMyaccountComponent } from './app-myaccount.component';

describe('AppMyaccountComponent', () => {
  let component: AppMyaccountComponent;
  let fixture: ComponentFixture<AppMyaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppMyaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppMyaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
