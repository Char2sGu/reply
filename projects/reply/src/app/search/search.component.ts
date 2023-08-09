import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  concat,
  debounceTime,
  first,
  map,
  Observable,
  switchMap,
} from 'rxjs';

import { NavigationService } from '../core/navigation.service';
import { Mail } from '../entity/mail/mail.model';
import { MAIL_STATE } from '../state/mail/mail.state-entry';

@Component({
  selector: 'rpl-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  private store = inject(Store);
  private navService = inject(NavigationService);

  activeNavItem = toSignal(this.navService.activeItem$, { requireSync: true });

  searchText$ = new BehaviorSubject('');

  mails$: Observable<Mail[]> = concat(
    this.searchText$.pipe(first()),
    this.searchText$.pipe(debounceTime(200)),
  ).pipe(
    map((text) => text.split(' ')),
    switchMap((keywords) =>
      this.store
        .select(MAIL_STATE.selectMails)
        .pipe(
          map((mails) =>
            mails.query(
              ({ subject }) =>
                !!subject && this.matchKeyword(subject, keywords),
            ),
          ),
        ),
    ),
  );

  private matchKeyword(target: string, keywords: string[]): boolean {
    return keywords.some((keyword) =>
      target.toLowerCase().includes(keyword.toLowerCase()),
    );
  }
}
