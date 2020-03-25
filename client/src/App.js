import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Conferences from './components/Conferences';
import Transcriptions from './components/Transcriptions';
import Utterances from './components/Utterances';
import Nav from './styles/Nav';

function App() {
  return (
    <div className="App">
      <Nav.Nav>
        <Nav.StyledNavLink exact to='/'>Home</Nav.StyledNavLink>
      </Nav.Nav>
      <Switch>
        <Route exact path='/' component={Conferences} />
        <Route exact path='/conf/:id' component={Transcriptions} />
        <Route exact path='/conf/:confId/trans/:transId' component={Utterances} />
      </Switch>
    </div>
  );
}

export default App;
