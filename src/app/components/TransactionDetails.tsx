import React, { useEffect, useState } from "react";
import axios from "axios";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  isError: string;
  timeStamp: string;
}

interface TransactionTableProps {
  address: string;
}

// have to change it for the sepolia instead of mumbai 
const MUMBAI_API_KEY = "<YOUR-API-KEY>";
const MUMBAI_API_BASE_URL = "https://api-testnet.polygonscan.com/api";

const TransactionDetails: React.FC<TransactionTableProps> = ({ address }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const endpoint = `?module=account&action=txlist&address=${address}&page=1&offset=10&sort=desc&apikey=${MUMBAI_API_KEY}`;
      const url = `${MUMBAI_API_BASE_URL}${endpoint}`;

      try {
        const response = await axios.get(url);
        const transactionData: Transaction[] = response.data.result;
        setTransactions(transactionData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [address]);

  return (


    <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-100">
      <tr>
        <th className="py-2 px-4 text-black">No.</th>
        <th className="py-2 px-4 text-black">Hash</th>
        <th className="py-2 px-4 text-black">From</th>
        <th className="py-2 px-4 text-black">To</th>
        <th className="py-2 px-4 text-black">Status</th>
        <th className="py-2 px-4 text-black">Timestamp</th>
      </tr>
    </thead>
    <tbody>
      {transactions.map((transaction, index) => (
        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
          <td className="py-2 px-4">{index + 1}</td>
          <td className="py-2 px-4">
            {`${transaction.hash.slice(0, 5)}...${transaction.hash.slice(-3)}`}
          </td>
          <td className="py-2 px-4">
            {`${transaction.from.slice(0, 5)}...${transaction.from.slice(-3)}`}
          </td>
          <td className="py-2 px-4">
            {`${transaction.to.slice(0, 5)}...${transaction.to.slice(-3)}`}
          </td>
          <td className="py-2 px-4">
            {transaction.isError === '0' ? '✅' : '❌'}
          </td>
          <td className="py-2 px-4">{transaction.timeStamp}</td>
        </tr>
      ))}
    </tbody>
  </table>
  );
};

export default TransactionDetails;

