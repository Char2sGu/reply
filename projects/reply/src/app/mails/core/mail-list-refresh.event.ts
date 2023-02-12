import { EventEmitter, Injectable } from '@angular/core';

// TODO: re-consider implementation
@Injectable({
  providedIn: 'root',
})
export class MailListRefreshEvent extends EventEmitter {}
