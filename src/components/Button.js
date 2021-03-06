// @flow
import React, { Component } from 'react';
import './Button.css';

export default class Button extends Component {
  render(){
    // let className = 'button uppercase bold';
    let className = 'mainBttn';
    if (this.props.isActive){
      className += ' buttonActive';
    }

    if (this.props.className){
      className += ' ' + this.props.className;
    }
    return (
      <div className={className} onClick={this.props.onClick}>{this.props.title}</div>
    );
  }
}
