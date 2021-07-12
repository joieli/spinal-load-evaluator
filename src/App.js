import React, {useState} from 'react';
import VideoInputForm from "./components/VideoInputForm";
import VideoOutput from "./components/VideoOutput";
import './App.css';


export default function App() {
  const [isLoading, setLoading] = useState(false);

  const template = (
    <div className="App">
      <h1>Spinal Load Evaluator</h1>
      <p><a href="https://github.com/joieli/spinal-load-evaluator">GitHub Repo and Demo Video</a></p>
      <VideoOutput
        isLoading={isLoading}
      />
      <VideoInputForm
        setLoading={setLoading}
      />
      <p>Restrictions: </p>
      <ul>
        <li>Record lift from lifter's left side</li>
        <li>Two handed lifts only</li>
        <li>Entire head, trunk(shoulder to hips) and arms must be visible</li>
        <li>No twisting during lift</li>
        <li>Object being lifted cannot have a long moment arm</li>
        <li>No more than one person in frame at a time</li>
        <li>Please limit video length to under 15 seconds</li>
      </ul>
      <p>Output Colors: </p>
      <ul>
        <li>Red: Location of relevant parts detected by posenet</li>
        <li>Grey: Location of body segment center of masses</li>
        <li>White: Location of the L5/S1 joint</li>
      </ul>
      <div className="footer">
      <p>Notes: </p>
        <ul>
          <li>Accuracy of force values is dependent on accurate detection of the location of these pody parts:
            <ul>
              <li>Left wrist, left elbow, left shoulder, left hip, left ear</li>
            </ul>
          </li>
          <li>Please check that posenet has acurately determined the location of the above body parts in the video
            <ul>
              <li>Perfect detection is rare, if the estimation of location is far off, try taking the video again </li>
              <li>At best, force values should only be used as an estimation. </li>
              <li>Change in force throughout lift should generally be of more interest.</li>
            </ul>
          </li>
          <li>Program assumes that center of mass of the object being lifted is at the same place as the hand</li>
          <li>Program assumes that the lift begins at the first fram and ends at the last</li>
          <li>Upper arm length is used to determine real-life:on-screen distance ratio</li>
          <li>Uses a 2D statics based evaluation of force at each frame</li>
          <li>Video output is in the form of a gif, analysis done at 5 fps</li>
        </ul>
        <p>Packages and References: </p>
        <ul>
          <li>React: <a href="https://reactjs.org/">https://reactjs.org/</a></li> 
          <li>Posenet: <a href="https://github.com/tensorflow/tfjs-models/tree/master/posenet">https://github.com/tensorflow/tfjs-models/tree/master/posenet</a></li>
          <li>file-saver: <a href="https://github.com/eligrey/FileSaver.js">https://github.com/eligrey/FileSaver.js</a></li>
          <li>gif.js: <a href="https://github.com/jnordberg/gif.js">https://github.com/jnordberg/gif.js</a></li>
          <li>jszip: <a href="https://stuk.github.io/jszip/">https://stuk.github.io/jszip/</a></li>
          <li>Body segment masses and center of mass: <a href="https://doi.org/10.1080/02701367.1983.10605290">https://doi.org/10.1080/02701367.1983.10605290</a></li>
          <li>Body Segment Lengths: Winter DA. Biomechanics and motor control of human movement. John Wiley & Sons; 2009. </li>
          <li>Spinal compression limits: <a href="https://doi.org/10.1080/00140139308967899">https://doi.org/10.1080/00140139308967899</a></li>
        </ul>
      </div>
    </div>
  );
  
  return (template);
}

