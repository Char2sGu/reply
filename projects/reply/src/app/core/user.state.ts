import { Contact } from '../data/contact/contact.model';
import { StateInjectionToken } from './state';

export const USER = new StateInjectionToken<Contact | null>('USER', null);
