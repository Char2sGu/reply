import { forwardRef, Injectable } from '@angular/core';

import { Contact } from '../contact/contact.model';
import { Account } from './account.model';

@Injectable({
  providedIn: 'root',
  useClass: forwardRef(() => EmailBasedAccountIdentifier),
})
export abstract class AccountIdentifier {
  abstract identify(profile: Contact): Account['id'];
}

@Injectable()
export class EmailBasedAccountIdentifier implements AccountIdentifier {
  identify(profile: Contact): Account['id'] {
    return profile.email;
  }
}
