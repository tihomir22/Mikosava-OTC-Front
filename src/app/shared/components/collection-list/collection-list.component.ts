import { Component, EventEmitter, Input, Output } from '@angular/core';
import { interval } from 'rxjs';
import { GroupedNft, MikosavaNft } from '../list-nfts/list-nfts.component';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss'],
})
export class CollectionListComponent {
  public keys = Object.keys;
  @Input() groupedNft!: GroupedNft;
  @Input() selectedKeys?: Array<string>;
  @Input() selectedNft?: MikosavaNft;
  @Output() selectNft = new EventEmitter<MikosavaNft>();
  constructor() {}
}
