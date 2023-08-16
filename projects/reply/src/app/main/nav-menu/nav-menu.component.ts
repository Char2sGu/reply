import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  inject,
  Input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

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

  items = toSignal(this.navService.items$, { requireSync: true });
  activeItem = toSignal(this.navService.currActiveItem$, { requireSync: true });

  itemsWithIcons = computed(() =>
    this.items().flatMap((i) => (i.icon ? i : [])),
  );
  itemsWithoutIcons = computed(() =>
    this.items().flatMap((i) => (i.icon ? [] : i)),
  );
}
