import { MikosavaTrade } from '../shared/models/MikosavaTrade';
import Identicon, { IdenticonOptions } from 'identicon.js';
import { ListTradeItem } from '../shared/components/list-trades/list-trades.component';

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

export const isExpired = (trade: MikosavaTrade | ListTradeItem) => {
  return +new Date() * 1000 > +trade.validUntil && +trade.validUntil != 0;
};

export const getStatus = (trade: MikosavaTrade | ListTradeItem) => {
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
  return new Identicon(text, options).toString();
};
