import React, { Component } from 'react'
import {fetch_player} from '../actions/index'
import { connect } from 'react-redux'
import axios from 'axios'
import { Link } from 'react-router'
import {  Checkbox, Form,Container, Segment, Grid, Button, Radio } from 'semantic-ui-react'
import async from 'async'
import { withAlert } from "react-alert";

class EditPlayer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            screenname: '',
            password: '',
            player_id: '',
            balance: '',
            banned: ''
        }

    }
    componentWillMount() {
       this.props.fetch_player(this.props.params.id)
    }
    changeValueHandler = async (event) => {
        event.preventDefault()
        await this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleChange = (e, { value }) => {
        this.setState({
            banned: value
        })
    }
    handle_update = () => {
        console.log('edit meeee')
        var new_player = {
              screenname:'', 
              password: '', 
              player_id: '', 
              balance: '',
              banned: ''
        }
            async.waterfall([
      (callback) => {
        if(this.state.screenname.length === 0){
          new_player.screenname = this.props.player.screenname
        }else{
          new_player.screenname = this.state.screenname
        }
       return callback(null)
      }, (callback) => {
         if(this.state.password.length === 0){
         //  return callback('password is required');
            new_player.password = this.props.player.password
         }else {
            new_player.password = this.state.password
         }
         return callback(null)
      },
      (callback) => {
        if(isNaN(this.state.player_id) || isNaN(this.props.player.player_id)){
          return callback('player id must be a number');
        }
        if(this.state.player_id.length === 0){
            new_player.player_id = this.props.player.player_id
         // return callback('player id is required');
        }else {
            new_player.player_id = this.state.player_id
        }

        return callback(null)
     },
     (callback) => {
        if(this.state.balance.length === 0 ) {
            new_player.balance = this.props.player.balance
        }else {
            new_player.balance = this.state.balance
        }
      if(isNaN(this.state.balance) || this.state.balance.length > 10){
        return callback('balance is required and must be a number between 1 and 10 digits');
      }
      return callback(null)
   },
    (callback) => {
        if(this.state.banned.length === 0) {
            new_player.banned = 'active'
        }else {
            new_player.banned = this.state.banned
        }
        callback(null)
    }
    ], (err) => {
      if(err){
        return this.props.alert.error(err)
      }

            axios.put(`https://${window.location.hostname}:8158/new_path/apiv2/entry/players/${this.props.player._id}`, new_player)
                   .then((res) => {
                    // console.log(res)
                     if(res.data.msg === 'User ID exists'){
                       return this.props.alert.error(res.data.msg)
                     }
                     this.props.alert.success(res.data.msg)
                     this.setState({
                       screenname: '',
                       password: '',
                       player_id: '',
                       balance: ''
                     })
                      console.log(this.state)
                    this.props.router.goBack()
                   })
                    .catch(err => console.log("something went wrond with DB"))
    })
    }
    render() {

        if(this.props.player === undefined) return null
        return (
            <div>

        <Link to="/players" className="greyBackBtn"><Button basic icon='arrow alternate circle left outline' content= 'Back'/></Link>
                <Form>
                     <Segment raised>
                     <h2> EDIT PLAYER </h2>
                    <Form.Field>
                        <label>Screen Name:</label>
                        <input name='screenname' value={this.state.screenname} placeholder={this.props.player.screenname} onChange={this.changeValueHandler} />
                    </Form.Field>
                     <Form.Field>
                        <label>Password:</label>
                        <input name='password' value={this.state.password} placeholder={this.props.player.password} onChange={this.changeValueHandler} />
                    </Form.Field>
                    <Form.Field>
                        <label>Player ID:</label>
                        <input name='player_id' value={this.state.player_id} placeholder={this.props.player.player_id} onChange={this.changeValueHandler} />
                    </Form.Field>
                    <Form.Field>
                        <label>Balance:</label>
                        <input name='balance' value={this.state.balance} placeholder={this.props.player.balance} onChange={this.changeValueHandler}/>
                    </Form.Field>
                    <Form.Group inline>
                        <label>Player Status:</label>
                        <Form.Field
                            control={Radio}
                            label='banned'
                            value='banned'
                            checked={this.state.banned === 'banned'}
                            onChange={this.handleChange}
                        />
                        <Form.Field
                            control={Radio}
                            label='active'
                            value='active'
                            checked={this.state.banned === 'active'}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Button type='submit' onClick={this.handle_update}>UPDATE CREDENTIALS</Button>
                    </Segment>
                </Form>
            </div>
        )
    }
}

function map_state_to_props(state) {
    return {
        player: state.players.player
    }
}

export default connect(map_state_to_props,{fetch_player})(withAlert(EditPlayer))
