import React from 'react';
import {  Form, Button, Message } from 'semantic-ui-react'
import {connect } from 'react-redux'
import {signUp_user} from '../../actions/index'

class SignUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user_name: '',
            password: ''
        }
    }

    handle_submit = () => {
        console.log('submittt')
        console.log(this.state.user_name)
        console.log(this.state.password)
        const { user_name, password } = this.state
        const user = {
            user_name,
            password
        }

        this.props.signUp_user(user)
    }
    changeValueHandler = async (event) => {
        event.preventDefault()
        await this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
     
        return (
            <Form onSubmit={this.handle_submit}>
                SignUp
                <Form.Field>
                    <label>Username</label>
                    <input placeholder='Username' name='user_name' value={this.state.username} onChange={this.changeValueHandler}  />
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <input placeholder='Password' name='password' value={this.state.password} onChange={this.changeValueHandler} />
                </Form.Field>
                <Message
                    error
                    header='Action Forbidden'
                    content={this.props.errorMsg}
                />
                <Button type='submit'>Submit</Button>
            </Form> 
        )
    }
}

function map_state_to_props(state) {
    return {
        errorMsg: state.auth.errorMsg
    }
}

export default connect(map_state_to_props, {signUp_user})(SignUp)