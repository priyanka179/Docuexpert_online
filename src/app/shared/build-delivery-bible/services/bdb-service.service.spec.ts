import { TestBed } from '@angular/core/testing';

import { BdbServiceService } from './bdb-service.service';

describe('BdbServiceService', () => {
  let service: BdbServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BdbServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
