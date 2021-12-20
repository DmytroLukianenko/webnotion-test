import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Header from "./components/Header";
import Info from './components/Info';
import Listing from "./components/Listing";
import { Context } from './context'

export const URL = 'https://my-json-server.typicode.com/1ohnny/test-api'

function App() {
  const [currentEmployeeId, setCurrentEmployeeId] = useState({})
  const [allPositions, setAllPositions] = useState([])
  const [contractTypes, setContractTypes] = useState([])

  return (
    <>
      <Context.Provider value={{ currentEmployeeId, setCurrentEmployeeId, allPositions, setAllPositions, contractTypes, setContractTypes }}>
        <Router>
          <Header />
          <Switch>
            <Route exact path='/' component={Listing} />
            <Route path='/info' component={Info} />
          </Switch>
        </Router>
      </Context.Provider>
    </>
  );
}

export default App;
