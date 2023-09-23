import {
  MikosavaNFTTRade,
  MikosavaTrade,
} from '../shared/models/MikosavaTrade';
import Identicon, { IdenticonOptions } from 'identicon.js';
import { ListTradeItem } from '../shared/components/list-trades/list-trades.component';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ethers } from 'ethers';

export const truncateAddress = (address: string, length = 5) => {
  let first = address.substring(0, length);
  let last = address.substring(address.length - length);
  return first + '...' + last;
};

export const copyClipboard = (val: string) => {
  const selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.left = '0';
  selBox.style.top = '0';
  selBox.style.opacity = '0';
  selBox.value = val;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
};

export const isExpired = (
  trade: MikosavaTrade | ListTradeItem | MikosavaNFTTRade
) => {
  return +new Date() * 1000 > +trade.validUntil && +trade.validUntil != 0;
};

export const getStatus = (
  trade: MikosavaTrade | ListTradeItem | MikosavaNFTTRade
) => {
  const expired = isExpired(trade);
  if (trade.cancelled) {
    return 'Cancelled';
  } else if (trade.sold) {
    return 'Sold';
  } else if (expired) {
    return 'Expired';
  }
  return 'Open';
};

export const generateIdenticonB64 = (
  text: string,
  options: IdenticonOptions = {
    size: 64,
    background: [255, 255, 255, 255],
    margin: 0.2,
  }
) => {
  if (!text) return '';
  return new Identicon(text, options).toString();
};

export const isEmptyAddress = (address: string) => {
  const emptyAddress = /^0x0+$/.test(address);
  return emptyAddress;
};

export const isAddressValidator = (control: AbstractControl) => {
  const address = control.value;
  if (!ethers.utils.isAddress(address)) {
    return { invalidEthereumAddress: true };
  }
  return null;
};
