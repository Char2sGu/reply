/**
 * {@link Exception Exceptions} are errors that are expected to be caught or
 * handled. Exceptions must be derived to throw.
 *
 * In the other hand, `{@link Error Errors}` are critical errors that should
 * terminate the application.
 */
export abstract class Exception extends Error {
  override readonly name = this.constructor.name;
}
