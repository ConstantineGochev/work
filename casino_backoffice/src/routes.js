import React from 'react';
import {Route, IndexRoute } from 'react-router-dom';
import {hashHistory} from 'react-router'
import App from './components/App';
import Players from './components/Players'
import PlayerLogs from './components/PlayerLogs'
import Requests from './components/Requests'
import Dashboard from './components/Dashboard'
import AddForm from './components/AddForm'
import SettingsPage from './components/SettingsPage'
import PlayersRoute from './components/PlayersRoute'
import OperatorsForm from './components/OperatorsForm'
import GamesForm from './components/GamesForm'
import Games from './components/Games'
import EditOperator from './components/EditOperator'
import EditPlayer from './components/EditPlayer'
import SignOut from './components/auth/SignOut'
import LogDetails from './components/LogDetails'
import Chat from './components/Chat'

import { Redirect, browserHistory } from 'react-router';




export default (
   <Route exact path="/" component={App} >
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/add_new_player" component={AddForm} />
        <Route path="/players" component={Players} />
        <Route path="/edit/:id" component={EditPlayer} />
        <Route path="/player_logs" component={PlayerLogs} />
        <Route path="/log_details/:id" component={LogDetails} />        
        <Route path="/requests" component={Requests} />
        <Route path="/operators" component={OperatorsForm} /> 
        <Route path="/edit_operator/:id" component={EditOperator} />                    
        <Route path="/games" component={GamesForm} />
        <Route path="/games/manage_games" component={Games} />                                                                                              
        <Route path="/players/settings_form" component ={SettingsPage}  />
        <Route path="/chat" component= {Chat}  />         
        <Route path="/signout" component= {SignOut}  /> 
   </Route>
   
)