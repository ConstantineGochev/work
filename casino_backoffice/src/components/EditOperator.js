import React, { Component } from 'react';
import { Link, ReactRouter } from 'react-router'
import {  Checkbox, Form,Container, Segment, Grid, Button } from 'semantic-ui-react'
import async from 'async'
import axios from 'axios'
import { withAlert } from "react-alert";
import {fetch_operator} from '../actions/index'
import {connect} from 'react-redux'

class EditOperator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ip_adress: '',
            name:'',
            operator_name: '',
            portal_code: '',
            pass:''
        }

    }


    componentWillMount(){
        this.props.fetch_operator(this.props.params.id)
        // console.log(this.props.params.id)
        // console.log(this.props.fetch_operator(this.props.params.id))
    }

    changeValueHandler = async (event) => {
        event.preventDefault()
        await this.setState({
            [event.target.name]: event.target.value
        })
    }

    handle_update = (e) => {
        // e.preventDefault()
    //  console.log(this.props.operator)
      const operatorR = this.props.operator
      const { ip_adress, name, operator_name, pass, portal_code } = this.state

      const operator = {
                ip_adress, 
                name, 
                operator_name, 
                pass,
                portal_code
            }
            // var self = this
            // var error = 0;

            Object.keys(operator).map(function(key, index) {
                if(operator[key] === ''){
                  operator[key] = operatorR[key]
                }
                console.log("EDIT OPERATORS")
                // if(key === "ip_adress" && /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/.test(operator[key]) === false) {
                //     // console.log("IN")
                //     // console.log(/\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/.test(operator[key]))
                //     // console.log(key)
                //     ++error
                //     return self.props.alert.error("Must be a valid ip adress")
                // } 
            });             
            
        //    if(error === 0){
            axios.put(`https://${window.location.hostname}:8158/new_path/apiv2/entry/operators/${this.props.params.id}`, operator)
                   .then((res) => {
                    //    console.log(operator)
                    // console.log(res)
                    //  if(res.data.msg === 'User ID exists'){
                    //    return this.props.alert.error(res.data.msg)
                    //  }
                     this.props.alert.success(res.data.msg)
                     //   console.log(this.state)
                    })
                    .catch(err => console.log("something went wrond with DB"))
                    // console.log(this.props.router)
                    // this.props.router.goBack()
                        this.setState({
                            ip_adress: '',
                            name: '',
                            operator_name: '',
                            pass: '',
                            portal_code: ''
                        })
                    // }else{
                    //     return
                    // }
    }

    render() {
        if(this.props.operator === undefined) return null

       const {ip_adress, name, operator_name, portal_code, pass} = this.props.operator

        return (
            <div>
        <Link to="/games" className="greyBackBtn"><Button basic icon='arrow alternate circle left outline' content= 'Back'/></Link>
        <Segment raised>
                <h2> EDIT OPERATOR </h2>
                <Form>
                    <Form.Field>
                        <label>IP ADRESS:</label>
                        <input name='ip_adress' value={this.state.ip_adress} placeholder={ip_adress} onChange={this.changeValueHandler} />
                    </Form.Field>
                     <Form.Field>
                        <label>NAME:</label>
                        <input name='name' value={this.state.name} placeholder={name} onChange={this.changeValueHandler} />
                    </Form.Field>
                    <Form.Field>
                        <label>OPERATOR NAME:</label>
                        <input name='operator_name' value={this.state.operator_name} placeholder={operator_name} onChange={this.changeValueHandler} />
                    </Form.Field>
                    <Form.Field>
                        <label>PASSWORD:</label>
                        <input name='pass' value={this.state.pass} placeholder={pass} onChange={this.changeValueHandler} />
                    </Form.Field>
                    <Form.Field>
                        <label>PORTAL CODE:</label>
                        <input name='portal_code' value={this.state.portal_code} placeholder={portal_code} onChange={this.changeValueHandler}/>
                    </Form.Field>
                    <Button onClick={this.handle_update}>UPDATE CREDENTIALS</Button>
                </Form>
            </Segment>
           </div>
        )
    }
}
function map_state_to_props(state) {
    return {
        operator: state.operators.operator
    }
}

export default connect(map_state_to_props,{fetch_operator})(withAlert(EditOperator))