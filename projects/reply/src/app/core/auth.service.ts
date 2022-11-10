import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Contact } from './contact.model';
import { ContactService } from './contact.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private contactService: ContactService) {}

  getUser$(): Observable<Contact> {
    return this.contactService.getContact$ById('user');
  }
}
