import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

import { Contact } from './contact.model';
import { ContactRepository } from './contact.repository';

@Pipe({
  name: 'contactRef',
  standalone: true,
})
export class ContactRefPipe implements PipeTransform {
  constructor(private contactRepo: ContactRepository) {}

  transform(id: Contact['id']): Observable<Contact> {
    return this.contactRepo.retrieve(id);
  }
}
