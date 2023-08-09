import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Contact } from '../contact/contact.model';
import { MailParticipant } from '../mail/mail.model';

@Pipe({
  name: 'contactFromMailParticipant',
  standalone: true,
})
export class ContactFromMailParticipantPipe implements PipeTransform {
  transform(participants: MailParticipant[]): Observable<Contact[]>;
  transform(participant: MailParticipant): Observable<Contact>;
  transform(
    input: MailParticipant | MailParticipant[],
  ): Observable<Contact | Contact[]> {
    // TODO: implement matching
    return input instanceof Array
      ? of(input.map((p) => this.generateContact(p)))
      : of(this.generateContact(input));
  }

  private generateContact(participant: MailParticipant): Contact {
    return {
      id: `generated-${participant.email}`,
      name: participant.name,
      email: participant.email,
    };
  }
}
