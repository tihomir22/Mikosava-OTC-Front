import { Observable } from 'rxjs';

export interface CoingeckoCoin {
  id: string;
  symbol: string;
  name: string;
  platforms: any;
  imageSrc$?: Observable<any>;
}
