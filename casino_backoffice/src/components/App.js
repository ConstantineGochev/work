import React from 'react';
import Navigation from './Navigation'
import { Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import SignIn from './auth/Signin'
import {connect} from 'react-redux'
import {Icon} from 'semantic-ui-react'

const options = {
  timeout: 3000,
  position: "top right"
};



 class App extends React.Component {
    constructor(props){
        super()
    }
    show_login () {
        if(!this.props.auth.authenticated) {      
            return  <SignIn />
        }
    }
    show_name () {
        if(this.props.auth.authenticated) {
         //   console.log(this.props.auth.user_name)
            return <div className="logCred" > Hello, <span>{this.props.auth.user_name}</span></div>
        } else {
            return <div className="logCred" > You are not signed in</div>
        }
    }
    render(){
        console.log(this.props.auth)
        return (
            <div>
                <Provider template={AlertTemplate} {...options}>
                    <div className="fixedMenu"></div>
                    {this.show_name()}
                    <Navigation />
                    {this.show_login()}
                    {this.props.children}
                </Provider>
            </div>
        )
    }
}

function map_state_to_props(state) {
    return {
        auth: state.auth
    }
}

export default connect(map_state_to_props)(App)


