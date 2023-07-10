import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { MailService } from '@/app/data/mail.service';

import { Mail } from '../../../data/mail.model';

@Component({
  selector: 'rpl-mail-star-button',
  templateUrl: './mail-star-button.component.html',
  styleUrls: ['./mail-star-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailStarButtonComponent {
  private mailService = inject(MailService);
  private changeDetector = inject(ChangeDetectorRef);

  @Input() mail!: Mail;

  busy = false;

  async onClick(): Promise<void> {
    if (this.busy) return;
    const action$ = this.mail.isStarred
      ? this.mailService.markMailAsNotStarred(this.mail.id)
      : this.mailService.markMailAsStarred(this.mail.id);
    this.busy = true;
    await firstValueFrom(action$);
    this.busy = false;
    this.changeDetector.markForCheck();
  }
}
