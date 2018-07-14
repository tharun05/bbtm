import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoGuideComponent } from './bingo-guide.component';

describe('BingoGuideComponent', () => {
  let component: BingoGuideComponent;
  let fixture: ComponentFixture<BingoGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BingoGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BingoGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
