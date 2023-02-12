import { Injectable } from '@angular/core';

import { ContactRepository } from '../data/contact.repository';

@Injectable({
  providedIn: 'root',
})
export class Authenticator {
  user$ = this.contactRepo.retrieve('user');

  constructor(private contactRepo: ContactRepository) {}
}
