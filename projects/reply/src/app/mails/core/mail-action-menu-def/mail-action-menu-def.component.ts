import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatLegacyMenu as MatMenu } from '@angular/material/legacy-menu';

@Component({
  selector: 'rpl-mail-action-menu-def',
  templateUrl: './mail-action-menu-def.component.html',
  styleUrls: ['./mail-action-menu-def.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailActionMenuDefComponent {
  @ViewChild(MatMenu) menuRef!: MatMenu;
}
