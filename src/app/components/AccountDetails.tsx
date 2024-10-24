import React, { useState, useEffect, useCallback } from "react";
import { Account } from "../interfaces/Account";
import { ethers } from "ethers"; // Import ethers directly
import { sepolia } from "../interfaces/Chain"; // Chain config
import { sendToken } from "../wallet-utils/Transaction"; // Send token function
import Link from "next/link";

interface AccountDetailProps {
  account: Account;
}

const AccountDetails: React.FC<AccountDetailProps> = ({ account }) => {
  const [destinationAddress, setDestinationAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState<string>("Loading...");
  const [networkResponse, setNetworkResponse] = useState<{
    status: null | "pending" | "complete" | "error";
    message: string | React.ReactElement;
  }>({
    status: null,
    message: "",
  });

  // Fetch the latest balance
  const fetchData = useCallback(async () => {
    const provider = new ethers.providers.JsonRpcProvider(sepolia.rpcUrl);
    try {
      const accountBalance = await provider.getBalance(account.address);
      setBalance(formatEthFunc(ethers.utils.formatEther(accountBalance)));
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setBalance("Error fetching balance");
    }
  }, [account.address]);

  // Format balance to 2 decimal places
  function formatEthFunc(value: string, decimalPlaces: number = 2) {
    return parseFloat(value).toFixed(decimalPlaces);
  }

  // Fetch balance when the component mounts and when account changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDestinationAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDestinationAddress(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value));
  };

  // Transfer tokens and update balance on success
  const transfer = async () => {
    setNetworkResponse({
      status: "pending",
      message: "",
    });

    try {
      const { receipt } = await sendToken(
        amount,
        account.address,
        destinationAddress,
        account.privateKey
      );

      if (receipt?.status === 1) {
        setNetworkResponse({
          status: "complete",
          message: (
            <p>
              Transfer complete!{" "}
              <Link
                href={`${sepolia.blockExplorerUrl}/tx/${receipt.transactionHash}`}
                target="_blank"
                rel="noreferrer"
              >
                View transaction
              </Link>
            </p>
          ),
        });
        // Fetch updated balance after transfer completes
        fetchData();
      } else {
        console.error(`Failed to send: ${JSON.stringify(receipt)}`);
        setNetworkResponse({
          status: "error",
          message: JSON.stringify(receipt),
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      setNetworkResponse({
        status: "error",
        message: error.reason || JSON.stringify(error),
      });
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-md shadow-lg text-gray-900">
      <div className="mb-4">
        <h4 className="font-bold mb-1">Address:</h4>
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://sepolia.etherscan.io/address/${account.address}`}
          className="text-blue-600 hover:underline"
        >
          {account.address}
        </a>
        <p className="font-medium mt-2">
          Balance: <span>{balance} ETH</span>
        </p>
      </div>

      <div className="my-4">
        <label
          htmlFor="destination"
          className="block text-black font-semibold mb-1"
        >
          Destination Address:
        </label>
        <input
          type="text"
          id="destination"
          value={destinationAddress}
          onChange={handleDestinationAddressChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter destination address"
        />
      </div>

      <div className="my-4">
        <label htmlFor="amount" className="block text-black font-semibold mb-1">
          Amount (ETH):
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={handleAmountChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="0"
          step="any"
          placeholder="Enter amount"
        />
      </div>

      <button
        className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-yellow-800 shadow-lg font-medium rounded-md text-white py-2.5 mt-4 disabled:opacity-50"
        type="button"
        onClick={transfer}
        disabled={!amount || networkResponse.status === "pending"}
      >
        Send {amount} ETH
      </button>

      {networkResponse.status && (
        <div className="mt-4">
          {networkResponse.status === "pending" && (
            <p className="text-yellow-600 font-bold">Transfer is pending...🙌</p>
          )}
          {networkResponse.status === "complete" && (
            <p className="text-green-600 font-bold">{networkResponse.message}</p>
          )}
          {networkResponse.status === "error" && (
            <p className="text-red-600  font-bold">
              Error occurred while transferring tokens: {networkResponse.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountDetails;
