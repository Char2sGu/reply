import { Exception } from '@/app/core/exceptions';

export class ReactiveRepositoryException extends Exception {}
export class EntityNotFoundException extends ReactiveRepositoryException {}
export class EntityDuplicateException extends ReactiveRepositoryException {}
