import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { MikosavaNft } from '../list-nfts/list-nfts.component';

@Component({
  selector: 'app-nft-card',
  templateUrl: './nft-card.component.html',
  styleUrls: ['./nft-card.component.scss'],
})
export class NftCardComponent {
  public iconNames = IconNamesEnum;
  @Input() nft!: MikosavaNft;
  @Output() emptyClick = new EventEmitter<void>();
}
