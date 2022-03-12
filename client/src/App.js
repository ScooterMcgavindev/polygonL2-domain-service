import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './styles/App.css';
import contractAbi from './utils/contractABI.json';
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';
import { networks } from './utils/networks';

// CONSTANTS
const tld = '.scooter';
const CONTRACT_ADDRESS = '0x343670BF183c30cFF7C793bBe84a73201ed22CD5';

const App = () => {
  // state to store users public wallet, data properties, network, minter, and edit mode
  const [currentAccount, setCurrentAccount] = useState('');
  const [domain, setDomain] = useState('');
  const [record, setRecord] = useState('');
  const [network, setNetwork] = useState('');
  const [editing, setEditing] = useState(false);
  const [mints, setMints] = useState([]);

  // Connect Users wallet to metamask
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Get MetaMask -> https://metamask.io/');
        return;
      }
      // request access to account
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      // print public address and set account
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // check wallet connection made async to await for authorization
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log('Make sure to have MetaMask Installed');
      return;
    } else {
      console.log('Ethereum object spotted', ethereum);
    }
    // check authorization of users wallet
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    // grab 1st wallet
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }

    // check users network chain ID
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    setNetwork(networks[chainId]);

    ethereum.on('chainChanged', handleChainChanged);

    // reload page on network change
    function handleChainChanged(_chainId) {
      window.location.reload();
    }
  };

  /** Use MetaMask Api to swap and add correct networks
   * attempts to change network with wallet_switchEthereumChain rpc method
   */
  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        // attempt to switch to mumabi testnet
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13881' }] // checks network.js for hex network id
        });
      } catch (error) {
        // error code means the chain has not been added to metamask, ask user to add it
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x13881',
                  chainName: 'Polygon Mumbai Testnet',
                  rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                  nativeCurrency: {
                    name: 'Mumbai Matic',
                    Symbol: 'MATIC',
                    decimals: 18
                  },
                  blockExplorerUrls: ['https://mumbai.polygonscan.com/']
                }
              ]
            });
          } catch (error) {
            console.log(error);
          }
        }
        console.log(error);
      }
    } else {
      // If window.ethereum is not found then MetaMask is not installed
      alert(
        'MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html'
      );
    }
  };

  /** calling register function from smart contract to mint domain as an NFT
   * add setTimeout function to wait two seconds to make sure the transaction is mined,
   * so the app updates when a domain is minted so users can view their mint in real-time
   */
  const mintDomain = async () => {
    // Don't run if the domain is empty
    if (!domain) {
      return;
    }
    // Alert the user if the domain is too short
    if (domain.length < 3) {
      alert('Domain must be at least 3 characters long');
      return;
    }
    // Calculate price based on length of domain (change this to match your contract)
    // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
    const price =
      domain.length === 3 ? '0.5' : domain.length === 4 ? '0.3' : '0.1';
    console.log('Minting domain', domain, 'with price', price);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi.abi,
          signer
        );

        console.log('Going to pop wallet now to pay gas...');
        let tx = await contract.register(domain, {
          value: ethers.utils.parseEther(price)
        });
        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        // Check if the transaction was successfully completed
        if (receipt.status === 1) {
          console.log(
            'Domain minted! https://mumbai.polygonscan.com/tx/' + tx.hash
          );

          // Set the record for the domain
          tx = await contract.setRecord(domain, record);
          await tx.wait();

          console.log(
            'Record set! https://mumbai.polygonscan.com/tx/' + tx.hash
          );

          // call fetchMints after 2 seconds
          setTimeout(() => {
            fetchMints();
          }, 2000);

          setRecord('');
          setDomain('');
        } else {
          alert('Transaction failed! Please try again');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // update records
  const updateDomain = async () => {
    if (!record || !domain) {
      return;
    }
    setLoading(true);
    console.log('Updating Domain', domain, 'with record', record);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi.abi,
          signer
        );

        let tx = await contract.setRecord(domain, record);
        await tx.wait();
        console.log('Record set https://mumbai.polygonscan.com/tx/' + tx.hash);

        fetchMints();
        setRecord('');
        setDomain('');
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // function to render if wallet is not connected  yet
  const renderNotConnectedContainer = () => (
    <div className='connect-wallet-container'>
      <img
        src='https://media.giphy.com/media/bLlXY00bpGesw/giphy.gif'
        alt='Scooter'
      />
      <button
        onClick={connectWallet}
        className='cta-button connect-wallet-button'
      >
        Connect Wallet
      </button>
    </div>
  );

  /** Fetch Mint fetches 3 items and places in an array and sets the array as mints:
   * 1. All the domain names from the contract
   * 2. The record for each domain name it got
   * 3. The owner’s address for each domain name it got
   */
  const fetchMints = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // You know all this
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi.abi,
          signer
        );

        // Get all the domain names from our contract
        const names = await contract.getAllNames();

        // For each name, get the record and the address
        const mintRecords = await Promise.all(
          names.map(async name => {
            const mintRecord = await contract.records(name);
            const owner = await contract.domains(name);
            return {
              id: names.indexOf(name),
              name: name,
              record: mintRecord,
              owner: owner
            };
          })
        );

        console.log('MINTS FETCHED ', mintRecords);
        setMints(mintRecords);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * 2nd UseEffect which runs anytime the currentAccount or network are changed
   */
  useEffect(() => {
    if (network === 'Polygon Mumbai Testnet') {
      fetchMints();
    }
  }, [currentAccount, network]);

  /** Form to enter domain name and data to store
   * Renders two different buttons if the app is in edit mode,
   * Set Record Btn calls update function,
   * Cancel button takes us out of editing mode
   */
  const renderInputForm = () => {
    // connect to polygon mumbai testnet if not on it already
    if (network !== 'Polygon Mumbai Testnet') {
      //alert('Please Connect to the Polygon Mumbai Testnet');
      return (
        <div className='connect-wallet-container'>
          <h2 className='swapNetwork'>
            Please Connect to the Polygon Mumbai Testnet
          </h2>
          {/* This button will call our switch network function */}
          <button className='cta-button mint-button' onClick={switchNetwork}>
            Click Here to swap networks
          </button>
        </div>
      );
    }
    return (
      <div className='form-container'>
        <div className='first-row'>
          <input
            type='text'
            value={domain}
            placeholder='domain'
            onChange={e => setDomain(e.target.value)}
          />
          <p className='tld'>{tld}</p>
        </div>
        <input
          type='text'
          value={record}
          placeholder='domain records'
          onChange={e => setRecord(e.target.value)}
        />
        {/* If the editing variable is true, return the "Set record" and "Cancel" button */}
        {editing ? (
          <div className='button-container'>
            {/* call the updateDomain function */}
            <button
              className='cta-button mint-button'
              disabled={loading}
              onClick={updateDomain}
            >
              Set Record
            </button>
            {/* This will let us get out of editing mode by setting editing to false */}
            <button
              className='cta-button mint-button'
              onClick={() => {
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className='cta-button mint-button'
            disabled={loading}
            onClick={mintDomain}
          >
            Mint
          </button>
        )}
      </div>
    );
  };

  // Run on Render
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className='App'>
      <div className='container'>
        <div className='header-container'>
          <header>
            <div className='left'>
              <p className='title'>🛴 Scooter Name Service</p>
              <p className='subtitle'>Your immortal API on the blockchain!</p>
            </div>
            <div className='right'>
              <img
                alt='Network logo'
                className='logo'
                src={network.includes('Polygon') ? polygonLogo : ethLogo}
              />
              {currentAccount ? (
                <p>
                  {' '}
                  Wallet: {currentAccount.slice(0, 6)}...
                  {currentAccount.slice(-4)}{' '}
                </p>
              ) : (
                <p> Not connected </p>
              )}
            </div>
          </header>
        </div>
        {/* Hide the connect button if currentAccount isn't empty*/}
        {!currentAccount && renderNotConnectedContainer()}
        {/* Render the input form if an account is connected */}
        {currentAccount && renderInputForm()}
      </div>
    </div>
  );
};

export default App;
