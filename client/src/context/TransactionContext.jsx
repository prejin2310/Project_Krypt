import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {

 const [currentAccount, setCurrentAccount] = useState("");
 const [formData, setFormData] = useState({addressTo:'',amount:'',keyword:'',message:''});
 const [isLoading,setIsLoading]=useState(false);
 const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));


 const handleChange=(e,name) => {
    setFormData((prevState) => ({ ...prevState,[name]: e.target.value}));
 }

 const checkIfWalletIsConnected = async () => {
    try{
        if(!ethereum) return alert("Please install metamask");
    const accounts=await ethereum.request({method: 'eth_accounts'});
    if(accounts.length){
        setCurrentAccount(accounts[0]);
        //getAllTransactions();
    } else {
        console.log("No Accounts Found");
    }

    }catch (error){
        console.log(error);
        throw new Error("No ethereum object.")
    }
 }

 const connectWallet=async () => {
    try {
        if(!ethereum) return alert("Please install metamask");
        const account = await ethereum.request({method: 'eth_requestAccounts'});
        setCurrentAccount(account[0]);
    } catch (error) {
        console.log(error);
        throw new Error("No ethereum object.")
 }
}

const sendTransaction=async () => {
    try {
        if(!ethereum) return alert("Please install metamask");
        const {addressTo,amount,keyword,message}=formData;
        const transactionsContract= getEthereumContract();
        const parsedAmount=ethers.utils.parseEther(amount);

        await ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
                from:currentAccount,
                to:addressTo,
                gas: '0x5208' ,//2100 gwei
                value: parsedAmount._hex, //0.00001
            }]
        });
        //to store transaction

        const transactionHash=await transactionsContract.addToBlockchain(addressTo,parsedAmount,message,keyword);
        setIsLoading(true);
        console.log(`Loading -${transactionHash.hash}`);
        await transactionHash.wait();

        setIsLoading(flase);
        console.log(`Sucess -${transactionHash.hash}`);

        const transactionCount=await transactionsContract.getTransactionCount();
        setTransactionCount(transactionCount.toNumber());

    } catch (error) {
        console.log(error);
        throw new Error("No ethereum object.")
    }
}

useEffect(() => {
    checkIfWalletIsConnected();
},[]);

return (
    <TransactionContext.Provider value={{connectWallet,currentAccount,formData,setFormData,handleChange,sendTransaction}}>
        {children}
    </TransactionContext.Provider>
);
}