export type ActionStatus =
  | { type: 'idle' }
  | { type: 'pending' }
  | { type: 'completed' }
  | { type: 'failed'; error: unknown };
