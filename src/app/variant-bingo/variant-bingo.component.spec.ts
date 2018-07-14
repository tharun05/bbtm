import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantBingoComponent } from './variant-bingo.component';

describe('VariantBingoComponent', () => {
  let component: VariantBingoComponent;
  let fixture: ComponentFixture<VariantBingoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariantBingoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantBingoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
