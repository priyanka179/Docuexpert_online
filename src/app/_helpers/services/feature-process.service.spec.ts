import { TestBed } from '@angular/core/testing';

import { FeatureProcessService } from './feature-process.service';

describe('FeatureProcessService', () => {
  let service: FeatureProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
