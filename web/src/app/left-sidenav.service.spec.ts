import { TestBed } from '@angular/core/testing';

import { LeftSidenavService } from './left-sidenav.service';

describe('LeftSidenavService', () => {
  let service: LeftSidenavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeftSidenavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
