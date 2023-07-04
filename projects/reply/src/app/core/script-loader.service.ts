import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScriptLoader {
  private document = inject(DOCUMENT);

  async load(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = this.document.createElement('script');
      script.src = url;
      script.addEventListener('load', () => resolve());
      script.addEventListener('error', (e) => reject(e.error));
      this.document.head.appendChild(script);
    });
  }
}
