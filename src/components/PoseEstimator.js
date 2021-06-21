import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";

export default async function getPoseAndFrames(vidURL){
    //break video into frames
    async function extractFramesFromVideo(videoUrl, fps=1) 
    {
        return new Promise(async (resolve) => {
      
            // fully download it first (no buffering):
            let videoBlob = await fetch(videoUrl).then(r => r.blob());
            let videoObjectUrl = URL.createObjectURL(videoBlob);
            let video = document.createElement("video");
        
            let seekResolve;
            video.addEventListener('seeked', async function() {
                if(seekResolve) seekResolve();
            });
        
            video.src = videoObjectUrl;
        
            // workaround chromium metadata bug (https://stackoverflow.com/q/38062864/993683)
            while((video.duration === Infinity || isNaN(video.duration)) && video.readyState < 2) 
            {
                await new Promise(r => setTimeout(r, 1000));
                video.currentTime = 10000000*Math.random();
            }
            let duration = video.duration;

            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            let scale = 500/video.videoWidth;
            if(scale > 1)
                scale = 1;
            let [w, h] = [video.videoWidth  * scale, video.videoHeight *scale]
            canvas.width =  w;
            canvas.height = h;
        
            let frames = [];
            let interval = 1 / fps;
            let currentTime = 0;
        
            while(currentTime < duration) {
                video.currentTime = currentTime;
                await new Promise(r => seekResolve=r);
        
                context.drawImage(video, 0, 0, w, h);
                let base64ImageData = context.getImageData(0, 0, w, h);
                frames.push(base64ImageData);
        
                currentTime += interval;
            }
            resolve(frames);
        });
    }

    async function estimatePoseOnImg(imgElement){
        if(imgElement !== null){// load the posenet model from a checkpoint
            const net = await posenet.load();
            const pose = await net.estimateSinglePose(
                imgElement, 
                {flipHorizontal: false}
            );

            return (pose.keypoints);
        }
    }
 
    async function processFrames(frames)
    {
        for(let i = 0; i < frames.length; i++){
            let pose = await estimatePoseOnImg(frames[i]);
            poses.poseArr.push(pose);
        }
    }

    //Main starts here
    let poses = {
        poseArr: [], //contains poseObject
        frames: [] //contains ImageData
    }

    let frames = await extractFramesFromVideo(vidURL, 1);
    poses.frames = frames;
    let result = await processFrames(poses.frames);
    return poses;
}