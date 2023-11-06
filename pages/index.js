// import required modules
// the essential modules to interact with frontend are below imported.
// ethers is the core module that makes RPC calls using any wallet provider like Metamask which is esssential to interact with Smart Contract
import { ethers } from "ethers";
// A single Web3 / Ethereum provider solution for all Wallets
import Web3Modal from "web3modal";
// yet another module used to provide rpc details by default from the wallet connected
import WalletConnectProvider from "@walletconnect/web3-provider";
// react hooks for setting and changing states of variables
import { useEffect, useState } from 'react';
import { TagsInput } from "react-tag-input-component";

export default function Home() {
  // env variables are initalised
  // contractAddress is deployed smart contract addressed 
  const contractAddress = process.env.CONTRACT_ADDRESS
  // application binary interface is something that defines structure of smart contract deployed.
  const abi = process.env.ABI

  // hooks for required variables
  const [provider, setProvider] = useState();

  // the value entered in the input field is stored in the below variable
  const [enteredOrg, setEnteredOrg] = useState();
  const [amount, setAmount] = useState();

  const [enteredName, setEnteredName] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");

  const [stakeHolderAddress, setStakeHolderAddress] = useState("");
  const [stakeHolderRole, setStakeHolderRole] = useState("Founder");
  const [stakeHolderDeadline, setStakeHolderDeadline] = useState("");
  const [whitelisted, setWhitelisted] = useState();

  // the variable is used to invoke loader
  const [storeLoader, setStoreLoader] = useState(false)
  const [claimLoader, setClaimLoader] = useState(false)
  const [stakeholderLoader, setStakeholderLoader] = useState(false)

  async function initWallet() {
    try {
      // check if any wallet provider is installed. i.e metamask xdcpay etc
      if (typeof window.ethereum === 'undefined') {
        console.log("Please install wallet.")
        alert("Please install wallet.")
        return
      }
      else {
        // raise a request for the provider to connect the account to our website
        const web3ModalVar = new Web3Modal({
          cacheProvider: true,
          providerOptions: {
            walletconnect: {
              package: WalletConnectProvider,
            },
          },
        });

        const instanceVar = await web3ModalVar.connect();
        const providerVar = new ethers.providers.Web3Provider(instanceVar);
        setProvider(providerVar)
        return
      }

    } catch (error) {
      console.log(error)
      return
    }
  }

  async function claimToken() {
    try {
      setClaimLoader(true)
      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, provider);
      const contractWithSigner = smartContract.connect(signer);

      // interact with the methods in smart contract as it's a write operation, we need to invoke the transaction using .wait()
      const writeNumTX = await contractWithSigner.claimToken(Number(enteredOrg), ethers.utils.parseEther(amount));
      const response = await writeNumTX.wait()
      console.log(response)
      setClaimLoader(false)
      setEnteredOrg("")
      setAmount("")

      alert(`Tokens claimed successfully`)
      return

    } catch (error) {
      alert(error.message)
      console.log(error.message)
      setClaimLoader(false)
      return
    }
  }

  async function addNewOrganization() {
    try {
      setStoreLoader(true)
      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, provider);
      const contractWithSigner = smartContract.connect(signer);

      // interact with the methods in smart contract as it's a write operation, we need to invoke the transaction using .wait()
      const writeNumTX = await contractWithSigner.addOrganization(enteredName, tokenName, tokenSymbol);
      const response = await writeNumTX.wait()
      console.log(response)
      setStoreLoader(false)

      alert(`Organization created successfully`)
      setEnteredName("");
      setTokenName("");
      setTokenSymbol("");
      return

    } catch (error) {
      alert(error)
      console.log(error)
      setStoreLoader(false)
      return
    }
  }

  async function addStakeHolder() {
    const newStakeHolder = {
      stakeHolder: stakeHolderAddress,
      role: stakeHolderRole,
      whitelisted: whitelisted === "on" ? true : false,
      unlockedTime: Number(Date.parse(stakeHolderDeadline)) / 1000,
    }
    // setStakeHolders([...stakeHolders, newStakeHolder])
    console.log(newStakeHolder)
    try {
      setStakeholderLoader(true)
      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, provider);
      const contractWithSigner = smartContract.connect(signer);

      // interact with the methods in smart contract as it's a write operation, we need to invoke the transaction using .wait()
      const writeNumTX = await contractWithSigner.addStakeHolder(newStakeHolder, enteredOrg);
      const response = await writeNumTX.wait()
      console.log(response)
      setStakeholderLoader(false)

      alert(`Stakeholder added successfully`)
      return

    } catch (error) {
      alert(error)
      console.log(error)
      setStakeholderLoader(false)
      return
    }
  }

  useEffect(() => {
    initWallet();
  }, [])


  return (
    <div className='m-6 space-y-4'>
      <h1 className="text-gray-700 text-3xl font-bold">
        Vest Dapp
      </h1>

      <h3>This contract allows you to create organizations with stakeholders (You can whitelist some stakeholders to claim tokens)</h3>
      <hr></hr>

      <div className="grid">
        <span className="mb-1">Enter Organization Id</span>
        <input
          onChange={(e) => {
            setEnteredOrg(e.target.value);
          }}
          className="placeholder:italic transition-all placeholder:text-gray-500 w-full max-w-[200px] border mb-3 border-gray-500 rounded-md p-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter Id" type="text" name="store"
        />
        <span className="mb-1">Enter Amount to Claim</span>
        <input
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          className="placeholder:italic transition-all placeholder:text-gray-500 w-full max-w-[200px] border mb-3 border-gray-500 rounded-md p-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter amount" type="text" name="store"
        />
      </div>

      <button onClick={claimToken} className='px-4 py-1 bg-slate-300 flex justify-around hover:bg-slate-500 transition-all w-fit'> {claimLoader ? (
        <svg
          className="animate-spin m-1 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75 text-gray-700"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : "Claim Tokens"} </button>

      <hr></hr>
      <h3>Add Organization with whitelisted addresses to claim tokens</h3>
      <div className="grid">
        <input
          onChange={(e) => {
            setEnteredName(e.target.value);
          }}
          className="mb-3 placeholder:italic transition-all placeholder:text-gray-500 w-full max-w-lg border border-gray-500 rounded-md p-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter organization name" type="text" name="store"
        />
        <input
          onChange={(e) => {
            setTokenName(e.target.value);
          }}
          className="mb-3 placeholder:italic transition-all placeholder:text-gray-500 w-full max-w-lg border border-gray-500 rounded-md p-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter organization token name" type="text" name="store"
        />
        <input
          onChange={(e) => {
            setTokenSymbol(e.target.value);
          }}
          className="placeholder:italic transition-all placeholder:text-gray-500 w-full max-w-lg border border-gray-500 rounded-md p-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter organization token symbol" type="text" name="store"
        />
        <button onClick={addNewOrganization} className='px-4 py-1 mt-3 mb-4 bg-slate-300 flex justify-around hover:bg-slate-500 transition-all w-fit'> {storeLoader ? (
          <svg
            className="animate-spin m-1 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75 text-gray-700"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : "Create Organization"} </button>

        <hr></hr>

        <div className="grid mt-3 border rounded-md border-black p-4 w-full max-w-lg">
          <span className="mb-1">Enter Organization Id</span>
          <input
            onChange={(e) => {
              setEnteredOrg(e.target.value);
            }}
            className="placeholder:italic transition-all placeholder:text-gray-500 w-full max-w-lg border mb-3 border-gray-500 rounded-md p-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter Id" type="text" name="store"
          />
          <span className="mb-1">Enter A Stakeholder</span>
          <input
            onChange={(e) => {
              setStakeHolderAddress(e.target.value);
            }}
            className="placeholder:italic transition-all placeholder:text-gray-500 w-full max-w-lg border mb-3 border-gray-500 rounded-md p-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter stakeholder address" type="text" name="store"
          />

          <div className="grid">
            <span className="mb-1">Stakeholder Role</span>
            <select onChange={(e) => setStakeHolderRole(e.target.value)} className="border border-gray-500 p-2 rounded-md text-2x">
              <option disabled defaultValue="">--please select category--</option>
              <option value="Founder">Founder</option>
              <option value="Investor">Investor</option>
              <option value="Director">Director</option>
              <option value="Chairman">Chairman</option>
              <option value="Trustee">Trustee</option>
            </select>
          </div>
          <div className="mt-3 flex items-center gap- w-full">
            <label className="w-[90px]">Whitelisted</label>
            <input
              onChange={(e) => {
                setWhitelisted(e.target.value);
              }}
              className="mt-1 border border-gray-500 rounded-md p-2 text-2xl" type="checkbox" name="store"
            />
          </div>
          <div className="my-3">
            <label>Deadline</label>
            <input
              onChange={(e) => {
                setStakeHolderDeadline(e.target.value);
              }}
              className="placeholder:italic transition-all placeholder:text-gray-500 w-full max-w-lg mt-1 border border-gray-500 rounded-md p-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter vesting locked time" type="date" name="lock"
            />
          </div>
          <button onClick={addStakeHolder} className='px-4 py-1 mt-3 mb-4 bg-slate-300 flex justify-around hover:bg-slate-500 transition-all w-fit'> {stakeholderLoader ? (
            <svg
              className="animate-spin m-1 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75 text-gray-700"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : "Add Stakeholder"} </button>
        </div>

      </div>



    </div>
  )
}
