import { TestBed } from '@angular/core/testing';

import { CommonnService } from './commonn.service';

describe('CommonnService', () => {
  let service: CommonnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
