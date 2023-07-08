export interface Mailbox {
  id: string;
  name: BuiltInMailboxName | string;
  type: 'system' | 'user' | 'virtual';
}

export enum BuiltInMailboxName {
  Inbox = 'Inbox',
  Starred = 'Starred',
  Sent = 'Sent',
  Trash = 'Trash',
  Spam = 'Spam',
  Drafts = 'Drafts',
}
