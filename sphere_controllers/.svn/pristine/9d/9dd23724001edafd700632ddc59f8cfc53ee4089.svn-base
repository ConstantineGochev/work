import React, { Component } from 'react';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import {connect} from 'react-redux'
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom';



class App extends Component {
  constructor(props) {
    super(props)

  }


  render() {
    //console.log(this.props)
    return (
      <div>
      <Router>
        <div>
          <Route exact path='/' component={AuthForm} />
          <Route path='/dashboard' component={Dashboard} />
        </div>
      </Router>
     
      </div>

    );
  }
}

function map_state_to_props (state) {
  return {
    auth: state.auth
  }
}

export default connect(map_state_to_props)(App) ;
