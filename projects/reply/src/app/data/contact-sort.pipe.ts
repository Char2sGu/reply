import { Pipe, PipeTransform } from '@angular/core';

import { Contact } from './contact.model';

@Pipe({
  name: 'contactSort',
  standalone: true,
})
export class ContactSortPipe implements PipeTransform {
  transform(entities: Contact[], selfId?: Contact['id']): Contact[] {
    return entities.sort((a, b) => {
      if (a.id === selfId) return -Infinity;
      if (b.id === selfId) return Infinity;
      if (!a.name) return 1;
      if (!b.name) return -1;
      return a.name.localeCompare(b.name);
    });
  }
}
