"use client";
import React, { useState } from "react";
import { generateAccount } from "../wallet-utils/AccountUtils";
import AccountDetails from "./AccountDetails";
import TransactionDetails from "./TransactionDetails";

interface Account {
  privateKey: string;
  address: string;
  balance: string;
}

const AccountCreate: React.FC = () => {
  const [showInput, setShowInput] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState("");
  const [account, setAccount] = useState<Account | null>(null);

  const createAccount = () => {
    const account = generateAccount(); // account object: address, privateKey, seedPhrase, balance
    console.log("Account created!", account);
    setSeedPhrase(account.seedPhrase);
    setAccount(account.account);
  };

  const showInputFunction = () => {
    setShowInput(true);
  };

  const handleSeedPhraseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeedPhrase(e.target.value);
  };

  const handleSeedPhraseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const account = generateAccount(seedPhrase);
    console.log("Recovery", account);
    setSeedPhrase(account.seedPhrase);
    setAccount(account.account);
  };

  return (
    <div className="max-w-lg mx-auto bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-8 space-y-8 text-black dark:text-white">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600">
        Prototype Wallet on Sepolia
      </h2>

      <div className="flex justify-center gap-4">
        <button
          onClick={createAccount}
          className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 hover:bg-gradient-to-br focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg rounded-md px-6 py-3 font-semibold transition-all duration-300"
        >
          Create Account
        </button>
        <button
          onClick={showInputFunction}
          className="text-white bg-gradient-to-r from-green-400 to-teal-500 hover:bg-gradient-to-br focus:outline-none focus:ring-2 focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg rounded-md px-6 py-3 font-semibold transition-all duration-300"
        >
          Recover Account
        </button>
      </div>

      {showInput && (
        <form onSubmit={handleSeedPhraseSubmit} className="flex gap-2">
          <input
            type="text"
            value={seedPhrase}
            onChange={handleSeedPhraseChange}
            className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your seed phrase"
          />
          <button
            type="submit"
            className="text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-gradient-to-br focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg rounded-md px-4 py-2 font-semibold transition-all duration-300"
          >
            Submit
          </button>
        </form>
      )}

      <div className="space-y-2">
        <div>
          <p className="text-lg font-semibold">A/C Address:</p>
          <span className="text-gray-700 dark:text-gray-300">
            {account?.address || "No account created yet"}
          </span>
        </div>

        <div>
          <p className="text-lg font-semibold">Your 12 Phrase Mnemonic:</p>
          <span className="text-gray-700 dark:text-gray-300">
            {seedPhrase || "No seed phrase available"}
          </span>
        </div>
      </div>

      <hr className="border-gray-300 dark:border-gray-700" />

      {account && (
        <>
          <AccountDetails account={account} />
          <TransactionDetails address={account.address} />
        </>
      )}
    </div>
  );
};

export default AccountCreate;
