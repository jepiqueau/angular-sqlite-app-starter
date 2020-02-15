import { TestBed } from '@angular/core/testing';

import { DarkModeService } from './darkmode.service';

describe('DarkModeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DarkModeService = TestBed.get(DarkmodeService);
    expect(service).toBeTruthy();
  });
});
