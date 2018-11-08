import React from 'react';
import {
    Button, Form, Segment,
    Transition,
    TransitionablePortal,
    Modal,
    Grid,
    Image,
    Message
} from 'semantic-ui-react'
import { connect } from 'react-redux'
import {signIn_user} from '../../actions/index'
import LogoEgt from '../../css/images/Egt-logo.svg';



class SignIn extends React.Component {
    constructor(props) {
        super()
        this.state = {
            user_name: '',
            password: '',
            show: true,
            size: 'mini',
            animation: 'pulse',
            duration: 2000,
            open: true,
            animation: 'pulse',
            duration: 400, 
        }
    }

    componentDidMount() {
        this._mounted = true
    }
    componentWillUnmount() {
        this._mounted = false
    }
    handle_submit = async  () => {
        console.log('submittt')
        const { user_name, password } = this.state
        const user = {
            user_name,
            password
        }

        await this.props.signIn_user(user)
       // console.log(this.props.errorMsg)
        if (!this.props.errorMsg && this._mounted) {
            this.setState({
                show: false,
                open: false
            })
        }
    }
    changeValueHandler =  (event) => {
        event.preventDefault()
         this.setState({
            [event.target.name]: event.target.value
        })
    }
    render_msg () {
       // console.log(this.props.errorMsg)
        
        if(this.props.errorMsg) {
            return <Message negative header='Action Forbidden'  content={this.props.errorMsg} />                           
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
       // console.log(this.props.errorMsg)
        return (
            <TransitionablePortal open={open} transition={{ animation, duration }}>
                 <Modal open={show} size={size} style={{background: 'none'}} > 
                    <Grid textAlign='center' style={{
                        height: '100%',

                    }} verticalAlign='middle'>
                        <Grid.Column style={{
                            maxWidth: 450,
                        }}>
                            <Modal.Header as='h2' style={{ textAlign: 'center' }}>
                                <Image src={LogoEgt} />
                            </Modal.Header><br />
                            <Form onSubmit={this.handle_submit} >
                                <Segment stacked={true}>
                                    <Form.Field>
                                        <Form.Input fluid={true} icon='user' iconPosition='left' placeholder='Username' name='user_name' value={this.state.user_name} onChange={this.changeValueHandler} autoComplete='off'/>
                                    </Form.Field>
                                    <Form.Field>
                                        <Form.Input fluid={true} icon='lock' iconPosition='left' placeholder='Password' name='password' value={this.state.password} onChange={this.changeValueHandler} autoComplete='off' />
                                    </Form.Field>
                                    {this.render_msg()}
                                    <Button color='teal' fluid={true} size='large' type='submit'>Sign In</Button>
                                </Segment>
                            </Form>
                        </Grid.Column>
                    </Grid>
                 </Modal> 
            </TransitionablePortal >
        )
    }
}

function map_state_to_props(state) {
    return {
        errorMsg: state.auth.errorMsg
    }
}

export default connect(map_state_to_props, {signIn_user})(SignIn)