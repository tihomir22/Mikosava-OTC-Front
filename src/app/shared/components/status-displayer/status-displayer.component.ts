import { Component, Input } from '@angular/core';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { getStatus } from 'src/app/utils/utils';
import { MikosavaTrade } from '../../models/MikosavaTrade';

@Component({
  selector: 'app-status-displayer',
  templateUrl: './status-displayer.component.html',
  styleUrls: ['./status-displayer.component.scss'],
})
export class StatusDisplayerComponent {
  @Input() trade!: MikosavaTrade;
  public iconNames = IconNamesEnum;

  public getStatus(trade: MikosavaTrade) {
    return getStatus(trade);
  }
}
