import React, {useState} from 'react';
import VideoInputForm from "./components/VideoInputForm";
import './App.css';

export default function App() {
  const [hasVid, setVid] = useState(false);

  const Template = (
    <div className="App">
      <h1>Spinal Load Evaluations</h1>
      <p>Restrictions: </p>
      <ul>
        <li>Record lift from lifter's left side</li>
        <li>Two handed lifts only</li>
        <li>Entire head, trunk(shoulder to hips) and arms must be visible</li>
      </ul>
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
    </div>
  );
  
  return (Template);
}

