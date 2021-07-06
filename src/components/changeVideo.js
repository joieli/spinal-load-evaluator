import createCOMsArr from './calculations';
import GIF from "gif.js";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * object containing video frame and pose data arrays
 * @typedef {Object} Poses
 * @property {ImageData[]} frames - array containing the frames of the video
 * @property {Array} poseArr - array containing the posenet pose data at each frame, see posenet documentation for more info about pose data
*/

/**
 * replaces the loading gif with a gif of the evaluated lift
 * @param {Poses} poses - video frame and pose data for the lift evaluated
 * @param {number} mass - mass of the object being lifted in kg
 * @param {number} weight - lifters mass in kg
 * @param {number} refLength - the distance between the shoulder and elbow in real life in m
 * @param {Function} setLoading - the function to set the isLoading state
*/
export default function changeVideo(poses, mass, weight, refLength, setLoading)
{
    /**
     * Function to draw COMs and posenet joint locations on a given frame
     * @param {CanvasRenderingContext2D} context - canvas context for target frame
     * @param {number} i - frame number
     */
    function drawPose(context, i)
    {
        let COMs = COMsArr[i];
        let pose = poses.poseArr[i];

        //getting position of posenet joints
        let leftShoulder = pose[5].position;
        let leftElbow = pose[7].position;
        let leftWrist = pose[9].position;
        let leftHip = pose[11].position;
        
        //posenet joints
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

    /**
     * function to draw the l5s1 load bar graph on a given frame
     * @param {CanvasRenderingContext2D} context - canvas context for target frame
     * @param {number} i - frame number
     */
    function drawLoad(context, i)
    {
        let load = COMsArr[i].l5s1.load;
        context.font = fontSize.toString() + "px Arial";

        //Writing the maxLoad and current load to canvas
        context.fillStyle = "White";
        context.fillText("maxLoad: " + Math.round(maxLoad.val) + " N, Frame: " + maxLoad.frame, fontSize/4, h - maxBarHeight - (fontSize/4), w);
        context.fillText("Load: " + Math.round(load) + " N", fontSize/4, h - maxBarHeight - fontSize * (3/2), w);

        //Drawing the graph
        context.fillStyle = "Green";
        for(let j = 0; j <= i; j++)
        {
            let curLoad = COMsArr[j].l5s1.load;
            context.fillStyle = curLoad < 3432 ? "Green": curLoad < 6500 ? "Yellow" : "Red";
            let barHeight = Math.min(curLoad/maxLoad.val * maxBarHeight, curLoad/6800 * maxBarHeight);
            context.fillRect(j * barWidth, h - barHeight, barWidth, barHeight);
        }
    }

    //Main starts here----------------------------------
    let gif = new GIF({
        workerScript: process.env.PUBLIC_URL + '/gif.worker.js'
    });
    let zip = new JSZip();

    //Calculating the size of important elements to draw on canvas
    console.log("Doing Calculations");
    console.log("refLength: " + refLength);
    console.log("weight: " + weight);
    console.log("mass: " + mass);
    
    //Calculating the size of important elements to draw on canvas
    let w = poses.frames[0].width;
    let h = poses.frames[0].height;
    let sqr = Math.min(w/30, h/30);
    let fontSize = Math.min(h/15, w/15);
    let frameNumber = poses.frames.length;
    let barWidth = Math.ceil(w/frameNumber);
    let maxBarHeight = h/10

    //Calculating refToScreenRatio
    let shoulder = poses.poseArr[0][5].position;
    let elbow = poses.poseArr[0][7].position;
    let screenLength = Math.sqrt((elbow.x - shoulder.x)**2 + (elbow.y - shoulder.y)**2);
    let refToScreenRatio = refLength/screenLength; // px:m
    console.log("refToScreenRatio: " + refToScreenRatio);

    let COMsArr = createCOMsArr(poses, mass, weight, refToScreenRatio);
    console.log(COMsArr);

    //Finding the maximum load and at which frame it occurs
    let maxLoad = {
        val: 0,
        frame: -1
    };
    for(let i = 0; i < COMsArr.length; i++){
        let load = Math.abs(COMsArr[i].l5s1.load);
        if(load > maxLoad.val)
        {
            maxLoad.val = load;
            maxLoad.frame = i;
        }
    }

    console.log("Getting Video")
    for(let i = 0; i < poses.frames.length; i++)
    {
        let imgData = poses.frames[i];
        
        //creating a canvas for the frame
        let canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        let context = canvas.getContext('2d');
        
        //Writing the frame number to canvas
        context.putImageData(imgData, 0, 0);
        context.font = fontSize.toString() + "px Arial";
        context.fillStyle = "White";
        context.fillText("Frame: " + i, fontSize/4, fontSize, w);

        drawPose(context, i);
        drawLoad(context, i);

        //Adding the frame to the gif and zip
        let fps = 5;
        gif.addFrame(canvas, {delay: 1000/fps});
        zip.file("frame" + i + ".jpg", canvas.toDataURL("image/jpeg").split(';base64,')[1], {base64: true});
    }

    gif.on("finished", function(blob) {
        //Changing the video
        setLoading(false);
        let gifURL = URL.createObjectURL(blob);
        let lift = document.querySelector("#lift");
        lift.src = gifURL;
        lift.alt = "lift";

        let submit = document.querySelector('button[type="submit"]');
        submit.removeAttribute("disabled");

        //Creating the download frames button
        zip.generateAsync({type:"blob"})
        .then(function(content) {
            let download = document.querySelector("#download");
            download.onclick = function(event){
                event.preventDefault();
                saveAs(content, "frames.zip");
            }
            download.removeAttribute("disabled");
            console.log("finished");
        });
    });

    //Calls the gif finished event (see above)
    gif.render();
}