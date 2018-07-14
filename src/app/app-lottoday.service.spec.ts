import { TestBed, inject } from '@angular/core/testing';

import { AppLottodayService } from './app-lottoday.service';

describe('AppLottodayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppLottodayService]
    });
  });

  it('should be created', inject([AppLottodayService], (service: AppLottodayService) => {
    expect(service).toBeTruthy();
  }));
});
