import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
 const checkIfWalletIsConnected = async () => {
    if(!ethereum) return alert("Please install metamask");
    const accounts=await ethereum.request({method: 'eth_accounts'});
    console.log(accounts);
 }
useEffect(() => {
    checkIfWalletIsConnected();
},[]);

return (
    <TransactionContext.Provider value={{value: 'test'}}>
        {children}
    </TransactionContext.Provider>
);
}