import React, { Component } from 'react';
import axios from 'axios';
import { withAlert } from "react-alert";
import { Form, Segment, Button } from 'semantic-ui-react'
import requireAuth from './HOCS/requireAuth'

class OperatorsForm extends Component {
  constructor(props){
    super()
    this.state = {
        operator_name: '',
        ip_adress: '',
        name:'',
        pass:'',
        portal_code:''
    }

  }

changeValueHandler = (event) => {
  event.preventDefault()
  this.setState({
    [event.target.name]: event.target.value
  })
}
handleSubmit = async (event) => {
  event.preventDefault()
 const {operator_name,ip_adress, name, pass, portal_code} = this.state

 const operator = {
   operator_name,
   ip_adress,
   name,
   pass,
   portal_code
 }
  console.log(operator)
await axios.post(`https://${window.location.hostname}:8158/new_path/apiv2/entry/operators`, operator)
     await this.props.alert.success("OPERATOR CREATED")
     await this.setState({
        operator_name: '',
        ip_adress: '',
        name:'',
        pass:'',
        portal_code:''
     })
     console.log(this.state)
}
  

  render(){
    return(
      <div>
        {/* <div className="form-style-6">
            <h1>Create Operator</h1>
            <form>
              <input operator_name={this.state.operator_name}  placeholder={this.state.operator_name} value={this.state.operator_name} onChange={this.changeValueHandler}  placeholder="OPERATOR`S NAME" type="text" name="operator_name" />
              <input ip_adress={this.state.ip_adress} value={this.state.ip_adress} placeholder="IP ADRESS" onChange={this.changeValueHandler} type="text" name="ip_adress" />
              <input name={this.state.name}  placeholder={this.state.name} value={this.state.name} onChange={this.changeValueHandler}  placeholder="OPERATOR`S USERNAME" type="text" name="name" />
              <input pass={this.state.pass}  placeholder={this.state.pass} value={this.state.pass} placeholder={this.state.pass} onChange={this.changeValueHandler}  placeholder="OPERATOR`S PASSWORD" type="text" name="pass"/>
              <input portal_code={this.state.portal_code} value={this.state.portal_code} placeholder="PORTAL CODE" onChange={this.changeValueHandler} type="text" name="portal_code"/>
            </form>
            <button className="btn green btn-operator" onClick={this.handleSubmit} type="submit" value="Create">CREATE</button>
        </div> */}
        <Segment raised>
        <h1 className="operatorsHeader">Create Operator</h1>
          <Form>
            <Form.Field>
                <label>OPERATOR NAME:</label>
                <input name='operator_name' value={this.state.operator_name} onChange={this.changeValueHandler} />
            </Form.Field>
          <Form.Field>
                <label>IP ADRESS:</label>
                <input name='ip_adress' value={this.state.ip_adress} onChange={this.changeValueHandler} />
            </Form.Field>
              <Form.Field>
                <label>USER NAME:</label>
                <input name='name' value={this.state.name} onChange={this.changeValueHandler} />
            </Form.Field>
            <Form.Field>
                <label>PASSWORD:</label>
                <input name='pass' value={this.state.pass} onChange={this.changeValueHandler} />
            </Form.Field>
            <Form.Field>
                <label>PORTAL CODE:</label>
                <input name='portal_code' value={this.state.portal_code} onChange={this.changeValueHandler}/>
            </Form.Field>
            <Button onClick={this.handleSubmit} type="submit" value="Create">CREATE</Button>
          </Form> 
        </Segment>
      </div>
    )
  }
}

export default withAlert(requireAuth(OperatorsForm))
