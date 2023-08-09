import { inject, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';

import { CONTACT_STATE } from '@/app/state/contact/contact.state-entry';

import { Contact } from '../contact/contact.model';
import { MailParticipant } from '../mail/mail.model';

@Pipe({
  name: 'contactFromMailParticipant',
  standalone: true,
})
export class ContactFromMailParticipantPipe implements PipeTransform {
  private store = inject(Store);

  transform(participants: MailParticipant[]): Observable<Contact[]>;
  transform(participant: MailParticipant): Observable<Contact>;
  transform(
    input: MailParticipant | MailParticipant[],
  ): Observable<Contact | Contact[]> {
    return input instanceof Array
      ? combineLatest(input.map((p) => this.transformOne(p)))
      : this.transformOne(input);
  }

  private transformOne(participant: MailParticipant): Observable<Contact> {
    const { email } = participant;
    return this.store.select(CONTACT_STATE.selectContacts).pipe(
      map((contacts) => contacts.queryOne((e) => e.email === email)),
      map((contact) => contact ?? this.generateContact(participant)),
    );
  }

  private generateContact(participant: MailParticipant): Contact {
    return {
      id: `generated-${participant.email}`,
      name: participant.name,
      email: participant.email,
    };
  }
}
