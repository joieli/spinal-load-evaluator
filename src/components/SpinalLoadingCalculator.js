export default function calculateSpinalLoad(poses, mass, height, weight)
{
   //only poses.poseArr should be used
   //Outputs: an array holding the spinalLoadin in N for the each frame/pose in poseArr

   //ToDo: Calculate Spinal Loads from img
    console.log("spinal load");
    console.log("Mass: " + mass);
    console.log("Height: " + height);
    console.log("Weight: " + weight);

    let spinalLoads = [];

    for(let i; i < poses.frames.length; i++)
    {
        //add spinal loading to array
    }
    return spinalLoads;
}