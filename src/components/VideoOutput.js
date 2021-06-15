import React from 'react';
import GetPoseAndFrames from './PoseEstimator';
import loading from './loading.gif';
import CalculateSpinalLoad from './SpinalLoadingCalculator';

let poses;

export default function VideoOutput(props)
{   
    let curVideo = document.querySelector("video");
    if(curVideo !== null)
    {
        let curLoading = document.createElement("img");
        curLoading.setAttribute("src", loading);
        curLoading.setAttribute("alt", 'loading');
        curVideo.replaceWith(curLoading);
    }
    
    async function innerFunction(){
        let vidURL = props.vidURL;
        poses = await GetPoseAndFrames(vidURL);

        //processing the frames and poses
        console.log(props.mass);
        console.log(poses);
        CalculateSpinalLoad(poses);

        //changin the video
        let loading = document.querySelector("img[alt='loading']");
        let video = document.createElement("video");
        video.setAttribute("src", vidURL);
        video.setAttribute("type", "video/mp4");
        video.setAttribute("autoPlay", "");
        video.setAttribute("muted", "");
        video.setAttribute("controls", "");
        loading.replaceWith(video);
        let submit = document.querySelector('button[type="submit"]');
        submit.removeAttribute("disabled");
    }

    innerFunction();
    return(<div>Result</div>);
}





