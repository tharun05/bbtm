import { TestBed, inject } from '@angular/core/testing';

import { LogoutEmitService } from './logout-emit-service';

describe('LogoutEmitServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogoutEmitService]
    });
  });

  it('should be created', inject([LogoutEmitService], (service: LogoutEmitService) => {
    expect(service).toBeTruthy();
  }));
});
