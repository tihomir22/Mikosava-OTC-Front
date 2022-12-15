import { ParseFromWeiToDecimalNumberPipe } from './parse-from-wei-to-decimal-number.pipe';

describe('ParseFromWeiToDecimalNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new ParseFromWeiToDecimalNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
