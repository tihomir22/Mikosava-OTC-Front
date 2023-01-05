import { Component, Input } from '@angular/core';
import { isExpired } from 'src/app/utils/utils';
import { MikosavaTrade } from '../../models/MikosavaTrade';

@Component({
  selector: 'app-valid-until-progressbar',
  templateUrl: './valid-until-progressbar.component.html',
  styleUrls: ['./valid-until-progressbar.component.scss'],
})
export class ValidUntilProgressbarComponent {
  @Input() public set trade(data: MikosavaTrade) {
    if (data) {
      this._trade = data;
      this.hasPassed = isExpired(this._trade);
      if (this.hasPassed) this.now = 5;
    }
  }
  public get trade() {
    return this._trade;
  }
  public hasPassed = false;
  private _trade!: MikosavaTrade;
  public max = 100;
  public min = 0;
  public now = 75;
  constructor() {}
}
