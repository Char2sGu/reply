import { inject } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';

export abstract class ChildRouteAnimationHost {
  protected childRouterOutletContexts = inject(ChildrenOutletContexts);

  getChildRouteComponentName(): string {
    return (
      this.childRouterOutletContexts.getContext('primary')?.route?.component
        ?.name ?? 'None'
    );
  }
}
