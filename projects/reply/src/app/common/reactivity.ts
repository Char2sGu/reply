import { EventEmitter } from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  map,
  Observable,
  shareReplay,
  startWith,
  takeWhile,
} from 'rxjs';

export abstract class ReactiveObject {
  readonly value$: Observable<this>;

  protected assign$: EventEmitter<void>;

  constructor() {
    this.assign$ = new EventEmitter();
    this.value$ = this.assign$.pipe(
      // Combine multiple assigns as well as trigger a new change detection
      // cycle.
      // Some components that is close to the root will not be able to be
      // checked if we use the current running change detection cycle when
      // the config is updated in an OnInit life-cycle hook.
      debounceTime(0),

      startWith(this),
      map(() => this),
      shareReplay(1),
    );

    return new Proxy(this, {
      set: (target, prop, value) => {
        const key = prop as keyof this;
        if (target[key] === value) return true;
        target[key] = value;
        target.assign$.emit();
        return true;
      },
    });
  }
}

export class ReactiveIdentityMap<Value> {
  private subjects = new Map<string, BehaviorSubject<Value | null>>();

  set(id: string, entity: Value | null): void {
    const subject = this.getOrInitSubject(id);
    subject.next(entity);
  }

  get(id: string): Observable<Value> {
    return this.getOrInitSubject(id).pipe(takeWhile(Boolean));
  }

  private getOrInitSubject(id: string): BehaviorSubject<Value | null> {
    let subject = this.subjects.get(id);
    if (!subject) {
      subject = new BehaviorSubject<Value | null>(null);
      this.subjects.set(id, subject);
    }
    return subject;
  }
}
