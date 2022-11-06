import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatarUrlDefault',
})
export class AvatarUrlDefaultPipe implements PipeTransform {
  transform(value?: string, ...args: unknown[]): string {
    return value ?? 'assets/avatar-express.png';
  }
}
