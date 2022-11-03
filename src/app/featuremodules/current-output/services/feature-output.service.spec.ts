import { TestBed } from '@angular/core/testing';

import { FeatureOutputService } from './feature-output.service';

describe('FeatureOutputService', () => {
  let service: FeatureOutputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureOutputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
