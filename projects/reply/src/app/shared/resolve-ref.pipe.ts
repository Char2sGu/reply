import { Pipe, PipeTransform } from '@angular/core';

import { EntityCollection } from '../state/shared/entity-collection';

@Pipe({
  name: 'resolveRef',
  standalone: true,
})
export class ResolveRefPipe implements PipeTransform {
  transform<TargetEntity>(
    id: string,
    collection: EntityCollection<TargetEntity>,
  ): TargetEntity;
  transform<TargetEntity>(
    ids: string[],
    collection: EntityCollection<TargetEntity>,
  ): TargetEntity[];
  transform<TargetEntity>(
    value: string | string[],
    collection: EntityCollection<TargetEntity>,
  ): TargetEntity | TargetEntity[] {
    if (value instanceof Array)
      return collection.query((e) => value.includes(collection.identify(e)));
    return collection.retrieve(value);
  }
}
