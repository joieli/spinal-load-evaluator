export default function createCOMsArr(poses, mass, weight, refToScreenRatio)
{
    //outputs COMsArr:
    //  Array containing the COMs objects for important body parts at each frame
    //  COMs objects hold properties for upperArm, foreArm, head, trunk, and, l5s1
    //  Body part properties:
    //      x and y: COM pixel location, location for l5s1
    //      mass: excl. l5s1, body part mass (hand includes mass of lift object)
    //      Fy: excl. l5s1, body part weight (hand includes weight of lift object)
    //      Dx: excl. l5s1, horizontal distance between body part COM and l5s1
    //      Mo: excl. l5s1, moment caused by body part
    //      totalMo: l5s1 only, total moment caused by body parts around l5s1 joint
    //      load: l5s1 only, compressive force at l5s1 joint
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
                x: leftWrist.x - (leftElbow.x - leftWrist.x) * (0.108 / 0.145) * 0.4,
                y: leftWrist.y - (leftElbow.y - leftWrist.y) * (0.108 / 0.145) * 0.4,
                mass: 0.00575 * weight + Number(mass)
            },
            l5s1: {
                x: leftHip.x - (leftHip.x - leftShoulder.x)* 0.25,
                y: leftHip.y - (leftHip.y - leftShoulder.y)* 0.25,
            }
        };
        
        addLoads(COMs, refToScreenRatio)
        COMsArr.push(COMs);
    }

    return COMsArr;
}

function addLoads(COMs, refToScreenRatio)
{
    let upperArmFy = COMs.upperArm.mass * 9.81;
    let foreArmFy = COMs.foreArm.mass * 9.81;
    let headFy = COMs.head.mass * 9.81;
    let trunkFy = COMs.trunk.mass * 9.81;
    let handFy = COMs.hand.mass * 9.81;

    COMs.upperArm.Fy = upperArmFy;
    COMs.foreArm.Fy = foreArmFy;
    COMs.head.Fy = headFy;
    COMs.trunk.Fy = trunkFy;
    COMs.hand.Fy = handFy;
    
    let upperArmDx = -(COMs.upperArm.x - COMs.l5s1.x) * refToScreenRatio;
    let foreArmDx = -(COMs.foreArm.x - COMs.l5s1.x) * refToScreenRatio;
    let headDx = -(COMs.head.x - COMs.l5s1.x) * refToScreenRatio;
    let trunkDx = -(COMs.trunk.x - COMs.l5s1.x) * refToScreenRatio;
    let handDx = -(COMs.hand.x - COMs.l5s1.x) * refToScreenRatio;

    COMs.upperArm.Dx = upperArmDx;
    COMs.foreArm.Dx = foreArmDx;
    COMs.head.Dx = headDx;
    COMs.trunk.Dx = trunkDx;
    COMs.hand.Dx = handDx;

    let upperArmM = upperArmFy * upperArmDx;
    let foreArmM = foreArmFy * foreArmDx;
    let headM = headFy * headDx;
    let trunkM = trunkFy * trunkDx;
    let handM = handFy * handDx;
    let totalM = (upperArmM + foreArmM + handM) * 2 + headM + trunkM;

    COMs.upperArm.Mo = upperArmM;
    COMs.foreArm.Mo = foreArmM;
    COMs.head.Mo = headM;
    COMs.trunk.Mo = trunkM;
    COMs.hand.Mo = handM;
    COMs.l5s1.totalMo = totalM;

    let spinalLoad = (upperArmFy + foreArmFy + handFy) * 2 + headFy + trunkFy + totalM/0.05;
    COMs.l5s1.load = spinalLoad;
}