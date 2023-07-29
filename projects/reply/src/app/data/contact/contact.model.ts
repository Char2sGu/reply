export interface Contact {
  id: string;
  name?: string;
  email: string;
  avatarUrl?: string;
  type: 'user' | 'temporary';
}
