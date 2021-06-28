import createCOMsArr from './Calculations';
import GIF from "gif.js";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function getVideo(poses, mass, weight, refLength)
{
    //poses is an object
        //poses.frames holds ImagaData
        //poses.poseArr holds pose objects
    
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
        let load = COMsArr[i].l5s1.load;
        context.font = fontSize.toString() + "px Arial";

        context.fillStyle = "White";
        context.fillText("MaxLoad: " + Math.round(maxLoad.val) + " N, Frame: " + maxLoad.frame, fontSize/4, h - maxBarHeight - (fontSize/4), w);
        context.fillText("Load: " + Math.round(load) + " N", fontSize/4, h - maxBarHeight - fontSize * (3/2), w);

        context.fillStyle = "Green";
        for(let j = 0; j <= i; j++)
        {
            let curLoad = COMsArr[j].l5s1.load;
            context.fillStyle = curLoad < 3432 ? "Green": curLoad < 6500 ? "Yellow" : "Red";
            let barHeight = Math.min(curLoad/maxLoad.val * maxBarHeight, curLoad/6800 * maxBarHeight);
            context.fillRect(j * barWidth, h - barHeight, barWidth, barHeight);
        }
    }

    //Main starts here
    console.log("Doing Calculations");
    let w = poses.frames[0].width;
    let h = poses.frames[0].height;
    let gif = new GIF({
        workerScript: process.env.PUBLIC_URL + '/gif.worker.js'
    });

    let zip = new JSZip();

    let sqr = Math.min(w/30, h/30);
    let fontSize = Math.min(h/15, w/15);

    let frameNumber = poses.frames.length;
    let barWidth = Math.ceil(w/frameNumber);
    let maxBarHeight = h/10

    let shoulder = poses.poseArr[0][5].position;
    let elbow = poses.poseArr[0][7].position;
    let screenLength = Math.sqrt((elbow.x - shoulder.x)**2 + (elbow.y - shoulder.y)**2);
    let refToScreenRatio = refLength/screenLength; // px:m
    console.log("RefToScreenRatio: " + refToScreenRatio);

    let COMsArr = createCOMsArr(poses, mass, weight, refToScreenRatio);
    console.log(COMsArr);
    
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
    
        let canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        let context = canvas.getContext('2d');
        context.putImageData(imgData, 0, 0);
        
        context.font = fontSize.toString() + "px Arial";
        context.fillStyle = "White";
        context.fillText("Frame: " + i, fontSize/4, fontSize, w);

        drawPose(context, i);
        drawGraph(context, i);

        let fps = 5;
        gif.addFrame(canvas, {delay: 1000/fps});
        zip.file("frame" + i + ".jpg", canvas.toDataURL("image/jpeg").split(';base64,')[1], {base64: true});
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


        zip.generateAsync({type:"blob"})
        .then(function(content) {
            let download = document.createElement("button");
            download.textContent = "Download Frames";
            download.onclick = function(event){
                event.preventDefault();
                saveAs(content, "frames.zip");
            }
            download.id = "download";
            document.querySelector(".App").insertBefore(download, document.querySelector('form'));
            console.log("finished");
        });
    });

    gif.render();
}