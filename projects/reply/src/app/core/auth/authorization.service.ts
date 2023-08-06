import { Injectable } from '@angular/core';
import dayjs from 'dayjs/esm';
import { BehaviorSubject, filter, takeUntil, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  #authorization$ = new BehaviorSubject<Authorization | null>(null);
  readonly authorization$ = this.#authorization$.pipe();

  setAuthorization(auth: Authorization | null): boolean {
    if (!auth) {
      this.#authorization$.next(null);
      return true;
    }

    const issueDate = dayjs(auth.issuedAt);
    const expireDate = issueDate.add(auth.lifespan, 'seconds');
    const isAboutToExpire = () => dayjs().add(1, 'minute').isAfter(expireDate);

    if (isAboutToExpire()) return false;

    this.#authorization$.next(auth);
    timer(0, 30 * 1000)
      .pipe(
        takeUntil(this.#authorization$),
        filter(() => isAboutToExpire()),
      )
      .subscribe(() => {
        this.#authorization$.next(null);
      });

    return true;
  }
}

export interface Authorization {
  token: string;
  issuedAt: Date;
  lifespan: number;
}
