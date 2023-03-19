import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutAnimator } from '@layout-projection/core';
import { map } from 'rxjs';

@Component({
  selector: 'rpl-mail-detail-layout',
  templateUrl: './mail-detail-layout.component.html',
  styleUrls: ['./mail-detail-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailDetailLayoutComponent implements OnInit, AfterViewInit {
  mailId$ = this.route.params.pipe(map((params) => params['mailId']));

  constructor(
    private route: ActivatedRoute,
    private layoutAnimator: LayoutAnimator,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.layoutAnimator.animate(300, AnimationCurves.STANDARD_CURVE);
  }
}
