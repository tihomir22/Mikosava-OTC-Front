import { TestBed } from '@angular/core/testing';

import { TradeResolver } from './trade.resolver';

describe('TradeResolver', () => {
  let resolver: TradeResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TradeResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
