import { MikosavaTrade } from '../shared/models/MikosavaTrade';

export const truncateAddress = (address: string) => {
  const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
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

export const isExpired = (trade: MikosavaTrade) => {
  return +new Date() * 1000 > +trade.validUntil && +trade.validUntil != 0;
};

export const getStatus = (trade: MikosavaTrade) => {
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
