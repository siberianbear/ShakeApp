// @flow
import React, { Component } from 'react';
import Button from '../../components/Button';
import '../css/View.css';
import '../css/View3.css';

import mag2 from '../../assets/hm_mag2.jpg';

export default class View3 extends Component {
  render() {
    return (
      <div className="viewContainer justifySpaceAround">
        <text className="won">Well done!!!</text>
        <div className="item-wrap">
          <img className="item" src={mag2} />
        </div>
        <Button title="Next" onClick={this.props.onClick} />
      </div>
    );
  }
}
