// @flow
import React, { Component } from 'react';
import Button from '../../components/Button';
import '../css/View1.css';
import '../css/View3.css';

import phone2 from '../../assets/iphone2.png';

import soundWin from '../../assets/sounds/sound_win.mp3';
import soundLose from '../../assets/sounds/sound_lose.mp3';


type Props = {
  output: Output
}


export default class View3 extends Component {
  props: Props;

  won = false;
  currAnswer = null;
  userChoice = null;

  constructor(props: Props){
    super(props);

    this.state = {
      result: "",
      statusCSS: "",
      // scoreCSS: ""
    }

    this.won = false;
    this.userChoice = null;
    this.currAnswer = this.props.score;
    // console.log(this.props.score);
    this.setResult = this.setResult.bind(this);

    this.onPlay = this.onPlay.bind(this);
    this.soundWin = new Audio(soundWin);
    this.soundLose = new Audio(soundLose);
  }

  componentDidMount(){
    this.setResult();
  }

  componentWillUnmount(){
    this.onPlay();
  }

  onPlay(arg){
    if (arg === "win") {
      this.soundWin.play();
    }
    else if (arg === "lose") {
      this.soundLose.play();
    }
    else {
      this.soundWin.pause();
      this.soundLose.pause();
    }
  }

  setResult(){
    // let answer = this.currAnswer.choices[this.currAnswer.answer];
    let answer = this.currAnswer;
    // console.log(this.currAnswer.answer, this.currAnswer.choices);
    // console.log(answer, "====", this.props.output.selected + " ?");
    // this.userChoice = this.props.output.selected;
    if (answer === null) {
      this.setState({result: "Time's up!", statusCSS: "titleResultIncorrect"});
      this.onPlay("lose");
    }
    // else if (answer === this.props.output.selected) {
    else if (answer === "won") {
      this.won = true;
      this.setState({result: "You did it!", statusCSS: "titleResultCorrect"});
      this.onPlay("win");
    } else {
      this.setState({result: "Sorry, try again!", statusCSS: "titleResultIncorrect"});
      this.onPlay("lose");
    }
  }


  render() {
    return (
      <div className="viewContainer justifySpaceAround">
        {/* <text className="won">Awesome!</text> */}
        <div id={this.state.statusCSS}>{this.state.result}</div>
        <div className="item-wrap">
          <img className="item" src={phone2} alt="phone2"/>
        </div>
        <Button title="Next" onClick={this.props.onClick} />
      {/* <div id="resultInstruction">tap next button</div> */}
      </div>
    );
  }
}
