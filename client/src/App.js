import React, { useEffect, useState } from 'react';
import './styles/App.css';

const App = () => {
  // state to store users public wallet
  const [currentAccount, setCurrentAccount] = useState('');
  /**
   * implements connect wallet method
   */
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
      // print pub address
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
      </div>
    </div>
  );
};

export default App;
