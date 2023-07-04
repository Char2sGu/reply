import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  concat,
  debounceTime,
  first,
  map,
  Observable,
  switchMap,
} from 'rxjs';

import { NavigationContext } from '../core/navigation.context';
import { Mail } from '../data/mail.model';
import { MailRepository } from '../data/mail.repository';

@Component({
  selector: 'rpl-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  searchText$ = new BehaviorSubject('');
  mails$!: Observable<Mail[]>;

  constructor(
    public navigationContext: NavigationContext,
    private mailRepo: MailRepository,
  ) {}

  ngOnInit(): void {
    this.mails$ = concat(
      this.searchText$.pipe(first()),
      this.searchText$.pipe(debounceTime(200)),
    ).pipe(
      map((text) => text.split(' ')),
      switchMap((keywords) =>
        this.mailRepo.query((e) =>
          keywords.some((keyword) =>
            e.subject.toLowerCase().includes(keyword.toLowerCase()),
          ),
        ),
      ),
    );
  }
}
