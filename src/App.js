import React, {useState} from 'react';
import VideoInputForm from "./components/VideoInputForm";
import './App.css';
import noise from "./components/noise.mp4";
import loading from './components/loading.gif';

export default function App() {
  const [hasVid, setVid] = useState(false);

  const noVidTemplate = (
    <div className="App">
      <h1>Spinal Load Evaluations</h1>
      <p>Restrictions: </p>
      <ul>
        <li>Record lift from lifter's left side</li>
        <li>Two handed lifts only</li>
        <li>Entire head, trunk(shoulder to hips) and arms must be visible</li>
        <li>No twisting during lift</li>
        <li>Please limit video length to under 15 seconds</li>
      </ul>
      <video width="600px" autoPlay muted loop>
        <source src={noise} type="video/mp4"/>
        Video not supported on your browser
      </video>
      <VideoInputForm 
        hasVid={hasVid} 
        setVid={setVid}
      />
      <p>Output Colors: </p>
      <ul>
        <li>Red: Relevant joints detected by posenet</li>
        <li>Grey: Body segment center of masses</li>
        <li>White: The L5/S1 joint</li>
      </ul>
      <p>Notes: </p>
      <ul>
        <li>* Used to determine real-life:on-screen distance ratio</li>
        <li>Uses a statics based evaluation of force at each frame</li>
        <li>Force values should be used as an estimation, change in force throughout lift would generally be of more interest</li>
      </ul>
    </div>
  );

  const hasVidTemplate = (
    <div className="App">
      <h1>Spinal Load Evaluation</h1>
      <p>Restrictions: </p>
      <ul>
        <li>Record lift from lifter's left side (not mirrored)</li>
        <li>Two handed lifts only</li>
        <li>Entire head, trunk(shoulder to hips) and arms must be visible</li>
        <li>No twisting during lift</li>
        <li>Please limit video length to under 15 seconds</li>
      </ul>
      <img src={loading} alt='loading' />
      <VideoInputForm 
        hasVid={hasVid} 
        setVid={setVid}
      />
      <p>Output Colors: </p>
      <ul>
        <li>Red: Relevant joints detected by posenet</li>
        <li>Grey: Body segment center of masses</li>
        <li>White: The L5/S1 joint</li>
      </ul>
      <p>Notes: </p>
      <ul>
        <li>* Used to determine real-life:on-screen distance ratio</li>
        <li>Uses a statics based evaluation of force at each frame</li>
        <li>Force values should be used as an estimation, change in force throughout lift would generally be of more interest</li>
      </ul>
    </div>
  );
  
  return (hasVid ? hasVidTemplate : noVidTemplate);
}

