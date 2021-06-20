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
  const faceRef = useRef();
  const wrapperRef = useRef();

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

          if(average > 10){
              countNum = countNum + 1; 
              if (countNum < 100 && countNum >= 0) {
                wrapperRef.current.style.width = (average <= 15) ? `${Math.round(average)}%` : "10%";
              } else if(countNum < 300 && countNum >= 100) {
                wrapperRef.current.style.width = (average <= 30) ? `${Math.round(average)}%` : "15%"; 
                wrapperRef.current.style.width = "15%";
                faceRef.current.style.top = "15%";
                faceRef.current.style.width = "35%";
                console.log('15');
              } else if ( countNum < 500 && countNum >= 300) {
                wrapperRef.current.style.width = (average <= 50) ? `${Math.round(average)}%` : "30%"; 
                wrapperRef.current.style.width = "30%";
                faceRef.current.style.top = "5%";
                faceRef.current.style.width = "25%";
                console.log('30');
              } else if ( countNum < 700 && countNum >= 500 ) {
                // animation 추가 
                wrapperRef.current.style.animation = "y-axis 3s ease-in-out";
                twoRef.current.style.animation = "x-axis 3s linear";
              }
          } else { // 초기화
              wrapperRef.current.style.width = "10%";
              faceRef.current.style.top = "25%";
              faceRef.current.style.width = "47%";
              countNum = 0;
              wrapperRef.current.style.animation = "none";
              twoRef.current.style.animation = "none";
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
        <div className = "wrapper" ref = { wrapperRef }>
          <div className = "two" ref = { twoRef }>
            <img className = "head" src = { two } alt = "two" />
            <img className = "face" ref = { faceRef } src = { three } alt = "three" />
          </div>
        </div>
        {/* <div className = "four">
          <img src = { four } alt = "four" />
        </div> */}
      </div>
    </div>
  );
}

export default App;
