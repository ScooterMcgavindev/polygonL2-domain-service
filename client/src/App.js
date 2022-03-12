import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './styles/App.css';

// CONSTANTS
const tld = '.scooter';
const CONTRACT_ADDRESS = 0x17225579db82d4d6ea560641e877c576c1141594;

const App = () => {
  // state to store users public wallet and data properties
  const [currentAccount, setCurrentAccount] = useState('');
  const [domain, setDomain] = useState('');
  const [record, setRecord] = useState('');

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
          placeholder='scooterMcgavin'
          onChange={e => setRecord(e.target.value)}
        />

        <div className='button-container'>
          <button
            className='cta-button mint-button'
            disabled={null}
            onClick={null}
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
