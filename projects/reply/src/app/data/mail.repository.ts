import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EntityCollection, ReactiveRepository } from '../common/repository';
import { Mail } from './mail.model';
import { MAILS } from './mail.records';

@Injectable({
  providedIn: 'root',
})
export class MailRepository extends ReactiveRepository<Mail> {
  private entities = new EntityCollection(...MAILS);

  retrieve(id: Mail['id']): Observable<Mail> {
    const entity = this.entities.findOrThrow((item) => item.id === id);
    return this.reactivityFor(entity);
  }

  listByMailbox(mailboxName: Mail['mailboxName']): Observable<Mail[]> {
    const entities = this.entities.filter(
      (item) => item.mailboxName === mailboxName,
    );
    return this.reactivityForAll(entities);
  }

  listStarred(): Observable<Mail[]> {
    const entities = this.entities.filter((item) => item.isStarred);
    return this.reactivityForAll(entities);
  }

  listByKeywords(keywords: string[]): Observable<Mail[]> {
    const entities = this.entities.filter((entity) =>
      keywords.some((keyword) =>
        entity.subject.toLowerCase().includes(keyword.toLowerCase()),
      ),
    );
    return this.reactivityForAll(entities);
  }

  update(id: Mail['id'], payload: Partial<Mail>): Observable<Mail> {
    const entity = this.entities.update(
      (item) => item.id === id,
      (prev) => ({ ...prev, ...payload, id }),
    );
    return this.reactivityFor(entity);
  }

  delete(id: Mail['id']): void {
    this.entities.remove((item) => item.id === id);
    this.reactivity.set(id, null);
  }

  protected identify(entity: Mail): string {
    return entity.id;
  }
}
