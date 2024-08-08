const fs = require('fs');
const { prependListener } = require('process');
const planetsRouter = require('../routes/planets/planets.router');
const path = require('path')

const {parse} = require('csv-parse');


function isHabitable(planet){
    return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] >0.36 && planet['koi_insol']<1.11
    && planet['koi_prad']<1.6;
}


const results = []


/* 
const promise = new Promise((resolve,reject) =>{
    resolve(42);
});

*/
function loadPlanetsData(){
    
    return new Promise((resolve,reject) => {
        fs.createReadStream(path.join(__dirname,'..','..','data','KOI.csv'))
        .pipe(parse({
            comment: "#",
            columns: true
        }))
        .on('data', (data) =>{
            if(isHabitable(data))
                results.push(data)
        })
        .on('error',(e)=>{
            console.log(e);
            reject(e);
        })
        .on('end',()=>{
           
            console.log(`${results.length}  habitable planets found`);
            console.log("DONE");
        });
        resolve();
    })
}
function getAllPlanets(){
    return results;
}


module.exports ={
    loadPlanetsData,
    getAllPlanets,
};

//parse();