import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScratchComponent } from './scratch.component';

describe('ScratchComponent', () => {
  let component: ScratchComponent;
  let fixture: ComponentFixture<ScratchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScratchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScratchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
