import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatbingoComponent } from './whatbingo.component';

describe('WhatbingoComponent', () => {
  let component: WhatbingoComponent;
  let fixture: ComponentFixture<WhatbingoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatbingoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatbingoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
