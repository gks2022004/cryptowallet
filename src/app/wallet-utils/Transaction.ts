// import { JsonRpcProvider } from "ethers/providers"; // Import providers
// import { parseEther } from "ethers/utils"; // Import utils
import { Wallet,ethers } from "ethers"; // Import Wallet directly
import { CHAINS_CONFIG, sepolia } from "../interfaces/Chain";

export async function sendToken(
  amount: number,
  from: string,
  to: string,
  privateKey: string
) {
  try {
    const chain = CHAINS_CONFIG[sepolia.chainId];

    // Create a new JSON RPC provider for the selected chain
    const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrl);

    // Initialize wallet with the private key and provider
    const wallet = new Wallet(privateKey, provider);

    // Create the transaction object
    const tx = {
      to,
      value: ethers.utils.parseEther(amount.toString()), // Convert amount to wei
      gasLimit: 21000, // Standard gas limit for sending ETH
    };

    // Send the transaction
    const transaction = await wallet.sendTransaction(tx);

    // Wait for the transaction to be mined
    const receipt = await transaction.wait();

    console.log("Transaction successful:", receipt);

    return { transaction, receipt };
  } catch (error) {
    console.error("Transaction failed:", error);
    throw new Error("Failed to send transaction.");
  }
}
