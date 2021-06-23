//import GIFEncoder from "gif-encoder";
import GIF from "gif.js";


export default function getVideo(poses, spinalLoads, height)
{
    //poses is an object
    //poses holds poses.frames and poses.poseArr
    //poses.frames holds ImagaData
    /*poses.poseArr holds pose objects
        Id	Part
        0	nose
        1	leftEye
        2	rightEye
        3	leftEar
        4	rightEar
        5	leftShoulder
        6	rightShoulder
        7	leftElbow
        8	rightElbow
        9	leftWrist
        10	rightWrist
        11	leftHip
        12	rightHip
        13	leftKnee
        14	rightKnee
        15	leftAnkle
        16	rightAnkle
    */
    //spinalLoading is an arr

    //ToDo: Draw limb positions and spinal loads onto image
    
    console.log("getting video");
    let w = poses.frames[0].width;
    let h = poses.frames[0].height;
    let gif = new GIF({
        workerScript: process.env.PUBLIC_URL + '/gif.worker.js'
    });

    function drawPose(context, i)
    {
        let pose = poses.poseArr[i];
        let leftShoulder = pose[5].position;
        let leftElbow = pose[7].position;
        let leftWrist = pose[9].position;
        let leftHip = pose[11].position;
        let leftEar = pose[3].position;
        
        
        //joints-----------------------------------
        context.fillStyle = "Red";
        context.fillRect(leftShoulder.x, leftShoulder.y, 7, 7);
        context.fillRect(leftElbow.x, leftElbow.y, 7, 7);
        context.fillRect(leftHip.x, leftHip.y, 7, 7);
        context.fillRect(leftWrist.x, leftWrist.y, 7, 7);
        
        //COMS----------------------
        context.fillStyle = "Grey";
        //center of upperarm mass
        let upperArmCOM = {
            x: leftShoulder.x - (leftShoulder.x - leftElbow.x) * 0.447,
            y: leftShoulder.y - (leftShoulder.y - leftElbow.y) * 0.447
        };
        context.fillRect(upperArmCOM.x, upperArmCOM.y, 10, 10);

        //center of lowerArm
        let foreArmCOM = {
            x: leftElbow.x - (leftElbow.x - leftWrist.x) * 0.432,
            y: leftElbow.y - (leftElbow.y - leftWrist.y) * 0.432
        };
        context.fillRect(foreArmCOM.x, foreArmCOM.y, 10, 10);

        //center of head/next (assumed to be the ear)
        context.fillRect(leftEar.x, leftEar.y, 10, 10);

        //center of trunk
        let trunkCOM = {
            x: leftHip.x - (leftHip.x - leftShoulder.x)* 0.5995,
            y: leftHip.y - (leftHip.y - leftShoulder.y)* 0.5995
        };
        context.fillRect(trunkCOM.x, trunkCOM.y, 10, 10);

        //L5/S1 Joint
        context.fillStyle = "White";
        let l5s1 = {
            x: leftHip.x - (leftHip.x - leftShoulder.x)* 0.25,
            y: leftHip.y - (leftHip.y - leftShoulder.y)* 0.25 
        };
        context.fillRect(l5s1.x, l5s1.y, 10, 10);
    }
    
    for(let i = 0; i < poses.frames.length; i++)
    {
        let imgData = poses.frames[i];
    
        let canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        let context = canvas.getContext('2d');
        context.putImageData(imgData, 0, 0);
        drawPose(context, i);

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