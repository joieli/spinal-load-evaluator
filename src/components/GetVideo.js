import calculateSpinalLoad from './SpinalLoadingCalculator';
import GIF from "gif.js";

export default function getVideo(poses, mass, height, weight, refLength)
{
    //poses is an object
        //poses.frames holds ImagaData
        //poses.poseArr holds pose objects

    //ToDo: DrawGraph, possibly remove height input???, possibly move the COMsarr stuff to a new file
    
    //Main start-----------------------------------------------------------
    console.log("Doing Calculations");
    let w = poses.frames[0].width;
    let h = poses.frames[0].height;
    let gif = new GIF({
        workerScript: process.env.PUBLIC_URL + '/gif.worker.js'
    });

    let sqr = Math.max((1/70) * w, (1/60) * h);

    let frameNumber = poses.frames.length;
    let barWidth = w/frameNumber;

    let shoulder = poses.poseArr[0][5].position;
    let elbow = poses.poseArr[0][7].position;
    let screenLength = Math.sqrt((elbow.x - shoulder.x)**2 + (elbow.y - shoulder.y)**2);
    let screenToRefRatio = screenLength/refLength; // px:m

    let COMsArr = [];
    for(let i = 0; i < poses.frames.length; i++)
    {
        //Setting up objects:
        let pose = poses.poseArr[i];
        let leftShoulder = pose[5].position;
        let leftElbow = pose[7].position;
        let leftWrist = pose[9].position;
        let leftHip = pose[11].position;
        let leftEar = pose[3].position;
        
        //Getting Data
        let COMs = {
            upperArm: {
                x: leftShoulder.x - (leftShoulder.x - leftElbow.x) * 0.447,
                y: leftShoulder.y - (leftShoulder.y - leftElbow.y) * 0.447,
                mass: 0.03075 * weight
            },
            foreArm: {
                x: leftElbow.x - (leftElbow.x - leftWrist.x) * 0.432,
                y: leftElbow.y - (leftElbow.y - leftWrist.y) * 0.432,
                mass: 0.0172 * weight
            },
            head: {
                x: leftEar.x,
                y: leftEar.y,
                mass: 0.0823 * weight
            },
            trunk: {
                x: leftHip.x - (leftHip.x - leftShoulder.x)* 0.5995,
                y: leftHip.y - (leftHip.y - leftShoulder.y)* 0.5995,
                mass: 0.5415 * weight
            },
            hand: {
                x: leftWrist.x - (leftElbow.x - leftWrist.x) * (0.108 / 0.146) * 0.4,
                y: leftWrist.y - (leftElbow.y - leftWrist.y) * (0.108 / 0.146) * 0.4,
                mass: 0.575 * weight + mass
            },
            l5s1: {
                x: leftHip.x - (leftHip.x - leftShoulder.x)* 0.25,
                y: leftHip.y - (leftHip.y - leftShoulder.y)* 0.25,
                load: 0 
            }
        };

        let spinalLoad = calculateSpinalLoad(COMs, screenToRefRatio);
        COMs.l5s1.load = spinalLoad;

        COMsArr.push(COMs);
    }
    console.log(COMsArr);
    //Main skip end--------------------------------------------------

    function drawPose(context, i)
    {
        let COMs = COMsArr[i];
        let pose = poses.poseArr[i];
        let leftShoulder = pose[5].position;
        let leftElbow = pose[7].position;
        let leftWrist = pose[9].position;
        let leftHip = pose[11].position;
        
        //joints
        context.fillStyle = "Red";
        context.fillRect(leftShoulder.x, leftShoulder.y, sqr, sqr);
        context.fillRect(leftElbow.x, leftElbow.y, sqr, sqr);
        context.fillRect(leftHip.x, leftHip.y, sqr, sqr);
        context.fillRect(leftWrist.x, leftWrist.y, sqr, sqr);
        
        //COMS
        context.fillStyle = "Grey";
        context.fillRect(COMs.upperArm.x, COMs.upperArm.y, sqr, sqr);
        context.fillRect(COMs.foreArm.x, COMs.foreArm.y, sqr, sqr);
        context.fillRect(COMs.head.x, COMs.head.y, sqr, sqr);
        context.fillRect(COMs.trunk.x, COMs.trunk.y, sqr, sqr);
        context.fillRect(COMs.hand.x, COMs.hand.y, sqr, sqr);
 
        //l5S1 joint
        context.fillStyle = "White";
        context.fillRect(COMs.l5s1.x, COMs.l5s1.y, sqr, sqr);
    }

    function drawGraph(context, i)
    {
        //Draw the barGraph here
        //likely end up using barWidth * i for location of graph
        //use COMsArr[i].l5s1.load to access load at a specific i
    }
    
    //Main skip start----------------------------------
    console.log("Getting Video")
    for(let i = 0; i < poses.frames.length; i++)
    {
        let imgData = poses.frames[i];
    
        let canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        let context = canvas.getContext('2d');
        context.putImageData(imgData, 0, 0);

        drawPose(context, i);
        drawGraph(context, i);

        let fps = 5;
        gif.addFrame(canvas, {delay: 1000/fps});
    }

    gif.on("finished", function(blob) {
        let gifURL = URL.createObjectURL(blob);

        //changing the video
        let loading = document.querySelector("img[alt='loading']");
        let img = document.createElement("img");
        img.src = gifURL;
        img.alt = "lift gif"
        loading.replaceWith(img);
        let submit = document.querySelector('button[type="submit"]');
        submit.removeAttribute("disabled");
    });

    gif.render();
}