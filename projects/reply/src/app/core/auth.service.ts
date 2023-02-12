import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Contact } from '../data/contact.model';
import { ContactRepository } from '../data/contact.repository';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private contactService: ContactRepository) {}

  getUser$(): Observable<Contact> {
    return this.contactService.retrieve('user');
  }
}
