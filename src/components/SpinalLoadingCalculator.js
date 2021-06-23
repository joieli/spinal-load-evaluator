export default function calculateSpinalLoad(poses, mass, height, weight, refLength)
{
   /*only poses.poseArr should be used
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
   //Outputs: an array holding the spinalLoadin in N for the each frame/pose in poseArr


   //ToDo: Calculate Spinal Loads from img
    console.log("spinal load");
    console.log("Poses");
    console.log(poses);
    console.log("Mass: " + mass);
    console.log("Height: " + height);
    console.log("Weight: " + weight);
    console.log("RefLength: " + refLength);

    //scale
    let leftShoulder = poses.poseArr[0][5];
    let leftElbow = poses.poseArr[0][7];
    let screenLength = Math.sqrt((leftElbow.x - leftShoulder.x)**2 + (leftElbow.y - leftShoulder.y)**2);
    let screenToRefRatio = screenLength/refLength // px:m

    let spinalLoads = [];

    for(let i; i < poses.frames.length; i++)
    {
        //add spinal loading to array
    }
    return spinalLoads;
}