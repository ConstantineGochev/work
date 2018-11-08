import React from 'react';
import { Container, Grid, Segment, Header, Button, Card, Form, TextArea,List,  Label } from 'semantic-ui-react'
import socketIOClient from "socket.io-client";
import {connect } from 'react-redux'
import {get_msgs} from '../actions/index';
import moment from 'moment';
import wsEvents from 'ws-events'
var Infinite = require('react-infinite');

// import { MessageList, Message, MessageText,MessageGroup } from '@livechat/ui-kit'


class Chat extends React.Component {
    constructor(props) {
        super()
        this.state = {
            msg: '',
            endpoint: `wss://${window.location.hostname}:8080/what`,
            msgs: [],
            err: ''
        }
        this.socket = wsEvents(new WebSocket(this.state.endpoint))
        console.log(this.socket)
        this.socket.on('open', function () {
            console.log('socket connected')
        })
        this.socket.on('message', function (event) {
            console.log('event', event)
            // console.log(JSON.parse(event.data))
            const data = JSON.parse(event)
            props.get_msgs(data)
           

        })
       this.list = React.createRef()

    }

    clear_chat = () => {
        var self = this
        this.socket.emit('clear')
        this.socket.on('cleared', function () {
            self.setState({
                msgs: []
            })
        })
    }

    msgChange = (e) => {
        // console.log(e.target.value)
        this.setState({
            msg: e.target.value
        })
    }



    send = () => {
        //const socket = socketIOClient(this.state.endpoint)
        if (this.state.msg == '') {
            this.setState({
                err: 'please enter message'
            })
        } else {
            var data = JSON.stringify({ name: this.props.auth.user_name, msg: this.state.msg })
            console.log('name', this.state.msg)
            this.setState({
                err: '',
                msg: '',

            })
            this.socket.emit('message', data)
           
        }
    }
    render_error = () => {
        if (this.state.err !== '') {
            return (
                <div>
                    <div>{this.state.err}</div>
                </div>
            )
        } else {
            return <div />
        }
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            console.log(e.key)
            this.send()
        }
    }
    render_msgs = () => {
        console.log(this.list)
        if (this.props.msgs.length === 0) {
            return null
        } else {
            if(this.list.current !== null) {
            this.list.current.shouldAttachToBottom = true

            }
            var list = this.props.msgs.map((data, i) => {
                return (
                    <div key={i} style={{ fontSize: '20px', padding: '5px', }} >
                        {data.name}:
                        <div className="infinite-list-item">{data.msg}</div>
                    </div>
                )
            })
            return list
        }
    }
    render() {
        //    console.log(this.state.msgs)
        //    console.log(this.state.msg)  
        //    console.log(this.state.username)       
        return (
            <Container>
                <Grid columns={1}>
                    <Grid.Row stretched>
                        <Grid.Column>
                            <Header as='h1'>Chat</Header>
                            <Button content='Clear' color="red" style={{ width: '10%' }} onClick={this.clear_chat} />
                            <br />
                          
                            <Infinite containerHeight={400}
                                elementHeight={50}
                                ref={this.list}
                                displayBottomUpwards

                            >
                                    {this.render_msgs()}
                                </Infinite>
              
                            <br />
                            {this.render_error()}
                            <Form style={{ marginBottom: '2%' }} onKeyPress={this.handleKeyPress}>
                                <Form.TextArea value={this.state.msg} placeholder='Tell us more...' onChange={this.msgChange} />
                            </Form>
                            <Button content='Send' style={{ width: '10%' }} onClick={this.send} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}
function map_state_to_props(state) {
    return {
        msgs: state.msgs,
        auth: state.auth
    }
}

export default connect(map_state_to_props, { get_msgs })(Chat) 