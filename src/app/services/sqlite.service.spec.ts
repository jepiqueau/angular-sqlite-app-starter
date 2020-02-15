import { TestBed } from '@angular/core/testing';

import { SQLiteService } from './sqlite.service';

describe('SqliteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SQLiteService = TestBed.get(SQLiteService);
    expect(service).toBeTruthy();
  });
});
