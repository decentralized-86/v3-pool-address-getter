import React, { useState ,useRef,useEffect} from "react";
import Web3Modal from 'web3modal';
import {providers , Contract,signer} from 'ethers';
import { ContractAddress,ABI } from "../UNISWAPABI";
import { ethers } from "ethers";
const logoPath = "/uniswap-uni-logo.png";
const  PoolAddress = () =>{
    const [walletConnect, setwalletConnect] = useState(null);

  const [Connectedaddress, setConnectedAddress] = useState(null);

  const [tokenA, setTokenA] = useState("");

  const [tokenB, setTokenB] = useState("");

  const [fee, setFee] = useState("0.3");

  const [Signer, setSigner] = useState(null);

  const [poolAddress, setpoolAddress] = useState(null);

  const web3ModalRef = useRef();


  const getProviderOrSigner = async (needSigner = false) => {
    console.log("getting provider")
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
  
    const { chainId } = await web3Provider.getNetwork();
    console.log("chainId", chainId);
    const supportedChains = [1, 42161, 10, 137];
    if (!supportedChains.includes(chainId)) {
      window.alert(
        "Change the network to Mainnet, Arbitrum, Optimism, or Polygon",
      );
      throw new Error("Unsupported network");
    }
  
    if (needSigner) {
      const signer = web3Provider.getSigner();
      setSigner(signer);
      return signer;
    }
    return web3Provider;
  };
  
  const handleWalletConnect = async () => {
    try {
      const signerInstance = await getProviderOrSigner(true);
  
      const address = await signerInstance.getAddress();
  
      setConnectedAddress(address);
  
      setwalletConnect(true);
    } catch (error) {
      console.log("Got the Error " + error);
    }
  };
  
  const handleGetAddress = async () => {
    try {
      const provider = await getProviderOrSigner();
      if (!ethers.utils.isAddress(tokenA) || !ethers.utils.isAddress(tokenB)) {
        console.log("Invalid Ethereum address");
      
        return;
      }
      
      const feeAmount = fee === "0.3" ? 3000 : fee === "0.5" ? 500 : 10000;
      const factoryContract = new Contract(ContractAddress, ABI, provider);
      console.log("factory contract address"+factoryContract.address);
      console.log("tokenA"+tokenA);
      console.log("tokenB"+tokenB);
      console.log("fee"+feeAmount);
  
      const _getPoolAddress = await factoryContract.getPool(
        tokenA,
        tokenB,
        feeAmount,
      );
      
      console.log(poolAddress)
      console.log(_getPoolAddress)
      setpoolAddress(_getPoolAddress);
    } catch(error) {
          console.log("Got the error "+error)      
    }
  };

  useEffect(() => {
    if (!walletConnect) {
      
      web3ModalRef.current = new Web3Modal({
        network: "mainnet",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
  }, [walletConnect]);

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-pink-300 mx-auto w-1/4">
        <button
          className="px-4 py-2 text-white rounded-xl bg-gradient-to-r from-pink-300 to-pink-400 border-2 border-pink-300 absolute top-4 right-4"
          onClick={handleWalletConnect}
        >
          {Connectedaddress
            ? shortenAddress(Connectedaddress).toString()
            : " Connect Wallet "}
        </button>
  
        <div className="flex justify-center items-center mb-4">
          <img src={logoPath} alt="Uniswap" className="w-12 text-pink-300" />
        </div>
  
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Token A Address
          </label>
  
          <input
            type="text"
            value={tokenA}
            onChange={(e) => setTokenA(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md bg-gray-700 text-white"
          />
        </div>
  
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Token B Address
          </label>
  
          <input
            type="text"
            value={tokenB}
            onChange={(e) => setTokenB(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md bg-gray-700 text-white"
          />
        </div>
  
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Select Fee
          </label>
  
          <select
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md bg-gray-700 text-white"
          >
            <option value="0.3">0.3%</option>
  
            <option value="0.5">0.5%</option>
  
            <option value="1.0">1.0%</option>
          </select>
        </div>
        <button
          onClick={handleGetAddress}
          className="px-4 py-2 text-white rounded-xl w-full bg-gradient-to-r from-pink-300 to-pink-400"
        >
          Get Address
        </button>
  
        {/* Pool Address Display */}
        
  {poolAddress && (
    <div className="mt-4 p-3 border-2 border-pink-200 rounded-xl flex items-center justify-between shadow-md hover:shadow-lg transition-shadow duration-300 bg-gray-700">
      <div className="flex items-center space-x-1">
        <img
          src={logoPath}
          alt="Copy"
          className="w-5 h-5 cursor-pointer"
          onClick={() => navigator.clipboard.writeText(poolAddress)}
        />
        <span className="text-black font-mono text-sm font-medium">
          {shortenAddress(poolAddress)}
        </span>
      </div>
      <div className="text-xs text-gray-400 flex items-center space-x-1 cursor-pointer hover:text-pink-400 transition-colors duration-300">
        <img
          src="./copy-icon.png"
          alt="Copy Icon"
          className="w-3 h-3"
          onClick={() => navigator.clipboard.writeText(poolAddress)}
        />
      </div>
    </div>
  )
}

      </div>
    </div>
  );
    
}
export default PoolAddress;