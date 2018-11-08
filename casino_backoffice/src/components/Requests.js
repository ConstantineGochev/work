import 'react-date-range/lib/styles.js'; // main style file
import React, {Component} from 'react';
import {fetch_requests, sort_params, filter_params} from '../actions/index'
import { connect } from 'react-redux';
import _ from "lodash";
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from 'axios';
import moment from 'moment';
import * as extra from '../extra.js'
import { Input, Form, Button, Segment} from 'semantic-ui-react'
import { Calendar } from 'react-date-range';
import { withAlert } from "react-alert";
import requireAuth from './HOCS/requireAuth'




class Requests extends Component {
    constructor(props){
        super()
        this.state ={
            requests: [],
            pages: 0,
            page:0,
            order: 1,
            loading: false,
            pages: null,
            isHidden: true,
            //for filtering object that gets sent as a query
            created: '',
            screenname: '',
            err_code: '',
            op: '',
            msg: '',
            reason: '',
            session_id: '',
            transfer_id: ''
        }
    }

     changeValueHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
      }
 

     handleCalendar = (event) => {
        if(event.target.nodeName === "SPAN" || event.target.nodeName === "INPUT"){
        this.setState({
            isHidden: !this.state.isHidden
          })   
        }
    }
      handleDateChange = (date) => {
        //  console.log(this.state.requests)
        this.setState({
            created: moment(date).format('MM/DD/YYYY')
            // created: date
        });
    }
    filter_handler = async () => {

       const {created, err_code, op, session_id, transfer_id, msg, screenname,order } = this.state
 
        var player_id;
        if (screenname !== '') {
            var player_request = await axios.get('https://' + window.location.hostname + ':8158/new_path/apiv2/entry/players/for_filter/' + screenname)
            if (player_request.data.player[0] === undefined) {
                player_id = ''
            } else {
                player_id = player_request.data.player[0]._id
            }
        }
       

       const obj = {
           created, 
           err_code, 
           op,
           session_id, 
           transfer_id, 
           msg, 
           user: player_id,
           order
       }
       await this.props.filter_params(obj)
    //    await console.log(this.props.filter_params())
        // console.log('hi', this.state.request)
        this.refReactTable.fireFetchData()
        
    }
    reset = async () => {

        await this.setState({
            created: '',
            err_code: '',
            op: '',
            session_id: '',
            transfer_id: '',
            msg: '',
            screenname: ''
        })
        await this.props.filter_params({})
        await this.refReactTable.fireFetchData()
        
    }

    render(){
        const { data, pages, loading } = this.state;
        // console.log(this.state.requests.created)
        return (
            <div>
              <div className="filter">
                <Segment>
                <Form autoComplete="off" >
                    <Form.Group widths='equal'>
                        <Form.Field label='Date' control='input' name="calendar" value={this.state.created} onChange={this.changeValueHandler} onClick={this.handleCalendar}/>
                        <Form.Field label='Player Name' name="screenname"  control='input' value={this.state.screenname} onChange={this.changeValueHandler}/>
                        <Form.Field label='Operation' control='select' name='op' value={this.state.op} onChange={this.changeValueHandler}>
                            <option value=''></option>
                            <option value='DepositRequest'>DepositRequest</option>
                            <option value='AuthRequest'>AuthRequest</option>
                            <option value='WithdrawRequest'>WithdrawRequest</option>    
                        </Form.Field>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Field label='Message' control='select' name='msg' value={this.state.msg} onChange={this.changeValueHandler}>
                            <option value=''></option>
                            <option value='OK'>OK</option>
                            <option value='DUPLICATE'>DUPLICATE</option>
                            <option value='TIME_PROXIMITY_ALERT'>TIME_PROXIMITY_ALERT</option>
                            <option value='CREDIT_LEFT_ALERT'>CREDIT_LEFT_ALERT</option>
                            <option value='TIME_OUT'>TIME_OUT</option>
                            <option value='INSUFFICIENT_FUNDS'>INSUFFICIENT_FUNDS</option>
                            <option value='BET_LIMIT_REACHED'>BET_LIMIT_REACHED</option>
                            <option value='LOSS_LIMIT_REACHED'>LOSS_LIMIT_REACHED</option>
                            <option value='DO_REALITY_CHECK'>DO_REALITY_CHECK</option>                        
                            <option value='INTERNAL_SERVER_ERROR'>INTERNAL_SERVER_ERROR</option>    
                            <option value='SESSION_TIME_LIMIT_REACHED'>SESSION_TIME_LIMIT_REACHED</option>
                        </Form.Field>
                        <Form.Field label='Request code' control='select' name='err_code' value={this.state.err_code} onChange={this.changeValueHandler}>
                            <option value=''></option>
                            <option value='1000'>1000</option>
                            <option value='1100'>1100</option>
                            <option value='1300'>1300</option>
                            <option value='1300'>1400</option>
                            <option value='1500'>1500</option>
                            <option value='2000'>2000</option>
                            <option value='3000'>3000</option>
                            <option value='3100'>3100</option>
                            <option value='3300'>3300</option>
                            <option value='3400'>3400</option>
                            <option value='3500'>3500</option>
                        </Form.Field>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Field label='Casino transfer ID' name="transfer_id"  control='input' value={this.state.transfer_id} onChange={this.changeValueHandler}/>
                        <Form.Field label='Session ID' name="session_id"  control='input' value={this.state.session_id} onChange={this.changeValueHandler}/>                        
                    </Form.Group>
                </Form>
                <Button icon="search plus" content="FILTER" positive onClick={this.filter_handler}/>
                <Button icon="redo alternate" content="REFRESH" positive onClick={this.reset}/>
                
             <div className="calendarCont" onClick={this.handleCalendar}>
                {!this.state.isHidden && 
                        <Calendar
                            name="calendar"
                            onChange={this.handleDateChange}
                        />}
                </div>
                </Segment>
                </div>
                <ReactTable
                    ref={(refReactTable) => {this.refReactTable = refReactTable;}}
                    data={this.state.requests}
                    pages={this.state.pages}
                    loading={this.state.loading}
                    // defaultASC
                    manual
                    onFetchData={async (state, instance) => {
                       await  this.setState({ loading: true })
                        let {column, order} = this.props.params.sort
                        // let {order } = this.state
                        console.log(order)
                        // console.log(order)
                        // order = -1; // HACK to be removed 
                        //  console.log(order)
                        // console.log("THIS PROPS PARAM", this.props.params)
                         var filter_obj;
                         if(this.props.params.filter !== undefined) {
                             filter_obj = this.props.params.filter
                         }else {
                             filter_obj ={}
                         }
                         await this.props.fetch_requests(state.page, state.pageSize,column, order,filter_obj)
                        //  console.log(order)
                         const { data, pages } = await this.props.requests 
                        //  console.log(data.created)
                        //  console.log('this.props.requests',this.props.requests )
                         if(data.length === 0) {
                             var new_pages = pages - (pages - state.page)
                             var new_page = state.page -1 
                            //  console.log(new_pages)
                              await this.setState({
                                 requests:data,
                                 pages: new_pages,
                                 page: new_page,
                                 loading: false
                             })
                         }

                         await this.setState({
                            requests: data,
                            pages: pages,
                            page: state.page,
                            loading: false
                        }) 

                    }}
                    sortable={true}
                    onSortedChange={  (newSorted, column, shiftKey) => {
                        // console.log("SORT -----------------", newSorted)
                           var sort_direction;
                            if (newSorted[0].desc === false) {
                                sort_direction = 1
                            } else {
                                sort_direction = -1
                            }
                            this.props.sort_params(newSorted[0].id, sort_direction)
                  
                    }}
                    

                    columns={[
                        {

                            Header: "Date",
                            defaultASC:"true",
                            id:"date",
                            accessor: (d) => {
                                return d.created
                            }

                        },
                        {

                            Header: "Time",
                            id:"time",
                            accessor: (t) => {
                                // console.log(moment(t.created).format('HH:mm:ss'))
                               return t.hour 
                            }

                        },
                        {

                            Header: "Player",
                            accessor: "user.screenname",

                        },
                        {

                            Header: "Request Code",
                            accessor: "err_code",

                        },
                        {
                            Header: "Message",
                            accessor: "msg",


                        },
                        {

                            Header: "Operation",
                            accessor: "op",


                        },
                        {

                            Header: "Reason",
                            accessor: "reason",


                        },
                        {

                            Header: "Casino Transfer ID",
                            accessor: "transfer_id",

                        },
                        {

                            Header: "Session ID",
                            accessor: "session_id",


                        },
                                                {

                            Header: "Amount",
                            accessor: "amount",


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

function map_state_to_props({requests, params}){
    return {
        requests,
        params
    }
}

export default connect(map_state_to_props,{fetch_requests, sort_params, filter_params})(withAlert(requireAuth(Requests)))