import React, { Component} from 'react';
import BackgroundUp from '../styles/images/e_portal_Zornica_up.png';

export default class Header extends Component {
    render() {
        return (
            <div className="header"><img src={BackgroundUp}/></div>
        )
    }
}
