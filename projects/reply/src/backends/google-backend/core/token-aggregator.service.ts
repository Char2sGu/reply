import { Injectable } from '@angular/core';

@Injectable()
export abstract class TokenAggregator<
  Tokens extends Record<string, string | null>,
> {
  abstract aggregate(tokens: Tokens): string;
  abstract separate(token: string): Tokens;
}

@Injectable()
export class JsonTokenAggregator<Tokens extends Record<string, string | null>>
  implements TokenAggregator<Tokens>
{
  aggregate(tokens: Tokens): string {
    return JSON.stringify(tokens);
  }

  separate(token: string): Tokens {
    return JSON.parse(token);
  }
}
