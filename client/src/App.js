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
  // state to store users public wallet, data properties, and network
  const [currentAccount, setCurrentAccount] = useState('');
  const [domain, setDomain] = useState('');
  const [record, setRecord] = useState('');
  const [network, setNetwork] = useState('');

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

  // calling register function from smart contract to mint domain as an NFT
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

  // Form to enter domain name and data to store
  const renderInputForm = () => {
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

        <div className='button-container'>
          <button
            className='cta-button mint-button'
            // disabled={null}
            onClick={mintDomain}
          >
            Mint
          </button>
          <button
            className='cta-button mint-button'
            disabled={null}
            onClick={null}
          >
            Set Data
          </button>
        </div>
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
