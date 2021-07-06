import * as tf from "@tensorflow/tfjs"; //Not used but need for posenet to work
import * as posenet from "@tensorflow-models/posenet";

/**
 * object containing video frame and pose data arrays
 * @typedef {Object} Poses
 * @property {ImageData[]} frames - array containing the frames of the video at 5fps
 * @property {Array} poseArr - array containing the posenet pose data at each frame, see posenet documentation for more info about pose data
*/

/**
 * splits the video into frames at 5fps and returns ImageData and posenet pose data at each frame
 * @param {string} vidURL - dataURL of the video
 * @returns {Poses} video frame and pose data for the lift evaluated at 5fps
*/
export default async function getPoseAndFrames(vidURL){
    /**
     * breaks the video in frames
     * @param {string} videoUrl - dataURL of the video
     * @param {number} fps - frame rate to break video at (defaults to 5)
     * @returns 
    */
    async function extractFramesFromVideo(videoUrl, fps=5) {
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
            while((video.duration === Infinity || isNaN(video.duration)) && video.readyState < 2) {
                await new Promise(r => setTimeout(r, 1000));
                video.currentTime = 10000000*Math.random();
            }
            let duration = video.duration;
        
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            let scale = Math.min(1, 500/video.videoWidth, 500/video.videoHeight);
            let [w, h] = [video.videoWidth * scale, video.videoHeight * scale];
            canvas.width =  w;
            canvas.height = h;
        
            let frames = [];
            let interval = 1 / fps;
            let currentTime = 0;
        
            //getting image data at each frame
            while(currentTime < duration) {
                video.currentTime = currentTime;
                await new Promise(r => seekResolve=r);
        
                context.drawImage(video, 0, 0, w, h);
                let imgData = context.getImageData(0, 0, w, h);
                frames.push(imgData);
        
                currentTime += interval;
            }
            resolve(frames);
        });
    }

    /**
     * uses posenet to get pose data for the given frame
     * @param {ImageData} imgData - ImageData of frame to pass to posenet
     * @returns {posenet.Keypoint[]} pose data for the frame
    */
    async function estimatePoseOnImg(imgData){
        if(imgData !== null){
            const net = await posenet.load();
            const pose = await net.estimateSinglePose(
                imgData, 
                {flipHorizontal: false}
            );

            return (pose.keypoints);
        }
    }

    /**
     * adds posenet pose data for each frame to poses.poseArr
     * @param {ImageData[]} frames - array containing frames of the video
    */
    async function processFrames(frames)
    {
        for(let i = 0; i < frames.length; i++){
            let pose = await estimatePoseOnImg(frames[i]);
            poses.poseArr.push(pose);
        }
    }

    //Main starts here----------------------------------------------------------------
    let poses = {
        poseArr: [], //contains pose
        frames: [] //contains ImageData
    }

    let frames = await extractFramesFromVideo(vidURL, 5);
    poses.frames = frames;
    await processFrames(poses.frames);
    return poses;
}