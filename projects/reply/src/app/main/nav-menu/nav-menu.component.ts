import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  Input,
} from '@angular/core';
import { map } from 'rxjs';

import { NavigationService } from '@/app/core/navigation.service';

@Component({
  selector: 'rpl-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMenuComponent {
  private navService = inject(NavigationService);

  @Input() @HostBinding('class.expanded') expanded = true;

  items$ = this.navService.items$;

  itemsWithIcons$ = this.navService.items$.pipe(
    map((items) => items.flatMap((i) => (i.icon ? i : []))),
  );
  itemsWithoutIcons$ = this.navService.items$.pipe(
    map((items) => items.flatMap((i) => (i.icon ? [] : i))),
  );
}
