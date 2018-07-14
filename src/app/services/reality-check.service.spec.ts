import { TestBed, inject } from '@angular/core/testing';

import { RealityCheckService } from './reality-check.service';

describe('RealityCheckService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RealityCheckService]
    });
  });

  it('should be created', inject([RealityCheckService], (service: RealityCheckService) => {
    expect(service).toBeTruthy();
  }));
});
