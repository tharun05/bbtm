import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppContactContainerComponent } from './app-contact-container.component';

describe('AppContactContainerComponent', () => {
  let component: AppContactContainerComponent;
  let fixture: ComponentFixture<AppContactContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppContactContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppContactContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
