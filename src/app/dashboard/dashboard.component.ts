import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import { ProviderService } from '../shared/services/provider.service';
import MikosavaABI from '../../assets/MikosavaOTC.json';
import {
  MikosavaNFTTRade,
  MikosavaTrade,
} from '../shared/models/MikosavaTrade';
import { IconNamesEnum } from 'ngx-bootstrap-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public form!: FormGroup;
  public tradesLoaded = false;
  public trades: Array<MikosavaTrade> = [];
  public nftTrades: Array<MikosavaNFTTRade> = [];
  public iconNames = IconNamesEnum;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private provider: ProviderService
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
    this.trades = (await otcContract['fetchAllCoinTrades']()).map(
      (entry: MikosavaTrade) => {
        let clonedTrade = { ...entry };
        clonedTrade.sortNo = Number(clonedTrade.tradeId);
        return clonedTrade;
      }
    );
    // this.nftTrades = (await otcContract['fetchAllNftTrades']()).map(
    //   (entry: MikosavaNFTTRade) => {
    //     let clonedTrade = { ...entry };
    //     clonedTrade.sortNo = Number(clonedTrade.tradeId);
    //     return clonedTrade;
    //   }
    // );
    this.tradesLoaded = true;
  }

  public redirectToTrade() {
    this.router.navigate(['/swap']);
  }
}
