import { TestBed } from '@angular/core/testing';

import { StatusTableService } from './status-table.service';

describe('StatusTableService', () => {
  let service: StatusTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
