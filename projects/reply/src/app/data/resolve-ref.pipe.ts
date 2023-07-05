import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

import { ReactiveRepository } from '../core/reactive-repository';

@Pipe({
  name: 'resolveRef',
  standalone: true,
})
export class ResolveRefPipe implements PipeTransform {
  transform<TargetEntity>(
    id: string,
    targetRepo: ReactiveRepository<TargetEntity>,
  ): Observable<TargetEntity>;
  transform<TargetEntity>(
    ids: string[],
    targetRepo: ReactiveRepository<TargetEntity>,
  ): Observable<TargetEntity[]>;
  transform<TargetEntity>(
    value: string | string[],
    targetRepo: ReactiveRepository<TargetEntity>,
  ): Observable<TargetEntity> | Observable<TargetEntity[]> {
    if (value instanceof Array)
      return targetRepo.query((e) => value.includes(targetRepo.identify(e)));
    return targetRepo.retrieve(value);
  }
}
