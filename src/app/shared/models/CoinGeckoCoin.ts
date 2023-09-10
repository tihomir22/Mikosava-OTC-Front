import { Observable } from 'rxjs';

export interface CoingeckoCoin {
  id: string;
  symbol: string;
  name: string;
  decimals?: BigInt;
  address: string;
  image?: string;
  amountOfToken$?: any;
}
