// @flow
import React, { Component } from 'react';
// import Button from '../../components/Button';
import ProgressCircle from '../../components/ProgressCircle';
// import backBtn from '../../assets/arrow-icon.png';
import ShakeComp from '../../components/ShakeComp';

import phone from '../../assets/iphone2.png';

import soundShake from '../../assets/sounds/sound_shake.mp3';

// GERMENTS_ITEMS
import icon1 from '../../assets/icon01.jpg';
import icon2 from '../../assets/icon02.jpg';
import icon3 from '../../assets/icon03.jpg';
import icon4 from '../../assets/icon04.jpg';
import icon5 from '../../assets/icon05.jpg';
import icon6 from '../../assets/icon06.jpg';
import icon7 from '../../assets/icon07.jpg';
import icon8 from '../../assets/icon08.jpg';
import icon9 from '../../assets/icon09.jpg';
import icon10 from '../../assets/icon10.jpg';
import icon11 from '../../assets/icon11.jpg';
import icon12 from '../../assets/icon12.jpg';

import {Timer} from '../../components/Timer';

import '../../components/csshake-slow.min.css';
import '../../components/csshake-hard.min.css';

// import '../css/View1.css';
import '../css/View2.css';

const BOTTOM_THRESHOLD_FROM = 5;
const BOTTOM_THRESHOLD_TO = 10;
const TOP_THRESHOLD = 10;
const SHAKE_TIMEOUT = 750;
const RESET_TIMEOUT = 5000;
const MAX_SHAKES_FROM = 2; //5
const MAX_SHAKES_TO = 4; //15
const SHAKES_TIMER_FROM = 25; //10
const SHAKES_TIMER_TO = 30; //30
const SHAKES_TIMER_STEP = 5;//5
const GARMENTS_NUMBER = 12;
const GERMENTS_ITEMS = [icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, icon9, icon10, icon11, icon12];

const setTime = 30; // in seconds

export type Score = {
  high: number,
  low: number
};

export type Props = {
  onClick: Score => void,
  // onBack: () => void,
  // onDone: () => void
  onDone: Score => void
};

type GarmentsSettings = {
  steps: Array<{
    stepNumber: number,
    maxShakes: number,
    shakesTimer: number
  }>,
  totalShakes: number
};

const randomMaxShakes = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};

const randomShakeTimer = (min, max, step) =>
  min + step * Math.floor(Math.random() * (max - min) / step);

const randomGarmentsSettings = (number: number): GarmentsSettings => {
  const steps = [];
  let totalShakes = 0;
  for (let index = 0; index < number; index++) {
    const shakes = randomMaxShakes(MAX_SHAKES_FROM, MAX_SHAKES_TO);
    steps.push({
      stepNumber: index,
      maxShakes: shakes
    });
    totalShakes += shakes;
  }
  return { steps, totalShakes };
};

const garmentsSettings = randomGarmentsSettings(GARMENTS_NUMBER);

export default class View2 extends Component {
  item: any;

  state: {
    score: Score,
    isDoneBtnVisible: boolean,
    animateMag: object,
    image: string,
    shakesTimer: number,
    soundToPlay: string,
    actualStep: number,
    dropGermentAnimation: boolean
  };

  shakeComp: ShakeComp;
  maxShakes: number;
  audioPlayer: any;
  shakeTimer: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      score: {
        high: 0,
        low: 0
      },
      isDoneBtnVisible: false,
      animateMag: {
        isAnimate: false,
        animHigh: false
      },
      image: 'light',
      shakesTimer: randomShakeTimer(
        SHAKES_TIMER_FROM,
        SHAKES_TIMER_TO,
        SHAKES_TIMER_STEP
      ),
      // closeBtnClass: 'hidden',
      actualStep: 0,
      dropGermentAnimation: false,
      progress: 100
    };
    this.clearCountTimer = null;
    this.shakesTimerId = null;
  }

  componentDidMount() {
    this.audioPlayer = document.getElementById('audio');

    this.shakesTimerId = setInterval(() => {
      this.setState((prevState, props) => ({
        shakesTimer: prevState.shakesTimer - 1
      }));

      if (this.state.shakesTimer === 0) {
        clearInterval(this.shakesTimerId);
        clearTimeout(this.clearCountTimer);
        this.shakeComp.removeShakeListener();
        // this.audioPlayer.src = soundLose;
        // this.audioPlayer.play();

        setTimeout(() => {
          // this.setState({ closeBtnClass: 'visible' });
        }, 2000);
      }
    }, 1000);
    // alert(this.state.shakesTimer);
  }

  scoreDidOccur(isHigh: boolean) {
    // console.log("score");
    if (isHigh) {
      let score = this.state.score.high + 1;
      const maxShakes = garmentsSettings.steps[this.state.actualStep].maxShakes;

      this.setState({
        score: {
          high: score,
          low: this.state.score.low
        },
        animateMag: {
          isAnimate: true,
          animHigh: true
        }
      });

      // check if user has max count
      // if (score === maxShakes && this.state.actualStep + 1 === GARMENTS_NUMBER) {
      if (this.state.actualStep === GARMENTS_NUMBER) {
        this.shakeComp.removeShakeListener();
        clearInterval(this.shakesTimerId); // clear shakes timer
        clearTimeout(this.clearCountTimer); // clear timeout when user wins

        // this.audioPlayer.src = soundWin;
        // this.audioPlayer.play();

        setTimeout(() => {
          this.setState({progress: 0});
          this.props.onDone("won");
        }, 3500);
      } else if (score === maxShakes && this.state.actualStep < GARMENTS_NUMBER) {
        this.resetScore();
        this.dropGerment();
        this.dropGerment();
        this.setState(prevState => ({
          actualStep: prevState.actualStep + 2
        }));
        setTimeout(() => {
          this.setState({
            animateMag: {
              isAnimate: false
            }
          });
        }, SHAKE_TIMEOUT);
      } else {
        // shake high
        this.audioPlayer.src = soundShake;
        this.audioPlayer.play();

        setTimeout(() => {
          this.setState({
            animateMag: {
              isAnimate: false
            }
          });
        }, SHAKE_TIMEOUT);
      }
    } else {
      // if shake was low
      this.setState({
        score: {
          high: this.state.score.high,
          low: this.state.score.low + 1
        },
        animateMag: {
          isAnimate: true,
          animHigh: false
        }
      });

      setTimeout(() => {
        this.setState({
          animateMag: {
            isAnimate: false
          }
        });
        // this.props.onDone("no");
      }, SHAKE_TIMEOUT);

    }
  }

  resetScore() {
    this.setState({
      score: {
        high: 0,
        low: 0
      }
    });
  }

  clearTimer() {
    clearTimeout(this.clearCountTimer); // cancel the previous timer.
    this.clearCountTimer = null;
  }

  shakeDidOccur() {
    // document.getElementById('topText').style.display = 'none';
    document.getElementById('topText').style.visibility = 'hidden';
    // reset previous timeout
    if (this.clearCountTimer) {
      this.clearTimer();
    }

    this.clearCountTimer = setTimeout(() => {
      this.resetScore();
    }, RESET_TIMEOUT);
  }

  dropGerment() {
    this.setState({ dropGermentAnimation: true });
    // this.setState({progress: Math.round(this.state.progress-8.3)});
    this.setState({progress: Math.round(this.state.progress-8)});
    if(this.state.progress === 4) {
      this.setState({progress: 0});
      this.props.onDone("won");
    }
    setTimeout(() => {
      this.setState({
        dropGermentAnimation: false
      });
    }, 2000);
  }

  // onBackBtn() {
  //   this.audioPlayer = null; // reset player
  //   this.props.onBack();
  // }

  onChildChanged(newState) {
    console.log("timeout happens");
    // this.props.onDone({theQuiz: this.state.score, selected: null})
    clearInterval(this.shakesTimerId);
    clearTimeout(this.clearCountTimer);
    this.props.onDone(null);
  }

  onSelected(selectedChoice){
    // this.props.onClick({theQuiz: this.state.diceDrop, selected: selectedChoice})
  }

  render() {
    const shakesTimer = this.state.shakesTimer;

    // let renderTimer = (
    //   <p className={'time-left'}>
    //     Time left: <span className="time-count"> {shakesTimer} </span> sec
    //   </p>
    // );

    if (shakesTimer === 0) {
      clearInterval(this.shakesTimerId);
      // renderTimer = <p className={'time-is-up'}>Time's up</p>;
    }

    const animateMag = this.state.animateMag;
    const itemAnimClass = animateMag.isAnimate
      ? this.state.animateMag.animHigh
        // ? ' shake-constant shake-hard'
        ? ' shake-constant shake-slow'
        : ' shake-constant shake-slow'
      : '';

    const renderDroppingGerment =
      this.state.dropGermentAnimation &&
      <div className={`garment animate-fall-${this.state.actualStep % 2 === 1
          ? 'left' : 'right'}`}>
        <img src={GERMENTS_ITEMS[this.state.actualStep]}
          alt="falling icon"
          className="garment-img" />
      </div>;
    const renderDroppingGerment1 =
      this.state.dropGermentAnimation &&
      <div className={`garment animate-fall-${this.state.actualStep % 2 === 1
          ? 'right' : 'left'}`}>
        <img src={GERMENTS_ITEMS[this.state.actualStep+1]}
          alt="falling icon"
          className="garment-img" />
      </div>;

    return (
      <div className="viewContainer justifySpaceAround">
        {/* <button className="back-btn" onClick={() => this.onBackBtn()}>
          <img src={backBtn} alt="back button" />
        </button> */}

        {/* {renderTimer} */}

        <audio id="audio">Sadly your browser doesn't support <code>audio</code> element.</audio>

        <ShakeComp
          options={{
            thresholdBottomFrom: BOTTOM_THRESHOLD_FROM,
            thresholdBottomTo: BOTTOM_THRESHOLD_TO,
            thresholdTop: TOP_THRESHOLD,
            maxCount: garmentsSettings.totalShakes,
            timeout: SHAKE_TIMEOUT
          }}
          scoreDidOccur={type => this.scoreDidOccur(type)}
          resetScore={this.resetScore}
          shakeDidOccur={this.shakeDidOccur.bind(this)}
          ref={item => {
            this.shakeComp = item;
          }}
        />

        <div id="topText">Full</div>
        <div className="item-wrap">
          <img
            className={`item light-item${itemAnimClass}`} alt="phone2"
            src={phone}
            ref={item => {
              this.item = item;
            }}
          />
          <ProgressCircle init={this.state.progress}/>
        </div>
        {renderDroppingGerment}
        {renderDroppingGerment1}
        <div className="instruction">Shake the phone</div>
        {/* <div className="caption">
          <text>Shake the magazine and see what happens</text>
        </div> */}

        <Timer start={setTime} callbackParent={(newState) => this.onChildChanged(newState) }/>

        {/* <Button
          className={this.state.closeBtnClass}
          title="Close"
          onClick={() => this.props.onBack()}
        /> */}
      </div>
    );
  }
}
