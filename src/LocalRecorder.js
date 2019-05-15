export default class LocalRecorder {
  constructor(audioId, videoId) {
    this.audioId = audioId;
    this.videoId = videoId;
    this.streamRecorder = null;
    this.chunks = [];
    this.mimeOptions = null;
  }

  start = () => {
    if (this.streamRecorder) return;
    this.chunks = [];

    if (navigator.mediaDevices.getUserMedia) {
      this.videoElement = document.createElement("video");
      this.videoElement.id = "videoRecorderEl";
      this.videoElement.muted = true;
      this.videoElement.volume = 0;

      const videoHD = document.getElementById("video-hd");
      videoHD.appendChild(this.videoElement);

      this.videoElement.play();

      navigator.mediaDevices
        .getUserMedia({
          audio: {
            deviceId: this.audioId
          },
          // audio: false,
          video: {
            deviceId: this.videoId
          }
        })
        .then(stream => {
          this.videoElement.srcObject = stream;
          this.userStream = stream;

          const mediaOptions = {
            webm: "video/webm",
            webmAll: "video/webm;codecs=h264,vp9,opus",
            webmh264: "video/webm;codecs=h264",
            webmh264opus: "video/webm;codecs=h264,opus",
            webmvp8: "video/webm;codecs=vp8",
            webmvp8opus: "video/webm;codecs=vp8,opus",
            webmvp9: "video/webm;codecs=vp9",
            webmvp9opus: "video/webm;codecs=vp9,opus"
          };

          if (MediaRecorder.isTypeSupported(mediaOptions.webmAll))
            this.mimeOptions = mediaOptions.webmAll;
          else if (MediaRecorder.isTypeSupported(mediaOptions.webmh264opus))
            this.mimeOptions = mediaOptions.webmh264opus;
          else if (MediaRecorder.isTypeSupported(mediaOptions.webmvp9opus))
            this.mimeOptions = mediaOptions.webmvp9opus;
          else if (MediaRecorder.isTypeSupported(mediaOptions.webmvp8opus))
            this.mimeOptions = mediaOptions.webmvp8opus;
          else if (MediaRecorder.isTypeSupported(mediaOptions.webmh264))
            this.mimeOptions = mediaOptions.webmh264;
          else if (MediaRecorder.isTypeSupported(mediaOptions.webmvp9))
            this.mimeOptions = mediaOptions.webmvp9;
          else if (MediaRecorder.isTypeSupported(mediaOptions.webmvp8))
            this.mimeOptions = mediaOptions.webmvp8;
          else this.mimeOptions = mediaOptions.webm;

          console.log("*****************************");
          console.log("MimeOptions:", this.mimeOptions);
          console.log("*****************************");

          try {
            this.streamRecorder = new MediaRecorder(this.userStream, {
              audioBitsPerSecond: 40000,
              mimeType: this.mimeOptions,
              videoBitsPerSecond: 300000
            });


            var audioContext = new AudioContext();
            let analyser = audioContext.createAnalyser()
            var microphone = audioContext.createMediaStreamSource(stream)
            var script = audioContext.createScriptProcessor(2048,1,1);
            // let instant = 0

            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 1024;
            
            script.onaudioprocess = event => {
              var array = new Uint8Array(analyser.frequencyBinCount);
              analyser.getByteFrequencyData(array);
              var values = 0;

              var length = array.length;
              for (var i = 0; i < length; i++) {
                values += (array[i]);
              }

              var average = values / length;

              console.log(Math.round(average));

              // // Do something with the data, i.e Convert this to WAV
              // var input = event.inputBuffer.getChannelData(0)
              // var i
              // var sum = 0.0
              // for (i = 0; i < input.length; ++i)
              //   sum += input[i] * input[i]
              // instant = Math.sqrt(sum / input.length)
            
              // console.log('instant: ', instant.toFixed(4) * 100);
            };

            microphone.connect(analyser);
            analyser.connect(script)
            script.connect(audioContext.destination);
          } catch (error) {
            console.log("MediaRecorder error: ", error);
            alert(
              "No se puede realizar una videollamada debido a que no se han cargado los parametros de grabacion"
            );

            return error;
          }

          console.log("this.streamRecorder: ", this.streamRecorder);

          this.streamRecorder.ondataavailable = e => {
            this.chunks.push(e.data);
          };
        })
        .catch(err => {
          console.log("err: ", err);
        });
    }
  };

  record = () => {
    if (!this.streamRecorder) {
      alert("No se ah inicido recorder");
      return;
    }

    if (this.streamRecorder.state !== "recording") {
      console.log("startRecording");
      this.streamRecorder.start();
    }
  };

  stop = () => {
    if (!this.streamRecorder) return;
    this.streamRecorder.stop();

    this.streamRecorder = null;

    setTimeout(() => {
      console.log("this.chunks: ", this.chunks);
      console.log("this.mimeOptions: ", this.mimeOptions);

      const blob = new Blob(this.chunks, {
        type: this.mimeOptions
      });

      const videoURL = window.URL.createObjectURL(blob);

      const videoRecord = document.getElementById("video-record");

      // videoRecord.srcObject = blob;
      videoRecord.src = videoURL;
      console.log("RECORD STOP");
    }, 2000);
  };
}
