export interface Mailbox {
  id: string;
  name: SystemMailboxName | string;
  type: 'system' | 'user';
}

export enum SystemMailboxName {
  Inbox = 'Inbox',
  Starred = 'Starred',
  Sent = 'Sent',
  Trash = 'Trash',
  Spam = 'Spam',
  Drafts = 'Drafts',
}
