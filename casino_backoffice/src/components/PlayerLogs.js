import React, {Component} from 'react';
import {fetch_player_logs} from '../actions/index'
import * as extra from '../extra'
import { connect } from 'react-redux';
import ReactTable from "react-table";
import { Link } from 'react-router'
import { Calendar } from 'react-date-range';
import { Input, Form, Button,Segment} from 'semantic-ui-react'
import moment from "moment";
import "react-table/react-table.css";
import async from 'async'
import requireAuth from './HOCS/requireAuth'

 
class PlayerLogs extends Component {
    constructor(props){
        super();
        this.state = {
            isHidden: true,
            logs: [],
            filtered_logs: [],
            logsBool: false,
            startDate: '',
            player_name:'',
            operation:''
        }
    }
    componentWillMount(){
           this.set_logs()
    }
    handleDateChange = (date) => {
 
        this.setState({
            startDate: moment(date).format('MM/DD/YYYY')
        });
    }  
    nandleCalendar = (event) => {
       if(event.target.nodeName === "SPAN" || event.target.nodeName === "INPUT"){
        this.setState({
            isHidden: !this.state.isHidden
          },
          () => {
            if(!this.state.isHidden)
                this.setState({
                startDate: ''
                })
          })      
        }
    }
 
 
 
    changeValueHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
      }
 
 
      handleFilter = () => {
        var {operation, startDate, player_name} = this.state
        var date = moment(startDate).format('YYYY-MM-DD')
        if(date === "Invalid date") { // IF NO DATE IS SELECTED RETURNS Invalid date
            date = ''
        }
        var filterable_fields = [operation,date, player_name]
         var filteredLogs = this.state.logs.filter(logs => {
            const {created, op, player_name} = logs            
            const tostr = op + created + player_name
            return  filterable_fields.every( (e) => { 
                var re = new RegExp(e, 'gi'); 
                return re.test(tostr);
             })
           
   
          })
 
          this.setState({
            filtered_logs: filteredLogs
 
          }, () => {
              this.setState({
                logsBool:true,
                startDate: '',
                player_name:'',
                operation:''
              })
          })
      }
   
    set_logs = async () => {
         
        await this.props.fetch_player_logs()
        const arr = await this.props.player_logs
        this.setState({
           logs:arr
        })
    }
    reset  = () => {
       this.setState({
           logsBool: false
       })
    }
 
    render(){

        return (
            <div>
                <div className="filter">
              <Segment>
                <Form autoComplete="off" >
                    <Form.Group widths='equal'>
                        <Form.Field label='Date' control='input' name="calendar" value={this.state.startDate} onChange={this.changeValueHandler} onClick={this.nandleCalendar}/>
                        <Form.Field label='Operation' control='select' name='operation' value={this.state.operation} onChange={this.changeValueHandler}>
                            <option value=''></option>
                            <option value='Player deleted'>Player deleted</option>
                            <option value='Player created'>Player created</option>
                            <option value='Player credentials changed'>Player credentials changed</option>    
                        </Form.Field>
                        <Form.Field label='Player Name' name="player_name"  control='input' value={this.state.player_name} onChange={this.changeValueHandler}/>
                    </Form.Group>
                </Form>
                {/* <Button icon="search plus" content="filter from extra " positive onClick={extra.filterInputs()}/> */}
                <Button icon="search plus" content="FILTER" positive onClick={this.handleFilter}/>
                <Button icon="redo alternate" content="REFRESH" positive onClick={this.reset}/>
               
             <div className="calendarCont calendarPlayer" onClick={this.nandleCalendar}>
                {!this.state.isHidden &&
                        <Calendar
                            name="calendar"
                            onChange={this.handleDateChange}
                        />}
                </div>
             </Segment>
                </div>
               <ReactTable
          data={this.state.logsBool ? this.state.filtered_logs : this.state.logs}
          columns={[
            {

                Header: "Date",
                id:"date",
                accessor: (d) => {                        
                    return moment(d.created).format('MM/DD/YYYY')
                }
            
            },
            {
   
                Header: "Time",
                id:"time",
                accessor: (t) => {
                    return moment(t.created).format('HH:mm:ss')
                }
               
            },
            {
 
                  Header: "Operation",
                  accessor: 'op'
            },
              {  
                  Header: "Player name",
                  id: 'player_name',
                  accessor: (d) => {
                      if(d.op !== 'Player data changed') {
                          return d.player_name
                      }else {
                          return <Link to={`/log_details/${d._id}`}><Button icon='file' primary content='Details' /></Link>
                      }
                  }
                 
              },
          ]}
           defaultSorted={[
            {
              id: "created",
              desc: true
            }
          ]}
          defaultPageSize={20}
          className="-striped -highlight"
        />
        </div>
        )
    }
}
 
function map_state_to_props(state){
    return {
        player_logs: state.player_logs
    }
}
 
export default connect(map_state_to_props, {fetch_player_logs})(requireAuth(PlayerLogs))