import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Redirect} from "react-router-dom";
import Balls from './Balls';
import { Button, Dimmer, Loader, Image, Segment, Modal,Header } from 'semantic-ui-react';
import {log_user, select_ball} from '../actions';
import Video from './Video';
import StateTable from './State';
import axios from 'axios';
import URL from '../config';



 
class Dashboard extends Component {
    constructor(props) {
        super()
          this.state = {
             response: '',
             game_state: 2,
          
        }
            this.timer = null
            this.modal_state =  false
         
            
    } 
   render_layout() {
       if (this.state.response.data === undefined) return null
       var parsed_state = JSON.parse(this.state.response.data.state)
       //console.log(JSON.parse(parsed_state.balls))
       var sphere_balls_arr = JSON.parse(parsed_state.balls)


       //console.log(sphere_balls_arr)
       if(this.props.auth.authenticated) {
           return (
               <div>
                   <Balls drawn_balls = {sphere_balls_arr}/>
               </div>
           )
       }else {
           return (
               <Redirect
                   to={{
                       pathname: "/",
                       state: { from: this.props.location }
                   }}
               />
           )
       }
   }
    check_modal_state () {
        if(this.props.balls.selected_ball !== null) {
            this.modal_state = true;
        }else {
            this.modal_state = false
        }
          
    }
    close_modal = () => {
        //we deselect the ball with a redux action
        this.props.select_ball(null)
    }
    change_ball = async (ball_number) => {

        var data_obj = {}
        data_obj[ball_number.toString()] = this.props.balls.selected_ball.toString()

        console.log(data_obj)

        let post_options = {
            method: 'POST',
            url: 'https://' + URL + ':8160/control',
            headers: { 'token': this.props.auth.token },
            data: {
                "ball": 90,
                "state": 2,
                "change": data_obj,
                "stop": false
            }
        }
      //  console.log(post_options)

        //const self = this
       const response = await axios(post_options)
       await this.props.select_ball(null)

       console.log(response)


    }


   log_out = () => {
      this.props.log_user(false)
      this.props.select_ball(null)
      this.props.history.push('/')

   }
   make_request = () => {

       let post_options = {
           method: 'POST',
           url: 'https:' +URL +':8160/state',
           headers: { 'token': this.props.auth.token,
             'Content-Type': 'application/json' },
           
       }
       const self = this
       axios(post_options).then((res) => {
        //    console.log("res", res)
        //    console.log(res)
        // if(res.status !== 200){
        //     return
        // }
           self.setState({
               response: res
           })

       }).catch(err => console.log(err))

   }
   componentDidMount() {
     this.timer = setInterval(this.make_request,1000)
   }
    componentWillUnmount () {
        clearInterval(this.timer)
    }

    render() {
        this.check_modal_state()
      //  console.log(this.props.balls.selected_ball)
        if(this.state.response.data === undefined) {
            return   <Loader style = {{marginTop: '20%'}} size='massive' active inline='centered' />
        } else {

            var parsed_state = JSON.parse(this.state.response.data.state)
            var sphere_balls_arr = JSON.parse(parsed_state.balls)
            return (
                <div>
                    <Button style={{ marginTop: '2%', marginLeft: '2%' }} type="submit" positive icon='triangle left' onClick={this.log_out} content='Log out' />
                    <div className='dashboard' style={{ marginLeft: '2%', marginRight: '2%', marginTop: '2%' }}>
                        <div className='second_section'>
                            <Video />
                            <StateTable drawnBalls={JSON.parse(this.state.response.data.state)} game_id={parsed_state.id} current_state={parsed_state.state} />
                        </div>
                        <Modal open={this.modal_state} >
                            <Modal.Header>Selected Ball:<span style={{ marginLeft: '5px', color: 'red' }}>{this.props.balls.selected_ball}</span></Modal.Header>
                            <Modal.Content>
                                <Segment>The ball's sequence is number:
                                    <span style={{ marginLeft: '5px', color: 'green' }}>{sphere_balls_arr.length}</span>
                                </Segment>
                                <Button positive onClick={() => this.change_ball(sphere_balls_arr.length)}> CHANGE </Button>
                                
                                <Button negative onClick={this.close_modal}> CLOSE </Button>
                            </Modal.Content>
                        </Modal>
                        {this.render_layout()}
                    </div>
                </div>
            );
         }
    }
}

function map_state_to_prop (state) {
    return {
        auth: state.auth,
        balls: state.balls,
    }
}

export default connect(map_state_to_prop, {log_user,select_ball})(Dashboard);