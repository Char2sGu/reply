import { Pipe, PipeTransform } from '@angular/core';

import { Mail } from './mail.model';

@Pipe({
  name: 'mailSnippet',
  standalone: true,
})
export class MailSnippetPipe implements PipeTransform {
  transform(mail: Mail): string {
    return mail.snippet ?? this.generateSnippetFromContent(mail.content);
  }

  private generateSnippetFromContent(content: string): string {
    return content.replace(/\s+/gu, ' ').slice(0, 100);
  }
}
