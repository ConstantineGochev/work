import React, {Component} from 'react';
import {connect} from 'react-redux';
import {get_user} from '../actions/index'

import {
  Button,
  Modal,
  Input,
  Form,
  Grid,
  Header,
  Image,
  Segment,
  Transition,
  TransitionablePortal
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import LogoEgt from '../styles/images/Egt-logo.svg';
const transitions = [
  'browse',
  'browse right',
  'drop',
  'fade',
  'fade up',
  'fade down',
  'fade left',
  'fade right',
  'fly up',
  'fly down',
  'fly left',
  'fly right',
  'horizontal flip',
  'vertical flip',
  'scale',
  'slide up',
  'slide down',
  'slide left',
  'slide right',
  'swing up',
  'swing down',
  'swing left',
  'swing right',
  'zoom',
]
const FADE_DURATION = 200;
class MyModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: true,
      login: null,
      size: 'fullscreen',
      name: 'test',
      password: 'test',
      visible: true,
      animation: 'pulse',
      duration: 2000,
      visible: true,
      open:true,
      animation: transitions[12],
      duration: 400, 
    };

  }


  handle_login = async () => {
    //console.log('name %s password %s ',this.state.name, this.state.password)
    const {name, password} = this.state;
    const res = await this.props.get_user(name, password)
    if (this.props.login.user === undefined) {
      console.log('user is undefined')
      return this.handle_wrong_cred()
    }
    this.handle_correct_cred()
    // console.log(this.props.login)
  }
  handle_wrong_cred = () => {
    this.setState({open: true, login: false})
  }
  handle_correct_cred = () => {
    console.log('in the correct cred func');
    this.setState({open: false, login: true})
  }

  handle_name_change = (e) => {
    this.setState({name: e.target.value});
  }
  handle_password_change = (e) => {
    this.setState({password: e.target.value});
  }
  render_msg = () => {
    if (this.state.login === false) {
      return <span className="msg-err">Wrong username or password</span>
    }
  }


  render() {
    const {
      show,
      size,
      open,
      animation,
      duration
    } = this.state

    return (

    <div className='login-form'>

      <TransitionablePortal open={open} transition={{ animation, duration }}>
        <Modal open={show} size={size} >

          <Grid textAlign='center' style={{
              height: '100%'
            }} verticalAlign='middle'>
            <Grid.Column style={{
                maxWidth: 450
              }}>

              <Modal.Header as='h2' style={{textAlign:'center'}}>
                <Image src={LogoEgt}/>
              </Modal.Header><br />
                <Form size='large'>
                  <Segment stacked={true}>
                    <Form.Input fluid={true} icon='user' iconPosition='left' placeholder='E-mail address' id="first_name" value={this.state.name} onChange={this.handle_name_change} type="text" className="validate"/>
                    <Form.Input fluid={true} icon='lock' iconPosition='left' placeholder='Password' type='password' id="password" value={this.state.password} onChange={this.handle_password_change} className="validate"/>
               
                      <Button color='teal' fluid={true} size='large' onClick={this.handle_login} type="loginbtn" name="Login" content='Login'>
               
                      </Button>
             
                    {this.render_msg()}
                  </Segment>
                </Form>
            </Grid.Column>
          </Grid>
        </Modal>
      </TransitionablePortal>
    </div>
  );
  }
}
function map_state_to_props({login}) {
  return {login}
}

export default connect(map_state_to_props, {get_user})(MyModal)
