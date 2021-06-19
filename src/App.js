import React, { useState, useEffect, useRef } from 'react';
import one from './rene/1.png';
import two from './rene/2.png';
import three from './rene/3.png';
import four from './rene/4.png';

import './App.css';

function App() {
  const [detecting, setDetecting] = useState(false);

  const twoRef = useRef();

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  navigator.getUserMedia({ video : false, audio : true }, callback, console.log);

  function callback(stream) {
      let ctx = new AudioContext();
      let mic = ctx.createMediaStreamSource(stream);
      let analyser = ctx.createAnalyser();
      
      mic.connect(analyser);

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
              console.log(Math.round(average));  
          } else {
            twoRef.current.style.width = `10%`;
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
