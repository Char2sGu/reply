import { animate, query, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { LayoutAnimator } from '@layout-projection/core';
import { filter, takeUntil } from 'rxjs';

import { ChildRouteAnimationHost } from '../common/child-route-animation-host';

@Component({
  selector: 'rpl-mails',
  templateUrl: './mails.component.html',
  styleUrls: ['./mails.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('route', [
      transition('list => detail', [query(':leave', [animate('500ms')])]),
    ]),
  ],
})
export class MailsComponent
  extends ChildRouteAnimationHost
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(LayoutAnimator) private layoutAnimator!: LayoutAnimator;
  private destroy$ = new EventEmitter();

  constructor(private router: Router) {
    super();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((event) => event instanceof NavigationStart),
      )
      .subscribe(() => this.layoutAnimator.snapshot());
  }

  ngOnDestroy(): void {
    this.destroy$.emit();
  }
}
