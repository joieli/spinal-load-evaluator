import React from 'react';
import noise from "./noise.mp4";
import loading from './loading.gif';

export default function VideoInputForm(props){ 
    function handleSubmit(event)
    {
        event.preventDefault();
        let vid = document.querySelector("input[type=file]");
        let submit = document.querySelector("button[type=submit]");
        let mass = document.querySelector("#mass");
        if(vid.value !== "" && mass.value !== "")
        {
            //props.setMass(mass.value); <-- this line messes things up . . .
            submit.setAttribute("disabled", '');
            props.processVid(vid.files);     
            props.setVid(true);
            vid.value = "";
            mass.value = "";
        }
    }
    
    const noVidTemplate = (
        <form className="video_input_form" onSubmit={handleSubmit}>
            <video width="400px" autoPlay muted loop>
                <source src={noise} type="video/mp4"/>
                Video not supported on your browser
            </video>
            <div className="input_line">
                <label htmlFor="mass">Mass of object (kg): </label>
                <input type="number" id="mass" name="mass" />
            </div> 
            <div className="input_line">
                <label htmlFor="videoFile">Upload a video: </label>
                <input type="file" id="videoFile" name="videoFile"/>
                <button type="submit">Submit</button>
            </div>
        </form>
    );

    const hasVidTemplate = (
        <form className="video_input_form" onSubmit={handleSubmit}>
            <img src={loading} alt='loading' />
            <div className="input_line">
                <label htmlFor="mass">Mass of object (kg): </label>
                <input type="number" id="mass" name="mass" />
            </div> 
            <div className="input_line">
                <label htmlFor="videoFile">Upload a video: </label>
                <input type="file" id="videoFile" name="videoFile"/>
                <button type="submit" disabled>Submit</button>
            </div>
        </form>
    );

    return(props.hasVid ? hasVidTemplate : noVidTemplate);
}