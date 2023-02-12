import { ethers } from 'ethers';
import ERC20 from '../../assets/ERC20.json';
import ERC721 from '../../assets/erc721.json';
export const returnERC20InstanceFromAddress = (
  address: string,
  signer: ethers.providers.JsonRpcSigner
) => {
  return new ethers.Contract(address, ERC20.abi, signer);
};

export const returnERC721InstanceFromAddress = (
  address: string,
  signer: ethers.providers.JsonRpcSigner
) => {
  return new ethers.Contract(address, ERC721.abi, signer);
};
