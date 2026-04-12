import { TestBed } from '@angular/core/testing';

import { CommonData } from './common-data';

describe('CommonData', () => {
  let service: CommonData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
