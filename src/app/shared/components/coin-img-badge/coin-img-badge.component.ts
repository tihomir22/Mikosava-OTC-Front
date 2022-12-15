import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-coin-img-badge',
  templateUrl: './coin-img-badge.component.html',
  styleUrls: ['./coin-img-badge.component.scss'],
})
export class CoinImgBadgeComponent {
  @Input() src: string = '';
  @Input() coinLabel: string = '';
  @Input() defaultLabel: string | 'Loading...' = '';
}
