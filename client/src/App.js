import React, { useEffect } from 'react';
import './styles/App.css';

const App = () => {
  // check wallet connection
  const checkIfWalletIsConnected = () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log('Make sure to have MetaMask Installed');
      return;
    } else {
      console.log('Ethereum object spotted', ethereum);
    }
  };

  // function to render if wallet is not connected  yet
  const renderNotConnectedContainer = () => (
    <div className='connect-wallet-container'>
      <img
        src='https://media.giphy.com/media/bLlXY00bpGesw/giphy.gif'
        alt='Scooter'
      />
      <button className='cta-button connect-wallet-button'>
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
        {renderNotConnectedContainer()}
      </div>
    </div>
  );
};

export default App;
