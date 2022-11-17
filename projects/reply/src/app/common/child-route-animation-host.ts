import { inject } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';

export abstract class ChildRouteAnimationHost {
  protected childRouterOutletContexts = inject(ChildrenOutletContexts);

  getChildRouteAnimationId(): string {
    return (
      this.childRouterOutletContexts.getContext('primary')?.route?.snapshot
        ?.data?.['animationId'] ?? 'none'
    );
  }
}
