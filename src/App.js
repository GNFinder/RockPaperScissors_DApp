//import CoinFlip from './components/CoinFlip';
import './App.css';
import Navigation from './components/Navigation';
import Home from './components/Home';
import About from './components/About';
import BuildNotes from './components/BuildNotes';
import RPS_ETH_V2 from './components/RPS_ETH_V2';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';

//returns a new Web3 object, with provider
function getLibrary(provider) {
  return new Web3(provider);
}

function App() {
  return (
    //wrapping everything with the provider
    //gives access to all the good stuff for talking to blockchain
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <div>
          <Navigation />
            <Switch>
              <Route exact path='/'>
                <Home />
              </Route>
              <Route exact path='/about'>
                <About />
              </Route>
              <Route exact path='/build-notes'>
                <BuildNotes />
              </Route>
              <Route exact path='/rps-ethereum-v2'>
                <RPS_ETH_V2 />
              </Route>
              {/* <Route exact path='/coin-flip'>
                <CoinFlip />
              </Route> */}
              {/* <Route exact path='/metamask-example'>
                <MetaMaskExample />
              </Route> */}
            </Switch>
        </div>
      </Router>
    </Web3ReactProvider>
  );
}

export default App;
