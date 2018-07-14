import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatIsBingoComponent } from './what-is-bingo.component';

describe('WhatIsBingoComponent', () => {
  let component: WhatIsBingoComponent;
  let fixture: ComponentFixture<WhatIsBingoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatIsBingoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatIsBingoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
