import React, {useState} from 'react';
import VideoInputForm from "./components/VideoInputForm";
import VideoOutput from "./components/VideoOutput";
import './App.css';

export default function App() {
  const [vidURL, setVidURL] = useState("");
  const [hasVid, setVid] = useState(false);
  
  function processVid(vidFile){
    const reader = new FileReader();
    reader.onload = function(){
      setVidURL(reader.result);
    };

    reader.readAsDataURL(vidFile[0]);
  }
    
  

  const hasVidTemplate = (
    <div className="App">
      <h1>Lifting Form Evaluator</h1>
      <VideoOutput vidURL={vidURL}/>
      <VideoInputForm processVid={processVid}  hasVid={hasVid} setVid={setVid}/>
    </div>
  );

  const noVidTemplate = (
    <div className="App">
      <h1>Lifting Form Evaluator</h1>
      <VideoInputForm processVid={processVid} hasVid={hasVid} setVid={setVid}/>
    </div>
  );
  
  return (hasVid? hasVidTemplate : noVidTemplate);
}

