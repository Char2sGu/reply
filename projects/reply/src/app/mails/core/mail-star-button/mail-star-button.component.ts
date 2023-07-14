import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { useActionFlow } from '@/app/core/action-flow';

import { Mail } from '../../../data/mail.model';
import { ToggleMailStarredStatusActionFlow } from '../mail.action-flows';

@Component({
  selector: 'rpl-mail-star-button',
  templateUrl: './mail-star-button.component.html',
  styleUrls: ['./mail-star-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailStarButtonComponent {
  private toggleStarred = useActionFlow(ToggleMailStarredStatusActionFlow);

  @Input() mail!: Mail;

  click = new EventEmitter();

  constructor() {
    this.click
      .pipe(
        switchMap(() => this.toggleStarred({ mail: this.mail })),
        takeUntilDestroyed(),
      )
      .subscribe();
  }
}
