
import React, {Component} from 'react';
import { Form, Button, Segment } from 'semantic-ui-react';
import {connect} from 'react-redux';
import {log_user, get_token} from '../actions';
import axios from 'axios';



class AuthForm extends Component {
    constructor(props) {
        super()
          this.state = {
            token: '123-AAA-456'
        }
    } 

    changeValue = (e) =>{
        this.setState({
            token: e.target.value
        })
    }
    submit_code = () => {
        console.log('submit')
        // make axios request with the this.state.code
        // check the response if the code is correct invoke log_user with true
        //if it is not correct invoke with false

        this.props.history.push('dashboard')
        this.props.log_user(true)
        console.log(this.state.token)
        this.props.get_token(this.state.token)
        //console.log(res)
        //console.log(this.props)

    } 
     componentDidMount () {
        // var json = {"token": this.state.token}
        // function send_ajax () {
        //     axios.post('https://10.10.0.198:8160/state', json).then((res) => {
        //         console.log(res)
        //     }).catch(err => console.log(err))
        // }
        // try {
        //     setInterval(send_ajax, 1000)
        // }catch (err) {
        //     console.log(err)
        // }
    }
    render() {

        return (
          <div className='login_form' style={{width:'100%'}}>
              <Segment color='teal' >
                <Form>
                    <Form.Field>
                        <label>Token</label>
                        <input name='code' value={this.state.token} onChange={this.changeValue} onSubmit={this.onSubmit}/>
                    </Form.Field>
                    <div>
                    <Button type='submit' positive icon='sign in' onClick={this.submit_code} content="Sign in" />
                    </div>
                </Form>
                </Segment>
              
          </div>
        );
      }
}

function map_state_to_props (state) {
    return {
        auth: state.auth
    }
}

export default connect(map_state_to_props, {log_user,get_token})(AuthForm);