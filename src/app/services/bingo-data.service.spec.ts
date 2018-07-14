import { TestBed, inject } from '@angular/core/testing';

import { BingoDataService } from './bingo-data.service';

describe('BingoDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BingoDataService]
    });
  });

  it('should be created', inject([BingoDataService], (service: BingoDataService) => {
    expect(service).toBeTruthy();
  }));
});
