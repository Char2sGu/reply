import { Injectable } from '@angular/core';

import { SyncService } from '../core/synchronization';
import { Contact } from './contact.model';

@Injectable()
export abstract class ContactSyncService extends SyncService<Contact> {}
