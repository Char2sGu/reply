import { TestBed } from '@angular/core/testing';

import { LayoutConfig } from './layout.config';

describe('LayoutConfig', () => {
  let service: LayoutConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutConfig);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
