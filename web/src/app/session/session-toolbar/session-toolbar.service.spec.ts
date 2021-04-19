import { TestBed } from '@angular/core/testing';

import { SessionToolbarService } from './session-toolbar.service';

describe('SessionToolbarService', () => {
  let service: SessionToolbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionToolbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
