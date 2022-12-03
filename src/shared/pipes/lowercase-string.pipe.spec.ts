import { LowercaseStringPipe } from './lowercase-string.pipe';

describe('LowercaseStringPipe', () => {
  it('should be defined', () => {
    expect(new LowercaseStringPipe()).toBeDefined();
  });

  it('should return empty if value is blank, undefined or null', () => {
    const pipe = new LowercaseStringPipe();
    expect(pipe.transform('', { type: 'param' })).toEqual('');
    expect(pipe.transform(undefined, { type: 'param' })).toEqual('');
    expect(pipe.transform(null, { type: 'param' })).toEqual('');
  });

  it('should return lowercase if value is uppercase', () => {
    const pipe = new LowercaseStringPipe();
    expect(pipe.transform('ABCDEF 012345', { type: 'param' })).toEqual('abcdef 012345');
  });

  it('should return lowercase if value is mixed case', () => {
    const pipe = new LowercaseStringPipe();
    expect(pipe.transform('AbCdEf 012345', { type: 'param' })).toEqual('abcdef 012345');
  });

  it('should convert from string to int for positive integer', () => {
    const pipe = new LowercaseStringPipe();
    expect(pipe.transform('abcdef 012345', { type: 'param' })).toEqual('abcdef 012345');
  });
});
