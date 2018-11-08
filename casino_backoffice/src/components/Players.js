import React, {Component} from 'react';
import {fetch_players, fetch_player} from '../actions/index'
import { Button, Modal } from 'semantic-ui-react'
import { connect } from 'react-redux';
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from 'axios';
import { Link } from 'react-router';
import * as extra from '../extra'
import requireAuth from './HOCS/requireAuth'




class Players extends Component {
    constructor(props){
        super()
        this.state = {
            players: [],
            modal_open: false,
            _id: null
        }
    }

    componentDidMount(){

        this.set_players()        
    }
   
    // componentWillUnmount(){
    //     this.setState({
    //         players: []
    //     })
    // }
    // componentWillUnmount(){
    //     //this.set_players =  this.set_players.unbind(this)
    //     this.set_players = null;
    //     //this.setState({players:[]})
    // }

    set_players = async () =>{
         
        await this.props.fetch_players()
       // await this.setState({players:this.props.players})
        const arr = await this.props.players.map(function(p) {p.balance  = extra.m(p.balance, "XXX"); return p;});
        
        await this.setState({
           players:arr
        })
    }
    delete = async (id) => {
        await axios.delete('https://'+ window.location.hostname + `:8158/new_path/apiv2/entry/players/${id}`)
        await this.props.fetch_players()        
        const updated_players = await this.props.players.map(function(p) {p.balance  = extra.m(p.balance, "XXX"); return p;});
        this.setState({
            players: updated_players,
            modal_open: false
        }) 
     //   console.log(id)
    }
    current_user =  (id) => {
        console.log('id', id)
         this.props.fetch_player(id)
    }
    show =  (_id) => this.setState({ modal_open: true,_id })
    close = () => this.setState({ modal_open: false })

    render(){
      // console.log(this.state.players)
       if(this.state.players.length === undefined || this.state.players.length === 0){
        return null
       }
        
        return (
        <div>
             <ReactTable
          data={this.state.players}
          columns={[
            {
    
                  Header: "Screen Name",
                  accessor: "screenname",
   
                
            },
            {

                  Header: "Player ID",
                  accessor: "player_id",
  
                  
            },
              {  
                  Header: "Status",
                  accessor: "banned"
                  
              },
            {
          
                  Header: "Balance",
                  accessor: "balance",
              
 
            },
              {
            
                  accessor: "_id",                  
                  Cell: row => (
                          <Button icon='delete' basic content='Delete' onClick={() => this.show(row.original._id)} color='red' ></Button>
                         ),
                
            },
            {
                  Cell: row => (
                        <Link to="/players/settings_form" onClick={() => this.current_user(row.original._id)}  ><Button icon='settings' basic positive content="Settings" /></Link>
                  )

              }, {
          
                Cell: row => {
                    var user = this.state.players.find((user) => {
                        return user._id === row.original._id
                    })
                    return (
                        <Link to={"/edit/" + user._id}><Button basic  icon='edit' content='EDIT' /></Link>
                    )
                },
              }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
            <Modal size={'small'} open={this.state.modal_open} onClose={this.close}>
                <Modal.Header>Delete This Account</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete this account ?</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.close()}negative>No</Button>
                    <Button onClick={() => this.delete(this.state._id)} positive icon='checkmark' labelPosition='right' content='Yes' />
                </Modal.Actions>
            </Modal>
            {this.props.children}
        </div>
        )
    }
}

function map_state_to_props(state){
     return {
           players: state.players,
         
        }
}

export default connect(map_state_to_props,{fetch_players, fetch_player})(requireAuth(Players))