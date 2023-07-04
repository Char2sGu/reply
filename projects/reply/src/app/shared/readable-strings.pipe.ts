import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readableStrings',
  standalone: true,
})
export class ReadableStringsPipe implements PipeTransform {
  transform(strings: string[]): string {
    if (!strings.length) return '';
    else if (strings.length === 1) return strings[0];
    else if (strings.length === 2) return `${strings[0]} and ${strings[1]}`;
    return `${strings.slice(0, -1).join(', ')}, and ${strings.at(-1)}`;
  }
}
