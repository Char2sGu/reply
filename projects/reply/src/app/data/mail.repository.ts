import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ReactiveRepository } from '../common/repository';
import { EntityNotFoundException } from '../core/exceptions';
import { Mail } from './mail.model';
import { MAILS } from './mail.records';

@Injectable({
  providedIn: 'root',
})
export class MailRepository extends ReactiveRepository<Mail> {
  private entities = [...MAILS];

  retrieve(id: Mail['id']): Observable<Mail> {
    const entity = this.entities.find((item) => item.id === id);
    if (!entity) throw new EntityNotFoundException();
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
    const index = this.entities.findIndex((item) => item.id === id);
    if (index === -1) throw new EntityNotFoundException();
    this.entities[index] = { ...this.entities[index], ...payload, id };
    return this.reactivityFor(this.entities[index]);
  }

  delete(id: Mail['id']): void {
    const index = this.entities.findIndex((item) => item.id === id);
    if (index === -1) throw new EntityNotFoundException();
    this.entities.splice(index, 1);
    this.reactivity.set(id, null);
  }

  protected identify(entity: Mail): string {
    return entity.id;
  }
}
