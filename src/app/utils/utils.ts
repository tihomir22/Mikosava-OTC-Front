import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { State } from '../reducers';
import { ProviderService } from '../shared/services/provider.service';
import { getNetwork } from './chains';

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

export const getTools = async (store: Store<State>) => {
  const provider = await ProviderService.getWebProvider(false);
  const signer = await provider.getSigner();
  const account = await firstValueFrom(
    store.select((storeParam) => storeParam.account)
  );
  let foundActiveNetwork = getNetwork(account.chainIdConnect);
  return [provider, signer, account, foundActiveNetwork as any];
};
