import { DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT, PageLimitPipe } from './page-limit.pipe';

describe('PageLimitPipe', () => {
  it('should be defined', () => {
    expect(new PageLimitPipe()).toBeDefined();
  });

  it('should return DEFAULT_PAGE_LIMIT if value is blank, undefined or null', () => {
    const pipe = new PageLimitPipe();
    expect(pipe.transform('', { type: 'param' })).toEqual(DEFAULT_PAGE_LIMIT);
    expect(pipe.transform(undefined, { type: 'param' })).toEqual(DEFAULT_PAGE_LIMIT);
    expect(pipe.transform(null, { type: 'param' })).toEqual(DEFAULT_PAGE_LIMIT);
  });

  it('should return DEFAULT_PAGE_LIMIT if value is negative', () => {
    const pipe = new PageLimitPipe();
    expect(pipe.transform('-1', { type: 'param' })).toEqual(DEFAULT_PAGE_LIMIT);
  });

  it('should return MAX_PAGE_LIMIT if value is greater than MAX_PAGE_LIMIT', () => {
    const pipe = new PageLimitPipe();
    expect(pipe.transform(`${MAX_PAGE_LIMIT}`, { type: 'param' })).toEqual(MAX_PAGE_LIMIT);
    expect(pipe.transform(`${MAX_PAGE_LIMIT + 1}`, { type: 'param' })).toEqual(MAX_PAGE_LIMIT);
  });

  it('should return the value if value is a positive numeric string', () => {
    const pipe = new PageLimitPipe();
    expect(pipe.transform('10', { type: 'param' })).toEqual(10);
  });
});
