import { TestBed } from '@angular/core/testing';

import { CloseTradeNftResolver } from './close-trade-nft.resolver';

describe('CloseTradeNftResolver', () => {
  let resolver: CloseTradeNftResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CloseTradeNftResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
