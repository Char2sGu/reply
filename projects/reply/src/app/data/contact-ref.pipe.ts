import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

import { Contact } from './contact.model';
import { ContactService } from './contact.service';

@Pipe({
  name: 'contactRef',
  standalone: true,
})
export class ContactRefPipe implements PipeTransform {
  constructor(private contactService: ContactService) {}

  transform(id: Contact['id']): Observable<Contact> {
    return this.contactService.getContact$ById(id);
  }
}
