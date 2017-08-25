// @flow
import React, { Component } from 'react';
import Button from '../../components/Button';
import backBtn from '../../assets/arrow-icon.png';
import ShakeComp from '../../components/ShakeComp';

import mag from '../../assets/hm_mag1.jpg';
import mag2 from '../../assets/hm_mag2.jpg';

import soundWin from '../../assets/sound_win.mp3';
import soundShake from '../../assets/sound_shake.mp3';
import soundLose from '../../assets/sound_lose.mp3';
import germent1 from '../../assets/black-ribbon.png';
import germent2 from '../../assets/innerwear1.png';
import germent3 from '../../assets/longsleeves.png';
import germent4 from '../../assets/shorts1.png';

import '../../components/csshake-slow.min.css';
import '../../components/csshake-hard.min.css';

import '../css/View.css';
import '../css/View2.css';

const BOTTOM_THRESHOLD_FROM = 5;
const BOTTOM_THRESHOLD_TO = 10;
const TOP_THRESHOLD = 10;
const SHAKE_TIMEOUT = 750;
const RESET_TIMEOUT = 5000;
const MAX_SHAKES_FROM = 5;
const MAX_SHAKES_TO = 10;
const SHAKES_TIMER_FROM = 10;
const SHAKES_TIMER_TO = 30;
const SHAKES_TIMER_STEP = 5;
const GARMENTS_NUMBER = 4;
const GERMENTS_ITEMS = [germent1, germent2, germent3, germent4];

export type Score = {
  high: number,
  low: number
};

export type Props = {
  onClick: Score => void,
  onBack: () => void
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
      closeBtnClass: 'hidden',
      actualStep: 0,
      dropGermentAnimation: false
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
        this.audioPlayer.src = soundLose;
        this.audioPlayer.play();

        setTimeout(() => {
          this.setState({ closeBtnClass: 'visible' });
        }, 2000);
      }
    }, 1000);
  }

  scoreDidOccur(isHigh: boolean) {
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
      if (
        score === maxShakes &&
        this.state.actualStep + 1 === GARMENTS_NUMBER
      ) {
        this.shakeComp.removeShakeListener();
        clearInterval(this.shakesTimerId); // clear shakes timer
        clearTimeout(this.clearCountTimer); // clear timeout when user wins

        this.audioPlayer.src = soundWin;
        this.audioPlayer.play();

        setTimeout(() => {
          this.props.onDone(this.state.score);
        }, 3500);
      } else if (
        score === maxShakes &&
        this.state.actualStep < GARMENTS_NUMBER
      ) {
        this.resetScore();
        this.dropGerment();
        this.setState(prevState => ({
          actualStep: prevState.actualStep + 1
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
    setTimeout(() => {
      this.setState({
        dropGermentAnimation: false
      });
    }, 2000);
  }

  onBackBtn() {
    this.audioPlayer = null; // reset player
    this.props.onBack();
  }

  render() {
    const shakesTimer = this.state.shakesTimer;

    let renderTimer = (
      <p className={'time-left'}>
        Time left: <span className="time-count"> {shakesTimer} </span> sec
      </p>
    );

    if (shakesTimer === 0) {
      clearInterval(this.shakesTimerId);
      renderTimer = <p className={'time-is-up'}>Time's up</p>;
    }

    const animateMag = this.state.animateMag;
    const itemAnimClass = animateMag.isAnimate
      ? this.state.animateMag.animHigh
        ? ' shake-constant shake-hard'
        : ' shake-constant shake-slow'
      : '';

    const renderDroppingGerment =
      this.state.dropGermentAnimation &&
      <div
        className={`garment animate-fall-${this.state.actualStep % 2 === 1
          ? 'left'
          : 'right'}`}
      >
        <img
          src={GERMENTS_ITEMS[this.state.actualStep]}
          alt="garment"
          className="garment-img"
        />
      </div>;

    return (
      <div className="viewContainer justifySpaceAround">
        <button className="back-btn" onClick={() => this.onBackBtn()}>
          <img src={backBtn} alt="back button" />
        </button>

        {renderTimer}

        <audio id="audio">
          Ваш браузер не поддерживает <code>audio</code> элемент.
        </audio>

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

        <div className="item-wrap">
          <img
            className={`item light-item${itemAnimClass}`}
            src={mag}
            ref={item => {
              this.item = item;
            }}
          />
        </div>
        {renderDroppingGerment}
        <div className="caption">
          <text>Shake the magazine and see what happens</text>
        </div>

        <Button
          className={this.state.closeBtnClass}
          title="Close"
          onClick={() => this.props.onBack()}
        />
      </div>
    );
  }
}
