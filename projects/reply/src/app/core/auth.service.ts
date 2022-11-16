import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Contact } from '../data/contact.model';
import { ContactService } from '../data/contact.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private contactService: ContactService) {}

  getUser$(): Observable<Contact> {
    return this.contactService.getContact$ById('user');
  }
}
