export const status = (s: ActionStatus): ActionStatus => s;

export type ActionStatus =
  | { type: 'idle' }
  | { type: 'pending' }
  | { type: 'completed' }
  | { type: 'failed'; error: unknown };
