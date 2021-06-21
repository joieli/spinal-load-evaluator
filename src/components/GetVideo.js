//import GIFEncoder from "gif-encoder";
import GIF from "gif.js";


export default function getVideo(poses, spinalLoads)
{
    //poses is an object
    //poses holds poses.frames and poses.poseArr
    //poses.frames holds ImagaData
    //poses.poseArr holds pose objects
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

        context.fillStyle = "#FF0000";
        context.fillRect(10, 10, 10, 10);
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

        gif.addFrame(canvas, {delay: 1000});
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