import React from 'react';
import noise from "./noise.mp4";

export default function VideoInputForm(props){ 
    function handleSubmit(event)
    {
        event.preventDefault();
        let vid = document.querySelector("input[type=file]");
        if(vid.value !== "")
        {
            props.processVid(vid.files);
            props.setVid(true);
            vid.value = "";
        }
    }
    
    const noVidTemplate = (
        <form className="video_input_form" onSubmit={handleSubmit}>
            <video width="400px" autoPlay muted loop>
                <source src={noise} type="video/mp4"/>
                Video not supported on your browser
            </video>
            <label htmlFor="videoFile">Upload a video: </label>
            <input type="file" id="videoFile" name="video"/>
            <button type="submit">Submit</button>
        </form>
    )

    const hasVidTemplate = (
        <form className="video_input_form" onSubmit={handleSubmit}>
            <label htmlFor="videoFile">Upload a new video: </label>
            <input type="file" id="videoFile" name="video"/>
            <button type="submit">Submit</button>
        </form>
    )

    return(props.hasVid ? hasVidTemplate : noVidTemplate);
}