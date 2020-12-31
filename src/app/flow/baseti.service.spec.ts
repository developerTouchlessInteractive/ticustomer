import { TestBed } from '@angular/core/testing';

import { BaseTIService } from './baseTI.service';

describe('BasetiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseTIService = TestBed.get(BaseTIService);
    expect(service).toBeTruthy();
  });
});
