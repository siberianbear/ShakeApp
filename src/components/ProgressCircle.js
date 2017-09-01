// @flow
import React, { Component } from 'react';
import './ProgressCircle.css';

export default class ProgressCircle extends Component {
  render(){
    // let className = 'button uppercase bold';
    let className = 'ProgressCircle';
    if (this.props.isActive){
      className += ' buttonActive';
    }

    if (this.props.className){
      className += ' ' + this.props.className;
    }
    return (
      <div className={className} onClick={this.props.onClick}>{this.props.init}%</div>
    );
  }
}
