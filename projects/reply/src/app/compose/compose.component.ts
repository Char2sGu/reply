import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NavigationContext } from '../core/navigation.context';

@Component({
  selector: 'rpl-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComposeComponent implements OnInit {
  subject$ = new BehaviorSubject('');
  senderEmail$ = new BehaviorSubject(0);
  content$ = new BehaviorSubject('');

  constructor(public navigationContext: NavigationContext) {}

  ngOnInit(): void {}
}
