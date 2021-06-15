import React, {useState} from 'react';
import VideoInputForm from "./components/VideoInputForm";
import './App.css';

export default function App() {
  const [hasVid, setVid] = useState(false);

  const Template = (
    <div className="App">
      <h1>Lifting Form Evaluator</h1>
      <VideoInputForm 
        hasVid={hasVid} 
        setVid={setVid}
      />
    </div>
  );
  
  return (Template);
}

