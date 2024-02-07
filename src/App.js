import React from 'react';
import './App.css';
import plusImg from './Plus.svg';
import minusImg from './Minus.svg';
import playImg from './Play.svg';
import pauseImg from './Pause icon.svg';
import resetImg from './Reset.svg';
import beepAudio from './Beep Buzzer Fail.wav';


class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength : 5,
      sessionLength: 25,
      timeLeft: '25',
      seconds: '00',
      status: 'Session',
      timerIsOn : false,
      currentImg: playImg
    }
  }

  handleReset = () => {
    this.setState({
      breakLength : 5,
      sessionLength: 25,
      timeLeft: '25',
      seconds: '00',
      status: 'Session',
      timerIsOn : false,
      currentImg: playImg
    })
    clearInterval(this.intervalId); 
    this.intervalId = null;
    document.getElementById('beep').pause();
    document.getElementById('beep').load();
  }

  handleIncrementOrDecrement = (event) => {
    this.setState((prevState) => {
      const { breakLength, sessionLength, status, timerIsOn } = prevState;
      if (timerIsOn) {
        return prevState
      }
      switch(event.target.id) {
       case 'break-decrement':
        if(breakLength === 1) {
          return prevState;
        }
        if (status === 'Break') {
          return {
            breakLength: breakLength - 1,
            timeLeft: breakLength - 1 < 10 ? '0' + String(breakLength - 1 ) :String(breakLength - 1 ) ,
            seconds: '00',
          };
        }
        return {
          breakLength: breakLength - 1,
        };
       case 'break-increment':
        if(breakLength === 60) {
          return prevState;
        }
        if (status === 'Break') {
          return {
            breakLength: breakLength + 1,
            timeLeft: breakLength + 1 < 10 ? '0' + String(breakLength + 1 ) :String(breakLength + 1 ),
            seconds: '00'
          };
        }
        return {
          breakLength: breakLength + 1
        };
       case 'session-decrement':
        if(sessionLength === 1) {
          return prevState;
        }
        if (status === 'Session') {
          return {
            sessionLength: sessionLength - 1,
            timeLeft: sessionLength - 1 < 10 ? '0' + String(sessionLength - 1 ) :String(sessionLength - 1 ),
            seconds: '00'
          };
        }
        return {
          sessionLength: sessionLength - 1
        };
       case 'session-increment':
        if(sessionLength === 60) {
          return prevState;
        }
        if (status === 'Session') {
          return {
            sessionLength: sessionLength + 1,
            timeLeft: sessionLength + 1 < 10 ? '0' + String(sessionLength + 1 ) :String(sessionLength + 1 ),
            seconds: '00'
          };
        }
        return {
          sessionLength: sessionLength + 1
        };
       default:
        return prevState;
      }
    })
  }

  handlePlayOrPause = () => {
  this.setState((prevState) => {
    let { timerIsOn, currentImg } = prevState;
    timerIsOn = !timerIsOn;

    if (currentImg === playImg) {
      currentImg = pauseImg;
    } else {
      currentImg = playImg;
    }

    if (!timerIsOn) {
      clearInterval(this.intervalId); 
      this.intervalId = null;
    } else if (!this.intervalId) {
      this.intervalId = setInterval(this.updateTimer, 1000); 
    }

    return {
      timerIsOn: timerIsOn,
      currentImg: currentImg,
    };
  });
};

intervalId = null; 

updateTimer = () => {
  this.setState((prevState) => {
    let { breakLength, sessionLength, timeLeft, seconds, status } = prevState;

    if (Number(seconds) === 0) {
      if (Number(timeLeft) === 0 && status === 'Session') {
        document.getElementById('beep').play();
        return {
          timeLeft: breakLength < 10 ? '0' + String(breakLength) : String(breakLength),
          seconds: seconds,
          status: 'Break'
        };
      } else if (Number(timeLeft) === 0 && status === 'Break') {
        document.getElementById('beep').play();
         return {
            timeLeft: sessionLength < 10 ? '0' + String(sessionLength) : String(sessionLength),
            seconds: seconds,
            status: 'Session'
          };
      } else {
          return {
            timeLeft: Number(timeLeft) -1 < 10 ? '0' + String(Number(timeLeft) - 1) : String(Number(timeLeft) - 1),
            seconds: '59',
            status: status
         };
      }
    }


    seconds = Number(seconds) -1 < 10 ? '0' + String(Number(seconds) - 1) : String(Number(seconds) - 1);

    return {
      timeLeft: timeLeft,
      seconds: seconds,
      status: status,
    };
  });
};


  render() {
    
    return (
      <div className='clock-wrapper'>
        <div className='break-wrapper'>
          <div id="break-label">Break Length</div>
          <div className='bottom-wrapper'>
            <button id="break-decrement" onClick={this.handleIncrementOrDecrement}>
              <img src={minusImg} alt='decrement'></img>
            </button>
            <div id="break-length">{this.state.breakLength}</div>
            <button id="break-increment" onClick={this.handleIncrementOrDecrement}>
              <img src={plusImg} alt='increment'></img>
            </button>
          </div>
        </div>
        <div className='session-wrapper'>
          <div id="session-label">Session Length</div>
          <div className='bottom-wrapper'>
            <button id="session-decrement" onClick={this.handleIncrementOrDecrement}>
              <img src={minusImg} alt='decrement'></img>
            </button>
            <div id="session-length">{this.state.sessionLength}</div>
            <button id="session-increment" onClick={this.handleIncrementOrDecrement}>
              <img src={plusImg} alt='increment'></img>
            </button>
          </div>
        </div>
        <div className='timer-wrapper'>
          <div id="timer-label">Time Remaining for the current {this.state.status} :</div>
          <div id="time-left"> {this.state.timeLeft}:{this.state.seconds} </div>
          <div className='button-group'>
            <button id="start_stop" onClick={this.handlePlayOrPause}>
              <img src={this.state.currentImg} alt='play/pause'></img>
            </button>
            <button id="reset" onClick={this.handleReset}>
              <img src={resetImg} alt='reset'></img>
            </button>
          </div>
        </div>
        <audio src={beepAudio} id='beep'></audio>
      </div>
    )
  }
}

export default Clock;
