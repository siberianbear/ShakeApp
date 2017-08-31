// @flow
import React, { Component } from 'react';
import Button from '../../components/Button';
import '../css/View1.css';
import '../css/View2.css';
import phone from '../../assets/iphone1.png';

export default class View1 extends Component {
  render() {
    return (
      <div className="viewContainer justifySpaceAround">
        <div className="item-wrap">
          <img className="item" src={phone} alt="phone1"/>
        </div>
        <Button title="Start" onClick={this.props.onClick} />
      </div>
    );
  }
}
