import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsModalService } from 'ngx-bootstrap/modal';
import { State } from 'src/app/reducers';
import { CoingeckoCoin } from '../../models/CoinGeckoCoin';
import { ListCoinsComponent } from '../list-coins/list-coins.component';
import * as CoinsActions from '../../../actions/coins.actions';
import { interval, Observable } from 'rxjs';
import { ProviderService } from '../../services/provider.service';
import { ethers } from 'ethers';
import MikosavaABI from '../../../../assets/MikosavaOTC.json';
import ERC20 from '../../../../assets/ERC20.json';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  public ACoin: Observable<CoingeckoCoin> = this.store.select(
    (store) => store.selectCoinA
  );
  public BCoin: Observable<CoingeckoCoin> = this.store.select(
    (store) => store.selectCoinB
  );

  public amountA: number = 0;
  public amountB: number = 0;

  constructor(
    private modalService: BsModalService,
    private store: Store<State>
  ) {
    interval(1000).subscribe(async (data) => {
      const provider = await ProviderService.getWebProvider(false);
      const signer = await provider.getSigner();
      const otcContract = new ethers.Contract(
        '0x89f0796BB639132bBB6534CABC07a7Ce8a4BBdb4',
        MikosavaABI.abi,
        signer
      );
      let listTrades = await otcContract['fetchMyCoinTrades']();
      console.log(listTrades);
    });
  }

  selectCoin(whichOne: 'A' | 'B') {
    let bsModalRef = this.modalService.show(ListCoinsComponent, {
      class: 'modal-dialog-centered',
    });
    if (bsModalRef.content) {
      bsModalRef.content.widthList = 550;
      bsModalRef.content.heightList = 650;
      bsModalRef.content.selectCoin.subscribe((coin) => {
        this.store.dispatch(
          whichOne == 'A'
            ? CoinsActions.selectCoinA({ selectACoin: coin })
            : CoinsActions.selectCoinB({ selectBCoin: coin })
        );
        bsModalRef.hide();
      });
    }
  }

  public async openTrade() {
    const provider = await ProviderService.getWebProvider(false);
    const signer = await provider.getSigner();

    const coinAContract = new ethers.Contract(
      '0x45836780551ef4819320cfc6288ED947Afb1949E',
      ERC20.abi,
      signer
    );

    const coinBContract = new ethers.Contract(
      '0xa6ba18F1A2318158709b232898Fba3A5c4e2c5D5',
      ERC20.abi,
      signer
    );

    const otcContract = new ethers.Contract(
      '0x89f0796BB639132bBB6534CABC07a7Ce8a4BBdb4',
      MikosavaABI.abi,
      signer
    );

    const decimals = await coinAContract['decimals']();
    const decimalsCoinB = await coinBContract['decimals']();
    const name = await coinAContract['name']();
    const symbol = await coinAContract['symbol']();
    const balanceOf = await coinAContract['balanceOf'](
      provider.getSigner().getAddress()
    );

    let amountParsedWithFee = BigInt(
      this.amountA * 10 ** decimals +
        (this.amountA * 10 ** decimals) / Number(1000)
    );

    let amountParsedB = BigInt(this.amountB * 10 ** decimalsCoinB);

    await coinAContract['approve'](
      otcContract.address,
      amountParsedWithFee.toString()
    );

    let trade = await otcContract['createOTCCPosition'](
      coinAContract.address,
      coinBContract.address,
      BigInt(this.amountA * 10 ** decimals).toString(),
      amountParsedB.toString(),
      0
    );

    let listTrades = await otcContract['fetchMyCoinTrades']();
    console.log(listTrades);
  }
}
