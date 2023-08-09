import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { ProjectionNode } from '@layout-projection/core';
import { ReplaySubject } from 'rxjs';

import { Mail } from '@/app/entity/mail/mail.model';

@Component({
  selector: 'rpl-mail-card-animation-presence',
  templateUrl: './mail-card-animation-presence.component.html',
  styleUrls: ['./mail-card-animation-presence.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailCardAnimationPresenceComponent {
  @Input() mail!: Mail;

  // prettier-ignore
  @ViewChild(ProjectionNode) set nodeInput(v: ProjectionNode) { this.node$.next(v) }
  node$ = new ReplaySubject<ProjectionNode>(1);
}
