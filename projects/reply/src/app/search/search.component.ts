import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  BehaviorSubject,
  concat,
  debounceTime,
  first,
  map,
  Observable,
  switchMap,
} from 'rxjs';

import { NAVIGATION_CONTEXT } from '../core/navigation-context.token';
import { Mail } from '../data/mail/mail.model';
import { MailRepository } from '../data/mail/mail.repository';

@Component({
  selector: 'rpl-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  navigationContext = inject(NAVIGATION_CONTEXT);
  private mailRepo = inject(MailRepository);

  searchText$ = new BehaviorSubject('');
  mails$!: Observable<Mail[]>;

  ngOnInit(): void {
    this.mails$ = concat(
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
}
