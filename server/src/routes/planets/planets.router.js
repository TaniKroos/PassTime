const expres = require('express');
const {
    httpGetAllPlanets,
} = require('./planets.controller')

const planetsRouter = expres.Router();

planetsRouter.get('/',httpGetAllPlanets);  
module.exports = planetsRouter ; 