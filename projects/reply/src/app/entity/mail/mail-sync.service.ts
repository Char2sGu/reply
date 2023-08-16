import { Injectable } from '@angular/core';

import { SyncService } from '../core/synchronization';
import { Mail } from './mail.model';

@Injectable()
export abstract class MailSyncService extends SyncService<Mail> {}
