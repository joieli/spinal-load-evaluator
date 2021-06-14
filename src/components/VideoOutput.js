import React from 'react';
import GetPoseAndFrames from './PoseEstimator';

export default function VideoOutput(props)
{
    let vidURL = props.vidURL;
    let poses = GetPoseAndFrames(vidURL);
    console.log(poses);

    
    return(<video src={props.vidURL} type="video/mp4" autoPlay muted controls/>);
}


