import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
import { Mail } from '../data/mail/mail.model';
import { MailRepository } from '../data/mail/mail.repository';

@Component({
  selector: 'rpl-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  private navService = inject(NavigationService);
  private mailRepo = inject(MailRepository);

  activeNavItem = toSignal(this.navService.activeItem$, { requireSync: true });

  searchText$ = new BehaviorSubject('');

  mails$: Observable<Mail[]> = concat(
    this.searchText$.pipe(first()),
    this.searchText$.pipe(debounceTime(200)),
  ).pipe(
    map((text) => text.split(' ')),
    switchMap((keywords) =>
      this.mailRepo.query(
        ({ subject }) =>
          !!subject &&
          keywords.some((keyword) =>
            subject.toLowerCase().includes(keyword.toLowerCase()),
          ),
      ),
    ),
  );
}
