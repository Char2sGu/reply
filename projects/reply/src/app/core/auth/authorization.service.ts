import { EventEmitter, Injectable } from '@angular/core';
import dayjs from 'dayjs/esm';
import { filter, shareReplay, startWith, takeUntil, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private authorizationChange = new EventEmitter<Authorization | null>();
  readonly authorization$ = this.authorizationChange.pipe(
    startWith(null),
    shareReplay(1),
  );

  setAuthorization(auth: Authorization): boolean {
    const issueDate = dayjs(auth.issuedAt);
    const expireDate = issueDate.add(auth.lifespan, 'seconds');
    const isAboutToExpire = () => dayjs().add(1, 'minute').isAfter(expireDate);

    if (isAboutToExpire()) return false;

    this.authorizationChange.emit(auth);
    timer(0, 30 * 1000)
      .pipe(
        takeUntil(this.authorizationChange),
        filter(() => isAboutToExpire()),
      )
      .subscribe(() => {
        this.authorizationChange.emit(null);
      });

    return true;
  }
}

export interface Authorization {
  token: string;
  issuedAt: Date;
  lifespan: number;
}
