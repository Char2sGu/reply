import { TestBed } from '@angular/core/testing';

import { BreakpointManager } from './breakpoint.manager';

describe('BreakpointManager', () => {
  let service: BreakpointManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreakpointManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
