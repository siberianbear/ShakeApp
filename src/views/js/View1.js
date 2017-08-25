// @flow
import React, { Component } from 'react';
import Button from '../../components/Button';
import '../css/View.css';
import '../css/View2.css';
import mag from '../../assets/hm_mag1.jpg';

export default class View1 extends Component {
  render() {
    return (
      <div className="viewContainer justifySpaceAround">
        <div className="item-wrap">
          <img className="item" src={mag} />
        </div>
        <Button title="Play" onClick={this.props.onClick} />
      </div>
    );
  }
}
