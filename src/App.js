import React, { Component } from "react";

import DetectRTC from "detectrtc";

import logo from "./logo.svg";
import "./App.css";
import LocalRecorder from "./LocalRecorder";

class App extends Component {
  mLocalRecorder = null;

  state = {
    loaded: false
  }


  componentDidMount() {
    DetectRTC.load(() => {
      DetectRTC.audioInputDevices = DetectRTC.audioInputDevices.filter(
        ({ deviceId, id }) => deviceId !== 'default' && deviceId !== 'communications' && deviceId !== 'Comunicaciones' && id !== 'communications'
      )

      this.setState({
        loaded: true
      })
    });
  }

  render() {
    const { audioInputDevices, videoInputDevices } = DetectRTC
    
    return (
      <div className="App">
        <header className="App-header">
          <div>
            <div>Audios: </div>
            <div>
              <select onChange={this._handleChangeAudio}>
                <option key={'audio-default'}>----Seleccione----</option>
                {
                  audioInputDevices.map(({label, id }, index) => (
                    <option key={`audio-${index}`} value={id}>{label}</option>
                  ))
                }
              </select>
            </div>
          </div>
          <div>
          <div>Videos: </div>
            <div>
              <select onChange={this._handleChangeVideo}>
                <option key={'video-default'}>----Seleccione----</option>
                {
                  videoInputDevices.map(({label, id }, index) => (
                    <option key={`video-${index}`} value={id}>{label}</option>
                  ))
                }
              </select>
            </div>
          </div>
          <div>
            <button onClick={this._handleClickStart}>Start</button>
            <button onClick={this._handleClickRecord}>Record</button>
            <button onClick={this._handleClickStop}>Stop</button>
          </div>

          <div id="video-hd" />
          <video id="video-record" controls />
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          {/* <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a> */}
        </header>
      </div>
    );
  }

  _handleChangeAudio = ev => {
    this.setState({
      audioId: ev.target.value
    })
  }

  _handleChangeVideo = ev => {
    this.setState({
      videoId: ev.target.value
    })
  }

  _handleClickStart = () => {
    const { audioId, videoId } = this.state

    this.mLocalRecorder = new LocalRecorder(audioId, videoId);
    this.mLocalRecorder.start();
  }

  _handleClickRecord = () => {
    this.mLocalRecorder.record();
  };

  _handleClickStop = () => {
    this.mLocalRecorder.stop();
  };
}

export default App;
