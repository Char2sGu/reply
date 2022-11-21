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
import { filter, takeUntil } from 'rxjs';

import { LayoutAnimator } from '../layout-projection/core/layout-animation';

@Component({
  selector: 'rpl-mails',
  templateUrl: './mails.component.html',
  styleUrls: ['./mails.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(LayoutAnimator) private layoutAnimator!: LayoutAnimator;
  private destroy$ = new EventEmitter();

  constructor(private router: Router) {}

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
