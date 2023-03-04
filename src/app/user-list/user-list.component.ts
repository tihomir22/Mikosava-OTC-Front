import { Component } from '@angular/core';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import { ProviderService } from '../shared/services/provider.service';
import MikosavaABI from '../../assets/MikosavaOTC.json';
import {
  MikosavaNFTTRade,
  MikosavaTrade,
} from '../shared/models/MikosavaTrade';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { Router } from '@angular/router';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { FormBuilder, FormGroup } from '@angular/forms';
import { getStatus } from '../utils/utils';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [
    {
      provide: BsDropdownConfig,
      useValue: { isAnimated: true, autoClose: true },
    },
  ],
})
export class UserListComponent {
  public trades: Array<MikosavaTrade> = [];
  public nftTrades: Array<MikosavaNFTTRade> = [];
  public iconNames = IconNamesEnum;
  public tradesLoaded = false;
  public form!: FormGroup;

  constructor(
    private provider: ProviderService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      activeType: ['erc20', []],
    });
  }

  ngOnInit(): void {
    this.provider.getAccountStream().subscribe((data) => {
      this.tradesLoaded = false;
      this.loadMyTrades();
    });
  }

  public async loadMyTrades() {
    const [provider, signer, account, foundActiveNetwork] =
      await this.provider.getTools();
    const otcContract = new ethers.Contract(
      foundActiveNetwork.contracts.OTC_PROXY,
      MikosavaABI.abi,
      signer
    );
    this.trades = (await otcContract['fetchMyCoinTrades']()).map(
      (entry: MikosavaTrade) => {
        let clonedTrade = { ...entry };
        clonedTrade.sortNo = Number(clonedTrade.tradeId);
        return clonedTrade;
      }
    );
    this.nftTrades = (await otcContract['fetchMyNftTrades']()).map(
      (entry: MikosavaNFTTRade) => {
        let clonedTrade = { ...entry };
        clonedTrade.sortNo = Number(clonedTrade.tradeId);
        return clonedTrade;
      }
    );
    this.tradesLoaded = true;
  }
}
