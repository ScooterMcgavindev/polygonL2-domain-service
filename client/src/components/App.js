import React from 'react';
import '../styles/App.css';
//import twitterLogo from './assets/twitter-logo.svg';

// Constants
//const TWITTER_HANDLE = '_buildspace';
//const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  return (
    <div className='App'>
      <div className='container'>
        <div className='header-container'>
          <header>
            <div className='left'>
              <p className='title'>🐱‍👤 Domain Name Service</p>
              <p className='subtitle'>Your immortal API on the blockchain!</p>
            </div>
          </header>
        </div>

        <div className='footer-container'></div>
      </div>
    </div>
  );
};

export default App;
