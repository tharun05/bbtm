import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppReturnFrom3dComponent } from './app-return-from-3d.component';

describe('AppReturnFrom3dComponent', () => {
  let component: AppReturnFrom3dComponent;
  let fixture: ComponentFixture<AppReturnFrom3dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppReturnFrom3dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppReturnFrom3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
