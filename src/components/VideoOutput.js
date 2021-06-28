import getPoseAndFrames from './PoseEstimator';
import loading from './loading.gif';
import getVideo from './GetVideo';

//ToDO:
//  Make getVideo and VideoOutput function prettier, perhaps use some states??
//  Make a videoOutput component??

let poses;

export default function changeVideoOutput(vidURL, mass, weight, refLength)
{   
    let curLift = document.querySelector("img[alt='lift gif']");
    if(curLift !== null)
    {
        let curLoading = document.createElement("img");
        curLoading.setAttribute("src", loading);
        curLoading.setAttribute("alt", 'loading');
        curLift.replaceWith(curLoading);
    }

    let download = document.querySelector("#download");
    if(download !== null)
    {
        download.remove();
    }
    
    async function innerFunction(){
        //getting poses and frames
        //an object that holds poses.frames(ImageData) and poses.poseArr(poseObjects)
        console.log("Getting poses");
        poses = await getPoseAndFrames(vidURL);
        console.log(poses);

        //processing the frames and poses
        getVideo(poses, mass, weight, refLength);
    }

    //Main starts here
    innerFunction();
}





