import { Wallet } from "ethers";
import * as bip39 from "bip39"; 

interface Account {
  privateKey: string;
  address: string;
  balance: string;
}

export function generateAccount(
  seedPhrase: string = "",
  index: number = 0
): { account: Account; seedPhrase: string } {
  let wallet: Wallet;

  // Generate a 24-word seed phrase if not provided
  if (seedPhrase === "") {
    seedPhrase = bip39.generateMnemonic(256);
  }

  // eslint-disable-next-line prefer-const
  wallet = seedPhrase.includes(" ")
    ? Wallet.fromMnemonic(seedPhrase, `m/44'/60'/0'/0/${index}`) // BIP-44 path for Ethereum
    : new Wallet(seedPhrase); // Create wallet directly from private key

  const { address } = wallet;
  const account = { address, privateKey: wallet.privateKey, balance: "0" };

  // Return the seed phrase only if it's a mnemonic
  return { account, seedPhrase: seedPhrase.includes(" ") ? seedPhrase : "" };
}
