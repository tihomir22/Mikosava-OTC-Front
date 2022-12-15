import { ethers } from 'ethers';
import ERC20 from '../../assets/ERC20.json';
export const returnERC20InstanceFromAddress = (
  address: string,
  signer: ethers.providers.JsonRpcSigner
) => {
  return new ethers.Contract(address, ERC20.abi, signer);
};
