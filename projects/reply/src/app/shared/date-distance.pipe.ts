import { Pipe, PipeTransform } from '@angular/core';
import * as timeago from 'timeago.js';

const LOCALE_NAME = 'en_US_abbr';

timeago.register(
  LOCALE_NAME,
  (_, index) =>
    [
      ['just now', 'just now'],
      ['%s seconds ago', '%s secs ago'],
      ['1 minute ago', '1 min ago'],
      ['%s minutes ago', '%s mins ago'],
      ['1 hour ago', '1 hr ago'],
      ['%s hours ago', '%s hrs ago'],
      ['1 day ago', '1 day ago'],
      ['%s days ago', '%s days ago'],
      ['1 week ago', '1 week ago'],
      ['%s weeks ago', '%s weeks ago'],
      ['1 month ago', '1 month ago'],
      ['%s months ago', '%s months ago'],
      ['1 year ago', '1 year ago'],
      ['%s years ago', '%s years ago'],
    ][index] as [string, string],
);

// TODO: fix the locale not working problem

@Pipe({
  name: 'dateDistance',
  standalone: true,
})
export class DateDistancePipe implements PipeTransform {
  transform(date: Date, ...args: unknown[]): string {
    return timeago.format(date, LOCALE_NAME);
  }
}
