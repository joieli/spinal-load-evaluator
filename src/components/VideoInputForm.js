import React from 'react';
import noise from "./noise.mp4";
import loading from './loading.gif';
import VideoOutput from './VideoOutput';

export default function VideoInputForm(props){ 
    
    async function processVid(vidFile){
        let result = await new Promise(
            (resolve) => {
                let reader = new FileReader();
                reader.onload = (e) => resolve(reader.result);
                reader.readAsDataURL(vidFile[0]);
            }
        )

        return result;
    }
    
    async function handleSubmit(event)
    {
        event.preventDefault();
        let vid = document.querySelector("input[type=file]");
        let submit = document.querySelector("button[type=submit]");
        let massInput = document.querySelector("#mass");

        if(vid.value === "" || massInput.value ==="")
            return;
        
        submit.setAttribute("disabled", '');
        let mass = massInput.value;
        let vidURL = await processVid(vid.files);
        
        props.setVid(true);
        vid.value = "";
        massInput.value = "";
        VideoOutput(vidURL, mass);
        
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
                <label htmlFor="videoFile">Upload a new video: </label>
                <input type="file" id="videoFile" name="videoFile"/>
                <button type="submit" disabled>Submit</button>
            </div>
        </form>
    );

    return(props.hasVid ? hasVidTemplate : noVidTemplate);
}