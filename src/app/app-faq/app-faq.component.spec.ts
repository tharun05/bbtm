import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFaqComponent } from './app-faq.component';

describe('AppFaqComponent', () => {
  let component: AppFaqComponent;
  let fixture: ComponentFixture<AppFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
