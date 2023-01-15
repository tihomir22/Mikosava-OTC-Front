import { Observable } from 'rxjs';

export interface CoingeckoCoin {
  id: string;
  symbol: string;
  name: string;
  decimals?: BigInt;
  platforms: any;
  image?: string;
  amountOfToken$?: any;
}
