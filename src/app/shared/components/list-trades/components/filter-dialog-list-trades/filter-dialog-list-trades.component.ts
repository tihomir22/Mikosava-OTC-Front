import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IdenticonOptions } from 'identicon.js';
import { interval } from 'rxjs';
import { Account } from 'src/app/reducers';
import { ProviderService } from 'src/app/shared/services/provider.service';
import {
  generateIdenticonB64,
  isEmptyAddress,
  truncateAddress,
} from 'src/app/utils/utils';

export interface FiltersDialogListTrades {
  sellerAddress: string;
  buyerAddress: string;
  status: string;
  sellingTokenAddress: string;
  buyingTokenAddress: string;
}

@Component({
  selector: 'app-filter-dialog-list-trades',
  templateUrl: './filter-dialog-list-trades.component.html',
  styleUrls: ['./filter-dialog-list-trades.component.scss'],
})
export class FilterDialogListTradesComponent {
  @Input() sellerAddresees: string[] = [];
  @Input() buyerAddresses: string[] = [];
  @Input() statuses: Array<'Cancelled' | 'Sold' | 'Expired' | 'Open'> = [];
  @Input() tokenAddressesSell: string[] = [];
  @Input() tokenAddressesBuy: string[] = [];
  public form: FormGroup;
  public isEmptyAddress = isEmptyAddress;
  public transformToIdenticoin = generateIdenticonB64;
  public truncate = truncateAddress;

  public options: IdenticonOptions = {
    size: 40,
    background: [255, 255, 255, 0],
    margin: 0.2,
  };
  private account!: Account;
  private EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

  @Output() onApplyFilter = new EventEmitter<FiltersDialogListTrades>();

  constructor(private fb: FormBuilder, private provider: ProviderService) {
    this.form = this.fb.group({
      sellerAddress: [null],
      buyerAddress: [null],
      status: [null],
      sellingTokenAddress: [null],
      buyingTokenAddress: [null],
      selectMineSellerAddress: [false, []],
      selectWithoutBuyer: [false, []],
    });
    this.provider.getAccountStream().subscribe((data) => {
      this.account = data;
    });

    this.form.get('selectMineSellerAddress')?.valueChanges.subscribe((data) => {
      if (!!data) {
        this.form.get('sellerAddress')?.disable();
        this.form.get('sellerAddress')?.patchValue(this.account.address);
      } else {
        this.form.get('sellerAddress')?.enable();
        this.form.get('sellerAddress')?.patchValue(null);
      }
    });

    this.form.get('selectWithoutBuyer')?.valueChanges.subscribe((data) => {
      if (!!data) {
        this.form.get('buyerAddress')?.disable();
        this.form.get('buyerAddress')?.patchValue(this.EMPTY_ADDRESS);
      } else {
        this.form.get('buyerAddress')?.enable();
        this.form.get('buyerAddress')?.patchValue(null);
      }
    });
  }


  public applyFilter() {
    this.onApplyFilter.emit({
      sellerAddress: this.form.getRawValue().sellerAddress,
      buyerAddress: this.form.getRawValue().buyerAddress,
      status: this.form.getRawValue().status,
      sellingTokenAddress: this.form.getRawValue().sellingTokenAddress,
      buyingTokenAddress: this.form.getRawValue().buyingTokenAddress,
    });
  }
}
