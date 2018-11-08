import React, {Component} from 'react';
import { Field, reduxForm, } from 'redux-form'
import axios from 'axios';
import Expire from './Expire'
import async from 'async'
import { withAlert } from "react-alert";
import {Dropdown, Form,Segment, Button, Radio} from 'semantic-ui-react'

class AddForm extends Component {
  constructor(props){
     super()
     this.state = {
       screenname: '',
       password: '',
       player_id: '',
       balance: '',
       banned: ''
     }
  }
  handleSubmit = () => {
    console.log('submit')
    console.log(this.state)
    async.waterfall([
      (callback) => {
        if(this.state.screenname.length === 0){ 
          return callback('screenname is required');
        } 
       return callback(null)
      }, (callback) => {
         if(this.state.password.length === 0){
           return callback('password is required');
         }
         return callback(null)
      },
      (callback) => {
        if(isNaN(this.state.player_id)){
          return callback('player id must be a number');
        }
        if(this.state.player_id.length === 0){
          return callback('player id is required');
        }
        if(this.state.banned.length === 0) {
          return callback('Player status is required')
        }

        return callback(null)
     },
     (callback) => {
      if(isNaN(this.state.balance) || this.state.balance.length > 10 || this.state.balance.length <= 1){
        return callback('balance is required and must be a number between 1 and 10 digits');
      }
      return callback(null)
   },
    ],(err) => {
      if(err){
        return this.props.alert.error(err)
      }
      const { screenname, password, player_id, balance, banned } = this.state
      const player = {
              screenname, 
              password, 
              player_id, 
              balance,
              banned
            }
            axios.post(`https://${window.location.hostname}:8158/new_path/apiv2/entry/players`, player)
                   .then((res) => {
                     console.log(res)
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
                   })
                    .catch(err => console.log("something went wrond with DB"))
    })
  }

 changeValueHandler = async (event) => {
    event.preventDefault()
   await this.setState({
      [event.target.name]: event.target.value
    })
  }
 handleChange = (e, { value }) => {
   //console.log(e)
   // console.log(value)
   this.setState({
     banned: value
   })
 }
  render(){
    return(

      <div>
        <Form>
          <Segment raised>
            <h2>Create New Player</h2>
            <Form.Field>
              <label>Screen Name:</label>

              <input value={this.state.screenname} placeholder="screenname" onChange={this.changeValueHandler} type="text" name="screenname" />
            </Form.Field>
            <Form.Field>
              <label>Password:</label>

              <input value={this.state.password} placeholder="password" type="text" name="password" onChange={this.changeValueHandler} />
            </Form.Field>
            <Form.Field>
              <label>Player ID:</label>

              <input value={this.state.player_id} placeholder="player_id" type="text" name="player_id" onChange={this.changeValueHandler} />
            </Form.Field>
            <Form.Field>
              <label>Balance:</label>
              <input value={this.state.balance} placeholder="balance" type="text" name="balance" onChange={this.changeValueHandler} />
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
            <Button type="submit" onClick={this.handleSubmit} type="submit" value="Create">CREATE PLAYER</Button>
          </Segment >
        </Form>
      </div>
    )
  }
}



export default withAlert(AddForm)

