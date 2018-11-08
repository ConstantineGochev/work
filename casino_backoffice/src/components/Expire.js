import React, {Component} from 'react';


class Expire extends Component{
    constructor(props){
        super()
        this.state = {
            visible: true
        }
        this._timer;
    }


  componentWillReceiveProps = (nextProps) => {
    // reset the timer if children are changed
    if (nextProps.children !== this.props.children) {
      this.setTimer();
      this.setState({visible: true});
    }
  }
  componentDidMount(){
      this.setTimer();
  }
  setTimer =  () => {
    // clear any existing timer
    this._timer != null ? clearTimeout(this._timer) : null;
    
    // hide after `delay` milliseconds
    this._timer = setTimeout(function(){
      this.setState({visible: false});
      this._timer = null;
    }.bind(this), this.props.delay);
  }
  render(){
      //debugger;
    return (this.state.visible 
           ? <div>{this.props.children}</div>
           : <span />
    )
  }
};

export default Expire