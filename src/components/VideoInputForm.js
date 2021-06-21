import React from 'react';
import noise from "./noise.mp4";
import loading from './loading.gif';
import changeVideoOutput from './VideoOutput';

export default function VideoInputForm(props){ 
    
    async function processVid(vidFiles){
        let result = await new Promise(
            (resolve) => {
                let reader = new FileReader();
                reader.onload = (e) => resolve(reader.result);
                reader.readAsDataURL(vidFiles[0]);
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
        let heightInput = document.querySelector("#height");
        let weightInput = document.querySelector("#weight")

        if(!vid.files[0].type.match("video.*") || massInput.value <= 0 || heightInput.value <= 0 || weightInput.value <= 0)
        {

            if(!vid.files[0].type.match("video.*"))
                alert("Please upload a video file, some acceptable formats are: .mp4, .m4v, .mov, .avi, .mpg, .webm");
            else
                alert("Please enter non-zero values for all numerical fields");
            return;
        }
        
        submit.setAttribute("disabled", '');
        let mass = massInput.value;
        let height = heightInput.value;
        let weight = weightInput.value;
        let vidURL = await processVid(vid.files);
        
        props.setVid(true);
        vid.value = "";
        massInput.value = "";
        heightInput.value = "";
        weightInput.value = "";
        changeVideoOutput(vidURL, mass, height, weight);
    }
    
    const noVidTemplate = (
        <form className="video_input_form" onSubmit={handleSubmit}>
            <video width="400px" autoPlay muted loop>
                <source src={noise} type="video/mp4"/>
                Video not supported on your browser
            </video>
            <div className="input_line">
                <label htmlFor="mass">Mass of object (kg): </label>
                <input type="number" min="0" required id="mass" name="mass" />
            </div> 
            <div className="input_line">
                <label htmlFor="height">Your height (m): </label>
                <input type="number" min="0" required id="height" name="height" />
                <label htmlFor="weight">Your weight (kg): </label>
                <input type="number" min="0"required id="weight" name="weight" />
            </div>
            <div className="input_line">
                <label htmlFor="videoFile">Upload a video: </label>
                <input type="file" accept="video/*" required id="videoFile" name="videoFile"/>
                <button type="submit">Submit</button>
            </div>
        </form>
    );

    const hasVidTemplate = (
        <form className="video_input_form" onSubmit={handleSubmit}>
            <img src={loading} alt='loading' />
            <div className="input_line">
                <label htmlFor="mass">Mass of object (kg): </label>
                <input type="number" min="0" required id="mass" name="mass" />
            </div> 
            <div className="input_line">
                <label htmlFor="height" >Your height (m): </label>
                <input type="number" min="0" required id="height" name="height" />
                <label htmlFor="weight">Your weight (kg): </label>
                <input type="number" min="0" required id="weight" name="weight" />
            </div>
            <div className="input_line">
                <label htmlFor="videoFile">Upload a new video: </label>
                <input type="file" accept="video/*" required id="videoFile" name="videoFile"/>
                <button type="submit" disabled>Submit</button>
            </div>
        </form>
    );

    return(props.hasVid ? hasVidTemplate : noVidTemplate);
}