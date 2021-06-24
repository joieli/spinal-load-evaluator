import getPoseAndFrames from './PoseEstimator';
import loading from './loading.gif';
import getVideo from './GetVideo';

let poses;

export default function changeVideoOutput(vidURL, mass, height, weight, refLength)
{   
    let curLift = document.querySelector("img[alt='lift gif']");
    if(curLift !== null)
    {
        let curLoading = document.createElement("img");
        curLoading.setAttribute("src", loading);
        curLoading.setAttribute("alt", 'loading');
        curLift.replaceWith(curLoading);
    }
    
    async function innerFunction(){
        //getting poses and frames
        //an object that holds poses.frames(ImageData) and poses.poseArr(poseObjects)
        console.log("Getting poses");
        poses = await getPoseAndFrames(vidURL);

        //processing the frames and poses
        getVideo(poses, mass, height, weight, refLength);
    }

    //Main starts here
    innerFunction();
}





