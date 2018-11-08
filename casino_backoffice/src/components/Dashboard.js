import React, {Component} from 'react';
import { Link } from 'react-router';
import { Button, Statistic, Icon} from 'semantic-ui-react'
// import { Statistic } from 'semantic-ui-react'
import * as extra from '../extra.js'
import axios from 'axios';
import AnimatedNumber from 'react-animated-number';
import requireAuth from './HOCS/requireAuth'


const styles = {
    marginLeft: '80%',
    marginTop: '2%',
    width: '15%',
}
const colors = [
    'red',
    'green',
]
class Dashboard extends Component {
    constructor(props){
        super()
        this.state = {
            total_sys_balance: null,
            color: colors[1]
        }
    }
    componentWillMount() {
      axios.get('https://'+ window.location.hostname + ':8158/new_path/apiv2/entry/system_balance/').then((res) => {
         // console.log(res.data.total_balance)
         if(res.data.total_balance < 0 ) {
             this.setState({
                 color: colors[0]
             })
         }
          this.setState({
              total_sys_balance: res.data.total_balance
          })

      }).catch((err) => console.log(err))
    }
   
    render(){
        console.log(this.state.total_sys_balance)
        const { color } = this.state
        return (
            <div>
            <div className='balance_wrapper'>
            
            <Statistic color={color} className="totalBalance">
                <Statistic.Label>Total System Balance</Statistic.Label>
                <Statistic.Value ><AnimatedNumber  value={this.state.total_sys_balance}
            style={{
                transition: '0.8s ease-out',
                fontSize: 25,
                transitionProperty:
                    'background-color, color, opacity'
            }}
        
            duration={1000}
            formatValue={number => extra.m2(number)}/>{<span className="total_sys_currency">XX</span>}</Statistic.Value>
            </Statistic>
           
            </div>
                <Link to="/add_new_player" ><Button positive icon='user plus' floated='right' className="greenLeftBtn" content= 'Add New Player'  /></Link>
            </div>
        )
    }
}


export default requireAuth(Dashboard)