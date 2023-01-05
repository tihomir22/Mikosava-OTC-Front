import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IconNamesEnum } from 'ngx-bootstrap-icons';

@Component({
  selector: 'app-coin-img-badge',
  templateUrl: './coin-img-badge.component.html',
  styleUrls: ['./coin-img-badge.component.scss'],
})
export class CoinImgBadgeComponent {
  @Input() src: string = '';
  @Input() coinLabel: string = '';
  @Input() coinAddress: string = null as any;
  @Input() defaultLabel: string | 'Loading...' = '';
  @Input() readOnly = false;
  public defaultValueForLabel = 'Loading...';

  public iconNames = IconNamesEnum;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    if (this.defaultLabel == '')
      this.translate.get('COINS.NO_COIN_SELECTED').subscribe((data) => {
        this.defaultLabel = data;
      });
  }
}
