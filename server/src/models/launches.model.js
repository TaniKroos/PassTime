
const { query } = require('express');
const launchesDB = require('./launches.mongo');

const planets = require('./planets.mongo');
const axios = require('axios');



const DEFAULT_FLIGHT_NUMBER = 100;


const SPACE_X_API_URL = 'https://api.spacexdata.com/v4/launches/query';


async function populateLaunches(){
    const response = await axios.post(SPACE_X_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    });
    if(response.status !== 200){
        console.log('Problem loading launch data');
        throw new Error('Launch data download failed');
    }




    const launchDocs = response.data.docs;
    for(const doc of launchDocs){
        const payloads = doc['payloads'];
        const customers = payloads.flatMap((payload) =>{
            return payload['customers'];
        });
        const launch ={
            flightNumber: doc['flight_number'],
            mission: doc['name'],
            rocket: doc['rocket']['name'],
            launchDate: doc['date_local'],
            upcoming: doc['upcoming'],
            success: doc['success'],
            customers,
        };

        console.log(`${launch.flightNumber} ${launch.mission}`);
        // TODO
        await savelaunch(launch);
    }
}

async function loadLaunchData(){
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });
    console.log("Filter Criteria:", firstLaunch);
    console.log("First Launch Found:", firstLaunch);

    if(firstLaunch){
        console.log('Launch Data is already loaded');
        
    }else{
        await populateLaunches();
    }
    
}

async function findLaunch(filter){
    return await launchesDB.findOne(filter);
}





async function getLatestFlightNumber(){
    const latestLaunch = await launchesDB
        .findOne()
        .sort('-flightNumber');
    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}


async function getAllLaunches(skip,limit){
    return await launchesDB
    .find({},{ '_id':0 , '__v':0})
    .sort({flightNumber: 1})
    .skip(skip)
    .limit(limit);
}
async function savelaunch(launch){
    
    await launchesDB.findOneAndUpdate({
        flightNumber: launch.flightNumber
    },launch,{
        upsert: true
    });
}

async function scheduleNewLaunch(launch){

    const planet = await planets.findOne({
        keplerName: launch.target,
    })
    if(!planet){
        throw new Error('No matching planets found');
    }
    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch,{
        success: true,
        upcoming: true,
        customer: ['ZTM','NASA'],
        flightNumber: newFlightNumber,
     
    });
    await savelaunch(newLaunch);
}


  
async   function existsLaunchWithId(launchId) {
    return await launchesDB.findOne({
        flightNumber: launchId,
    });
  }

async  function abortLaunchById(launchId){
  
    const aborted = await launchesDB.updateOne({
        flightNumber: launchId,
    },{
        // Use the $set operator to update specific fields
            upcoming: false,
            success: false,
        
    });
    return aborted.matchedCount === 1 && aborted.modifiedCount === 1;
  }

module.exports = {
    loadLaunchData,
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    
    abortLaunchById,
};