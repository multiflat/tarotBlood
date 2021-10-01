import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map, shareReplay } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DayAlarmService {
  private day$: Observable<Date> = timer(
    0, 1000 * 60 * 60 * 24).pipe(
      map(day => new Date()),
      shareReplay(1)
    );
  get day(){
    return this.day$;

  }  
  constructor() {}
}
