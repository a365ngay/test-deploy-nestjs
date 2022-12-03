import { PageIndexPipe } from './page-index.pipe';

describe('PageIndexPipe', () => {
  it('should be defined', () => {
    expect(new PageIndexPipe()).toBeDefined();
  });

  it('should return 0 if value is blank, undefined or null', () => {
    const pipe = new PageIndexPipe();
    expect(pipe.transform('', { type: 'param' })).toEqual(0);
    expect(pipe.transform(undefined, { type: 'param' })).toEqual(0);
    expect(pipe.transform(null, { type: 'param' })).toEqual(0);
  });

  it('should return 0 if value is negative', () => {
    const pipe = new PageIndexPipe();
    expect(pipe.transform('-1', { type: 'param' })).toEqual(0);
  });

  it('should convert from string to int for positive integer', () => {
    const pipe = new PageIndexPipe();
    expect(pipe.transform('5', { type: 'param' })).toEqual(5);
  });
});
