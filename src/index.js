import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Web3 from 'web3'
import { Web3ReactProvider} from '@web3-react/core'

function getLibrary(provider){
    return new Web3(provider)
  }


ReactDOM.render(
<Web3ReactProvider getLibrary={getLibrary}>
    <App />
</Web3ReactProvider>,
document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
