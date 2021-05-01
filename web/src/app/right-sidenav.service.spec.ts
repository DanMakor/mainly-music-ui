import { TestBed } from '@angular/core/testing';

import { RightSidenavService } from './right-sidenav.service';

describe('RightSidenavService', () => {
  let service: RightSidenavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RightSidenavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
