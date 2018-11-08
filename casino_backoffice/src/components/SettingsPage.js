import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Redirect, browserHistory } from 'react-router';
import Select from 'react-select';
import { Segment, Label, Grid, Header, Icon } from 'semantic-ui-react'
import 'react-select/dist/react-select.css';
import axios from 'axios'
import SettingsForm from './SettingsForm';
import * as extra from '../extra'

class SettingsPage extends Component {
    constructor(props) {
        super()
        // console.log(this.props.players.player)

        this.state = {
            screenname: '',
            password: '',
            player_id: 0,
            value: '',
            balance: 0,
            settings: {
                auth: '',
                withdr: '',
                deposit: ''
            },
            settings_continue: {
                withdr: '',
                deposit: ''
            },
            settings_cancel: {
                deposit: ''
            },
            wWidth: 2
        }
    }


    set_player = (screenname, player_id, password, settings,balance, settings_continue, settings_cancel) => {
        // console.log(settings.auth.code)
        //   console.log(this.state.settings.auth)
        this.setState({
            screenname,
            player_id,
            password,
            balance,
            settings: {
                auth: this.set_current_settings(settings.auth),
                withdr: this.set_current_settings(settings.withdr),
                deposit: this.set_current_settings(settings.deposit)
            },
            settings_continue: {
                withdr: this.set_current_settings(settings_continue.withdr),
                deposit: this.set_current_settings(settings_continue.deposit)
            },
            settings_cancel: {
                deposit: this.set_current_settings(settings_cancel.deposit)
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.players.player !== undefined) {
            const { screenname, player_id, password, settings,balance, settings_continue, settings_cancel } = nextProps.players.player
            this.set_player(screenname, player_id, password, settings,balance, settings_continue, settings_cancel)
        }
    }

    set_current_settings(obj, type) {
        const { code, msg } = obj
        var str = msg + '-' + code
        return str.trim()
    }
    resize = () => {
        if(window.innerWidth <= 800){
            console.log("IN")
            this.setState({
             wWidth: 1
            })
        }else{
            this.setState({
                wWidth: 2
            })
        }
    //    return window.innerWidth
    }
    // componentWillMount(){
    //     // this.resize
    //     window.addEventListener('resize', this.resize)
    // }
    // componentDidMount(){
    //     window.addEventListener('resize', this.resize)
    // }
    render() {
        // console.log(this.resize)
        console.log(this.state.wWidth)
        if (this.props.players && this.props.players.player && 0 === Object.keys(this.props.players.player).length) {
            return (

                <div>
                    {/* {window.location.href = '/'} */}
                    { this.props.router.goBack()}
               </div>

            )
        }
        var AuthOptions = [
            { value: 'OK - 1000 ', label: 'OK - 1000' },
            { value: 'TIME_OUT-2000', label: 'TIME_OUT-2000' },
            { value: 'INTERNAL_SERVER_ERROR-3000', label: 'INTERNAL_SERVER_ERROR-3000' },
            { value: 'EXPIRED-3100', label: 'EXPIRED-3100' },

        ];
        var WithdawOptions = [
            { value: 'OK - 1000 ', label: 'OK - 1000' },
            { value: 'DUPLICATE-1100', label: 'DUPLICATE-1100' },
            { value: 'DO_REALITY_CHECK-1300', label: 'DO_REALITY_CHECK-1300' },
            { value: 'TIME_PROXIMITY_ALERT-1400', label: 'TIME_PROXIMITY_ALERT-1400' },
            { value: 'CREDIT_LEFT_ALERT-1500', label: 'CREDIT_LEFT_ALERT-1500' },
            { value: 'TIME_OUT-2000', label: 'TIME_OUT-2000' },
            { value: 'INTERNAL_SERVER_ERROR-3000', label: 'INTERNAL_SERVER_ERROR-3000' },
            { value: 'INSUFFICIENT_FUNDS-3100', label: 'INSUFFICIENT_FUNDS-3100' },
            { value: 'BET_LIMIT_REACHED-3300', label: 'BET_LIMIT_REACHED-3300' },
            { value: 'LOSS_LIMIT_REACHED-3400', label: 'LOSS_LIMIT_REACHED-3400' },
            { value: 'SESSION_TIME_LIMIT_REACHED-3500', label: 'SESSION_TIME_LIMIT_REACHED-3500' },


        ];
        var DepositOptions = [
            { value: 'OK - 1000 ', label: 'OK - 1000' },
            { value: 'DUPLICATE-1100', label: 'DUPLICATE-1100' },
            { value: 'DO_REALITY_CHECK-1300', label: 'DO_REALITY_CHECK-1300' },
            { value: 'TIME_PROXIMITY_ALERT-1400', label: 'TIME_PROXIMITY_ALERT-1400' },
            { value: 'CREDIT_LEFT_ALERT-1500', label: 'CREDIT_LEFT_ALERT-1500' },
            { value: 'TIME_OUT-2000', label: 'TIME_OUT-2000' },
            { value: 'INTERNAL_SERVER_ERROR-3000', label: 'INTERNAL_SERVER_ERROR-3000' },
            { value: 'INSUFFICIENT_FUNDS-3100', label: 'INSUFFICIENT_FUNDS-3100' },
            { value: 'BET_LIMIT_REACHED-3300', label: 'BET_LIMIT_REACHED-3300' },
            { value: 'LOSS_LIMIT_REACHED-3400', label: 'LOSS_LIMIT_REACHED-3400' },
            { value: 'SESSION_TIME_LIMIT_REACHED-3500', label: 'SESSION_TIME_LIMIT_REACHED-3500' },


        ];
        // console.log(this.set_current_settings(this.state.settings,'auth'))
        //console.log(this.state.settings.auth)
        //  var {msg, code} = this.state.settings.auth;
        return (
            <div>
                {/* <div className="player_cred">
                    <div className="flex-row form-header">Player info </div>
                    <div className="flex-row" >
                        Screenname =>
    {this.state.screenname ? this.state.screenname : ''}
                    </div>
                    <div className="flex-row" >
                        Player ID =>
    {this.state.player_id ? this.state.player_id : ''}

                    </div>
                    <div className="flex-row" >
                        Password =>
    {this.state.password ? this.state.password : ''}
                    </div>
                    <div className="flex-row" >
                        Balance =>
    {this.state.balance ? extra.m(this.state.balance, 'XXX') : ''}
                    </div>
                </div> */}
                                <Segment raised id="playerInfoS">
                                <Header as='h2' icon textAlign='center'>
                                <Icon name='users' circular />
                                <Header.Content>PLAYER INFO</Header.Content>
                                </Header>
                   <div> 
                    <Label as='a' color='red' ribbon>
                    SCREENNAME
                    </Label>
                    <span>{this.state.screenname ? this.state.screenname : ''}</span>
                   </div>
                   <div> 
                    <Label as='a' color='red' ribbon>
                    PLAYER ID
                    </Label>
                    <span>{this.state.player_id ? this.state.player_id : ''}</span>
                   </div>
                   <div> 
                    <Label as='a' color='red' ribbon>
                    PASSWORD
                    </Label>
                    <span>{this.state.password ? this.state.password : ''}</span>
                   </div>
                   <div> 
                    <Label as='a' color='red' ribbon>
                    BALANCE
                    </Label>
                    <span>{this.state.balance ? extra.m(this.state.balance, 'XXX') : ''}</span>
                   </div>  
                </Segment>
                <br />

                {/* <div className="select_wrap"> */}
               <div className="playerInfoWrapper"> 
                <Grid columns={this.state.wWidth} id="playerInfoSelect">
                    <Grid.Column>
                        <SettingsForm op={AuthOptions} id={this.state.player_id} type='auth' default={this.state.settings.auth} param='0' title="Authenticate Settings:" />
                        <SettingsForm op={WithdawOptions} id={this.state.player_id} type='withdr' default={this.state.settings.withdr} param='0' title="Withdraw Settings: " />   
                        <SettingsForm op={WithdawOptions} id={this.state.player_id} type='withdr' default={this.state.settings_continue.withdr} param='1' title="Withdraw ROUND_CONTINUE Settings:" />
                    </Grid.Column>
                    <Grid.Column>  
                        <SettingsForm op={DepositOptions} id={this.state.player_id} type='deposit' default={this.state.settings.deposit} param='0' title="Deposit Settings:" />
                        <SettingsForm op={DepositOptions} id={this.state.player_id} type='deposit' default={this.state.settings_continue.deposit} param='1' title="Deposit ROUND_CONTINUE Settings:" />
                        <SettingsForm op={DepositOptions} id={this.state.player_id} type='deposit' default={this.state.settings_cancel.deposit} param='2' title="Deposit ROUND_CANCEL Settings:" />
                    </Grid.Column>
                </Grid>
                </div>
                <div>
                </div>
                <br />

            </div>
        )
    }
}
function map_state_to_props(state) {
    //  console.log(state.players)
    //if(state.players != undefined) {
    return {
        players: state.players
    }

    // } else {
    //   return {}
    // }
}

export default connect(map_state_to_props)(SettingsPage)