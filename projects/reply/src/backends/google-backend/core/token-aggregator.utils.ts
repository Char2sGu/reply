import { inject } from '@angular/core';

import { TokenAggregator } from './token-aggregator.service';

export function injectTokenAggregator<
  Tokens extends Record<string, string | null>,
>(): TokenAggregator<Tokens> {
  return inject(TokenAggregator);
}
