import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScriptLoader {
  private document = inject(DOCUMENT);

  load(url: string): Observable<void> {
    return new Observable((subscriber) => {
      const script = this.document.createElement('script');
      script.src = url;
      script.addEventListener('load', () => {
        subscriber.next();
        subscriber.complete();
      });
      script.addEventListener('error', (e) => {
        subscriber.error(e.error);
      });
      this.document.head.appendChild(script);
      return () => script.remove();
    });
  }
}
