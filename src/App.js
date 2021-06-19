import React, { useState, useEffect, useRef } from 'react';
import one from './rene/1.png';
import two from './rene/2.png';
import three from './rene/3.png';
import four from './rene/4.png';

import './App.css';

function App() {
  const [detecting, setDetecting] = useState(false);
  const [support, setSupport] = useState("");
  const twoRef = useRef();

  let countNum;

  navigator.getUserMedia = ( navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia );

  const askSupport = () => {
    if (navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) { 
      setSupport(true);
      console.log('support')
    } else {
      setSupport(false);
      console.log("not support")
    }
  }

  let constraints = { 
      video : false, 
      audio : true 
  }

  if(support){
    let promise = navigator.mediaDevices.getUserMedia(constraints);
    promise.then(callback).catch(err => console.log(err));
  } else {
    alert('지금 쓰고 계시는 거 마이크 안먹힙니다')
  }

  function callback(stream) {
      let ctx = new AudioContext();
      let mic = ctx.createMediaStreamSource(stream);
      let analyser = ctx.createAnalyser();
      
      mic.connect(analyser);
      countNum = 0;

      if(detecting){
        function play() {
          let array = new Uint8Array(analyser.frequencyBinCount);
          let values = 0;
          
          analyser.getByteFrequencyData(array);

          let length = array.length;

          for (let i = 0; i < length; i++) {
              values += (array[i]);
          }

          var average = values / length;

          if(average > 100){
              twoRef.current.style.width = `${Math.round(average - 80)}%`;
              countNum = countNum + 1;
              console.log(Math.round(average), countNum);
          } else {
            twoRef.current.style.width = `10%`;
            countNum = 0;
          }
          requestAnimationFrame(play);
        }
        play();
      }
  }

  useEffect(() => {
    if(twoRef.current){
      setDetecting(true);
    } else {
      setDetecting(false);
    }
    askSupport();
  }, [])

  return (
    <div className="App">
      <div className = "container">
        <div className = "one">
          <img src = { one } alt = "one" />
        </div>
        <div className = "two" ref = { twoRef }>
          <img src = { two } alt = "two" />
        </div>
        <div className = "three">
          <img src = { three } alt = "three" />
        </div>
        {/* <div className = "four">
          <img src = { four } alt = "four" />
        </div> */}
      </div>
    </div>
  );
}

export default App;
