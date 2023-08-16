import { Injectable, TemplateRef } from '@angular/core';
import { Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavFabService {
  #config = new BehaviorSubject<NavFabConfig | null>(null);
  readonly config$ = this.#config.pipe();

  useConfig(config: NavFabConfig | null): void {
    this.#config.next(config);
  }
}

export interface NavFabConfig {
  text: string;
  icon: TemplateRef<never>;
  link: string;
  linkParams?: Params;
}
