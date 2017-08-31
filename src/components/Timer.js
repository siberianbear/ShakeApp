// @flow
// import React from 'react';
import React, { Component } from 'react';

import './Timer.css';

// import soundClockTick from '../assets/sounds/clock_tick.mp3';

type Props = {
  output: Output
}

export class Timer extends Component {
    props: Props;

    constructor(props: Props){
      super();

      this.state = {
        elapsed: null,
        seconds: null,
        count: null,
        timeOut: false
      }

      // this.onPlay = this.onPlay.bind(this);
      this.tick = this.tick.bind(this);
      // this.sound = new Audio(soundClockTick);
      this.timer = setInterval(this.tick, 10); // 100
    }

    // getInitialState(){
    // }

    componentDidMount(){
      this.setState({elapsed: this.props.start*1000});
      // this.onPlay("play");
      // this.sound.addEventListener('ended', function() {
      //   this.currentTime = 0;
      //   this.play();
      // }, false);
    }

    componentWillUnmount(){
      // this.onPlay("stop");
      clearInterval(this.timer);
    }

    // onPlay(arg){
    //   if (arg === "play") {
    //     this.sound.play();
    //   }
    //   else {
    //     this.sound.pause();
    //   }
    // }

    tick(){
      this.setState({elapsed: this.state.elapsed-10});
      this.setState({seconds: (this.state.count / 1000).toFixed(2)});
      this.setState({count: this.state.elapsed-10});
      if (this.state.count < 0) {
        clearInterval(this.timer);
        // this.onPlay("stop");
        this.setState({currentPage: 3});
        this.setState({timeOut: true}); // we update our state
        this.props.callbackParent(true);
        // console.log("timer finished!");
      }
    }

    render() {
        return (
          <div className="theTimer">
           Time left: <span className="timer-dynamic-text">{this.state.seconds}s</span>
          </div>
        );
    }
};
