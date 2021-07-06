/**
 * object containing video frame and pose data arrays
 * @typedef {Object} Poses
 * @property {ImageData[]} frames - array containing the frames of the video
 * @property {Array} poseArr - array containing the posenet pose data at each frame, see posenet documentation for more info about pose data
*/

/**
 * various data for a body part
 * @typedef {Object} BodyPart
 * @property {number} x - x coordinate of the COM of the body part
 * @property {number} y - y coordinate of the COM of the body part
 * @property {number} mass - mass of the body part in kg
 * @property {number} Fy - weight of the body part in kg
 * @property {number} Dx - horizontal distance between the body part ad the l5s1 joint in m
 * @property {number} Mo - moment caused by the body part in Nm
*/

/**
 * various data for a joint
 * @typedef {Object} Joint
 * @property {number} x - x coordinate of the joint
 * @property {number} y - y coordinate of the joint
 * @property {number} totalMo - total moment caused by the body around the joint in Nm
 * @property {number} load - total compressive load at the joint in N
 */

/**
 * various center of mass data for a body (and l5s1 joint data)
 * @typedef {Object} COMs
 * @property {BodyPart} upperArm
 * @property {BodyPart} foreArm
 * @property {BodyPart} head
 * @property {BodyPart} hand - .mass, .Fy, and .Mo also include the mass of the object being lifted
 * @property {BodyPart} trunk
 * @property {Joint} l5s1
*/

/**
 * returns an array of COMs for each pose in poses
 * @param {Poses} poses - video frame and pose data for the lift evaluated at 5fps
 * @param {number} mass - mass of the object being lifted in kg
 * @param {number} weight - lifters mass in kg
 * @param {number} refToScreenRatio - real-life:on-screen ratio in px:m
 * @returns {COMs[]} array of COMs objects
*/
export default function createCOMsArr(poses, mass, weight, refToScreenRatio)
{
    let COMsArr = [];
    for(let i = 0; i < poses.frames.length; i++)
    {
        //Getting position of important posenet joints
        let pose = poses.poseArr[i];
        let leftShoulder = pose[5].position;
        let leftElbow = pose[7].position;
        let leftWrist = pose[9].position;
        let leftHip = pose[11].position;
        let leftEar = pose[3].position;

        //Setting up COMs with position and mass
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


/**
 * adds Fy, Dx, Mo, totalMo and load data to a COMs object
 * @param {COMs} COMs - a COMs object
 * @param {number} refToScreenRatio - real-life:on-screen ratio in px:m
 */
function addLoads(COMs, refToScreenRatio)
{
    // Force data
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
    
    // Distance data
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

    //Moment data
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

    //L5S1 load data
    let spinalLoad = (upperArmFy + foreArmFy + handFy) * 2 + headFy + trunkFy + totalM/0.05;
    COMs.l5s1.load = spinalLoad;
}
