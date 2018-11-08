import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux'
import Select from 'react-select';
import {Link} from 'react-router'
import { Button, Modal } from 'semantic-ui-react'
import {fetch_operators} from '../actions/index'
import checkboxHOC from "react-table/lib/hoc/selectTable";
import ReactTable from "react-table";
import { MoonLoader } from 'react-spinners';
import "react-table/react-table.css";
import { withAlert } from "react-alert";
import * as extra from '../extra'
import async from 'async'
import requireAuth from './HOCS/requireAuth'
import moment from 'moment';



const CheckboxTable = checkboxHOC(ReactTable);



class GamesForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      operators: [],
      chosenOperatorID:[],
      chosen_operator_data: '',
      game_id: '',
      game_type: '',
      game_name: '',
      game_index: '',
      modal_open: false,
      _id: null
    }

  }

 componentWillMount(){
    this.setOperators()
    //this.props.fetch_games()
 }

 componentWillReceiveProps(nextProps){
  //  console.log(this.props.operators)
   if(nextProps.operators.operators === undefined) return null
  //  console.log(nextProps.operators.operators)
  // this.setState({
  //   operators: nextProps.operators.operators
  // })
}

 setOperators = async () => {
   await this.props.fetch_operators()
   const arr = await this.props.operators
   if(arr === undefined) return {}
   this.setState({
     operators: arr
   })
 }
 isSelected = key => {
   return this.state.chosenOperatorID.includes(key);
  };
toggleSelection = (key) => {
 //console.log(key)
  let selection = this.state.chosenOperatorID
  const keyIndex = selection.indexOf(key);
  //console.log(keyIndex)
  // check to see if the key exists
  if (keyIndex >= 0) {
    // it does exist so we will remove it using destructing
    // if(this.state.chosenOperator.length > 1){
    //   return 
    // }
    selection = [
      ...selection.slice(0, keyIndex),
      ...selection.slice(keyIndex + 1)
    ];
  } else {
    // it does not exist so add it
    if(selection.length > 0){
      return 
    }
    selection.push(key);
  }
  // update the state
  const operator = this.state.operators.operators.filter(function(op){
    return op._id === selection[0]
  })
  this.setState({chosen_operator_data: operator})
  this.setState({ chosenOperatorID: selection });
};

show = (_id) => {
  console.log(_id)
  this.setState({ 
    modal_open: true,_id 
  })
}
close = () => this.setState({ modal_open: false })

delete = async (id) => {
  await axios.delete('https://'+ window.location.hostname + `:8158/new_path/apiv2/entry/operators/${id}`)
  await this.props.fetch_operators()        
  const updated_operators = await this.props.operators;
  this.setState({
      operators: updated_operators,
      modal_open: false
  }) 
}

  renderOperators = () => {
    if(this.state.operators.operators === undefined || this.state.operators === []) {
      return (
        <div >
          Noo data
       </div>
      )
    }else{
      const {toggleSelection,isSelected} = this
      const checkboxProps = {
        toggleSelection,
        isSelected,
        selectType: "checkbox",
        getTrProps: (s, r) => {
         // console.log(r.original)
        if(r === undefined) return {} 
          const selected = this.isSelected(r.original._id);
         
          return {
            style: {
              backgroundColor: selected ? "lightgreen" : "inherit"
            }
          };
        }
      };
      //console.log(checkboxProps)
       const {operators} = this.state.operators
      //  console.log(operators)
        return (
          <CheckboxTable
          //ref={r => (this.CheckboxTable = r)}
          data={operators}
          columns={[
            {
              Header: "Date",
              id:"date",
              accessor: (d) => {
                console.log(d)
                return moment(d.created).format('MM/DD/YYYY')
              }
            },
            {
              Header: "IP ADRESS",
              accessor: "ip_adress"
            },
            {
              Header: "USER NAME",
              accessor: "name"
            },
            {
              Header: "OPERATOR NAME",
              accessor: "operator_name"
            },
            {
              Header: "PORTAL CODE",
              accessor: "portal_code"
            },
            {
              Header: "URL",
              accessor: "url"
            },
            {
              accessor: "_id",
              Cell:(row) => ( 
                <Button basic onClick={() => this.show(row.original._id)} color='red' ><span>Delete</span></Button>
              )
            },
            {
              accessor: "_id",
              Cell:(row) => ( 
                <Link to={`/edit_operator/${row.original._id}`}><span><Button icon='settings' basic positive content="Edit"></Button></span></Link>
              )
            },
            {
              accessor: "_id",
              Cell:(row) => ( 
                <Link to={`https://${row.original.ip_adress}:8150/gamesApi/getNewRestrictions/${row.original.portal_code}`} target="_blank"><span><Button icon='settings' basic positive content="Show JSON"></Button></span></Link>
              )
            }
            
          ]} 
          defaultSorted={[
            {
              id: "created",
              desc: true
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
          {...checkboxProps}
        />          
        )
        
      
    }
  }
   changeValueHandler = async (event) => {
    event.preventDefault()
   await this.setState({
      [event.target.name]: event.target.value
    })
  }
 handleSubmit = () => {
  //  console.log('submit')
 // console.log(typeof this.state.game_id)
   async.waterfall([
     (callback) => {
     if (this.state.chosen_operator_data === undefined && this.state.chosen_operator_data.length === 0) {
        return callback('No operator selected')
     }
       return callback(null)

   },(callback) => {
     if(!Number(parseInt(this.state.game_id))){
      return callback('Game Id must be a Number')
     }
       return callback(null)

   },(callback) => {
     if(this.state.game_type === '' || this.state.game_name === ''){
       return callback('You must select game type and game name')
     }
     return callback(null)
   }],(err) => {
     if(err) {
       return this.props.alert.error(err)
     }
     var obj = this.state.chosen_operator_data[Object.keys(this.state.chosen_operator_data)]
     const {game_id, game_type, game_name, game_index} = this.state
    //  console.log(game_type.value)
    //  console.log(game_name)
    //  console.log(this.props.games)
     const game = {
       game_name,
       game_index,
       game_id,
       game_type: game_type.value,
       operator: obj
     }
     axios.post(`https://${window.location.hostname}:8158/new_path/apiv2/entry/games`, game)
     this.props.alert.success('You have successfully created a game.')
     this.setState({
       game_name:'',
       game_id: '',
       game_type: '',
       operator: '',
       game_index:''
     })
     
   })
 }
  on_select_change(value) {
    this.setState({
      game_type: value
    })
  }
  render_form = () => {
       //var obj = this.state.chosen_operator_data[Object.keys(this.state.chosen_operator_data)]
    if (this.state.chosen_operator_data !== undefined && this.state.chosen_operator_data.length > 0) {
      // console.log(obj.operator_name)
      var obj = this.state.chosen_operator_data[Object.keys(this.state.chosen_operator_data)]
     // console.log(obj.operator_name)
      var options = [
        { value: '5/35', label: '5/35' },
        { value: '6/42', label: '6/42' },
        { value: '5+1', label: '5+1' },
        { value: 'bingo', label: 'bingo' }
      ]
      return (
       <div className="form-style-6 game-form">
            <h1>Create New Game</h1>
      <form>
        Game Name: 
        <input game_id={this.state.game_name} value={this.state.game_name} placeholder="Game Name" onChange={this.changeValueHandler} type="text" name="game_name" />
        Game ID:
        <input game_id={this.state.game_id} value={this.state.game_id} placeholder="game ID" onChange={this.changeValueHandler} type="text" name="game_id" />
        Game type:
         <Select
                name="game_type"
                value={this.state.game_type}
                options={options}
                onChange={this.on_select_change.bind(this)}
                clearable={true}
                className="select_drop"
               />
          Operator Name:
        <input operator_name={obj.operator_name} value={obj.operator_name} type="text" name="operator_name" onChange={this.changeValueHandler} disabled/>
      </form>
      <button className="btn green btn-operator" onClick={this.handleSubmit} type="submit" value="Create">CREATE</button>
      </div>

      )
    }else {
      return null
    }
  }


  render(){
 
    return(
      <div>
            {this.renderOperators()}
            <Modal size={'small'} open={this.state.modal_open} onClose={this.close}>
                <Modal.Header>Delete This Operator</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete this operator ?</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.close()}negative>No</Button>
                    <Button onClick={() => this.delete(this.state._id)} positive icon='checkmark' labelPosition='right' content='Yes' />
                </Modal.Actions>
            </Modal>
       {this.render_form()} 
     </div>
    )
  }
}


function map_state_to_props(state){
  return {
    operators: state.operators,
    games: state.games
  }
}


export default connect(map_state_to_props, {fetch_operators})(withAlert(requireAuth(GamesForm)))


