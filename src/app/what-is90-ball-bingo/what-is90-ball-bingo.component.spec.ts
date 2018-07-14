import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatIs90BallBingoComponent } from './what-is90-ball-bingo.component';

describe('WhatIs90BallBingoComponent', () => {
  let component: WhatIs90BallBingoComponent;
  let fixture: ComponentFixture<WhatIs90BallBingoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatIs90BallBingoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatIs90BallBingoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
