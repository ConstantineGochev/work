import React from 'react'
import { connect } from 'react-redux'
import { signOut_user } from '../../actions/index'
import { Redirect } from 'react-router-dom'

class SignOut extends React.Component {

    componentDidMount () {
        this.props.signOut_user()
      //  debugger
        console.log(this.props)
       // window.location.href = '/'
       this.props.router.push('/')
    }
    render() {
        return (
            <div> Sorry to see you go. </div>
        )
    }
}


export default connect(null, {signOut_user})(SignOut)