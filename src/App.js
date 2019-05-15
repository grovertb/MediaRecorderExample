import React, { Component } from "react";

import DetectRTC from "detectrtc";

import logo from "./logo.svg";
import "./App.css";
import LocalRecorder from "./LocalRecorder";

class App extends Component {
  mLocalRecorder = null;

  componentDidMount() {
    DetectRTC.load(() => {
      for (let i = 0; i < DetectRTC.audioInputDevices.length; i++) {
        if (
          DetectRTC.audioInputDevices[i].deviceId === "default" ||
          DetectRTC.audioInputDevices[i].deviceId === "communications" ||
          DetectRTC.audioInputDevices[i].deviceId === "Comunicaciones" ||
          DetectRTC.audioInputDevices[i].id === "communications"
        ) {
          DetectRTC.audioInputDevices.splice(i, 1);
        }
      }
      console.log(DetectRTC.videoInputDevices);
      console.log(DetectRTC.audioInputDevices);

      const {
        deviceId: videoId,
        label: labelVideo
      } = DetectRTC.videoInputDevices[0];
      const {
        deviceId: audioId,
        label: labelAudio
      } = DetectRTC.audioInputDevices[1];

      console.log("video: ", labelVideo, videoId);
      console.log("audio: ", labelAudio, audioId);

      this.mLocalRecorder = new LocalRecorder(audioId, videoId);

      this.mLocalRecorder.start();
    });
  }

  render() {
    return (
      <div className="App">
        <div id="video-hd" />
        <video id="video-record" controls />
        <button onClick={this._handleClickRecord}>Record</button>
        <button onClick={this._handleClickStop}>Stop</button>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }

  _handleClickRecord = () => {
    this.mLocalRecorder.record();
  };

  _handleClickStop = () => {
    this.mLocalRecorder.stop();
  };
}

export default App;
