import { Pipe, PipeTransform } from '@angular/core';

import { Contact } from './contact.model';

@Pipe({
  name: 'contactStringify',
  standalone: true,
})
export class ContactStringifyPipe implements PipeTransform {
  transform(input: Contact | Contact[], selfId?: Contact['id']): string {
    const entities = Array.isArray(input) ? input : [input];
    const strings = entities.map((e) =>
      e.id === selfId ? 'me' : e.name ?? e.email,
    );
    if (!strings.length) return '';
    else if (strings.length === 1) return strings[0];
    else if (strings.length === 2) return `${strings[0]} and ${strings[1]}`;
    return `${strings.slice(0, -1).join(', ')}, and ${strings.at(-1)}`;
  }
}
