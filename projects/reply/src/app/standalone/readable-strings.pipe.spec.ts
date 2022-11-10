import { ReadableStringsPipe } from './readable-strings.pipe';

describe('ReadableStringsPipe', () => {
  let pipe: ReadableStringsPipe;

  beforeEach(() => {
    pipe = new ReadableStringsPipe();
  });

  it('should work with 1 string', async () => {
    expect(pipe.transform(['one'])).toBe('one');
  });

  it('should work with 2 strings', async () => {
    expect(pipe.transform(['one', 'two'])).toBe('one and two');
  });

  it('should work with 3 or more strings', async () => {
    expect(pipe.transform(['one', 'two', 'three'])).toBe('one, two, and three');
  });
});
