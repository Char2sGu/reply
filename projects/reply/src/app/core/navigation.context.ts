import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationContext {
  latestMailboxUrl = signal<string | null>(null);
  latestMailboxIndex = signal<number | null>(null);
}
