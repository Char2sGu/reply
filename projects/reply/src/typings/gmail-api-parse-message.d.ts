declare module 'gmail-api-parse-message' {
  export default function parseMessage(
    message: gapi.client.gmail.Message,
  ): ParsedMessage;

  export interface ParsedMessage {
    id: string;
    threadId: string;
    labelIds?: string[];
    snippet?: string;
    historyId?: string;
    internalDate?: number;
    attachments?: ParsedAttachment[];
    inline?: ParsedAttachment[];
    headers?: ParsedMessageHeaders;
    textPlain?: string;
    textHtml?: string;
  }

  export interface ParsedMessageHeaders {
    ['subject']?: string;
    ['from']?: string;
    ['to']?: string;
    [name: string]: string | undefined;
  }

  export interface ParsedAttachment {
    filename: string;
    mimeType: string;
    size: number;
    attachmentId: string;
    headers: ParsedAttachmentHeaders;
  }

  export interface ParsedAttachmentHeaders {
    ['content-type']?: string;
    ['content-description']?: string;
    ['content-transfer-encoding']?: string;
    ['content-id']?: string;
    [name: string]: string | undefined;
  }
}
