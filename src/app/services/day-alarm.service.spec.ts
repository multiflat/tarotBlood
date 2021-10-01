import { TestBed } from '@angular/core/testing';

import { DayAlarmService } from './day-alarm.service';

describe('DayAlarmService', () => {
  let service: DayAlarmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DayAlarmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
