import React, { Component } from 'react'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import axios from 'axios'
import { withAlert } from "react-alert";
//    var options = [
//       { value: 'OK - 1000 ', label: 'OK - 1000' },
//       { value: 'TIME_OUT-2000', label: 'TIME_OUT-2000' },
//       { value: 'INTERNAL_SERVER_ERROR-3000', label: 'INTERNAL_SERVER_ERROR-3000' },
//       { value: 'EXPIRED-3100', label: 'EXPIRED-3100' },

//   ];

class SettingsForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            value: ''
        }
    }
    send_AJAX = (select) => {
        // this.setState({
        //     msg: select.value
        // });
        //  console.log(select.value.split('-'))
        if (select) {
            var arr = select.value.split('-');
        //   debugger
            this.setState({
                value: select.value
            })
            var key = this.props.type
            var obj = {};
            obj[key] = { 'code': arr[1], 'msg': arr[0], 'player_id': this.props.id };
          console.log(obj)
            axios.post('https://' + window.location.hostname + `:8158/new_path/apiv2/entry/settings/${this.props.param}`, obj).then(res => console.log(res))
            this.props.alert.success('Changed settings successfully')
        } else {
            this.setState({
                value: ''
            })
        }
        //console.log(obj)
    }
    render() {
    //console.log(this.props.alert)
         return (
    <div>
       <div className="card_title">{this.props.title}</div>
          <div className="card_body">
             <Select
                name="form-select"
                value={this.state.value}
                placeholder= {this.props.default}
                options={this.props.op}
                onChange={this.send_AJAX.bind(this)}
                clearable={true}
                className="select_drop"
               />
      </div>
     </div>
        )
   }
}


export default withAlert(SettingsForm)
