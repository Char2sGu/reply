import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

import { DateDistancePipe } from './date-distance.pipe';

@Pipe({
  name: 'readableDate',
  standalone: true,
})
export class ReadableDatePipe implements PipeTransform {
  private dateDistancePipe = new DateDistancePipe();

  transform(date: Date): unknown {
    const dayjsTarget = dayjs(date);
    const dayjsNow = dayjs();
    return dayjsTarget.diff(dayjsNow, 'week') > -1
      ? this.dateDistancePipe.transform(date)
      : dayjsTarget.diff(dayjsNow, 'year') > -1
      ? dayjsTarget.format('MMM D')
      : dayjsTarget.format('MMM D, YYYY');
  }
}
