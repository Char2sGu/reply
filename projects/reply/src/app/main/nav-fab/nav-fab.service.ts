import { EventEmitter, Injectable, TemplateRef } from '@angular/core';
import { Params } from '@angular/router';
import { shareReplay, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavFabService {
  private configChange = new EventEmitter<NavFabConfig | null>();
  readonly config$ = this.configChange.pipe(shareReplay(1), startWith(null));

  useConfig(config: NavFabConfig | null): void {
    this.configChange.emit(config);
  }
}

export interface NavFabConfig {
  text: string;
  icon: TemplateRef<never>;
  link: string;
  linkParams?: Params;
}
