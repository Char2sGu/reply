import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutConfig {
  contentFavored = false;
  navFabConfig = { text: 'Compose', icon: 'edit', link: '/compose' };

  readonly value$ = new BehaviorSubject(this);

  constructor() {
    return new Proxy(this, {
      set: (target, prop, value) => {
        const exists = prop in target;
        if (!exists) return false;

        const key = prop as keyof this;
        if (target[key] === value) return true;
        target[key] = value;
        target.value$.next(target);
        return true;
      },
    });
  }
}
