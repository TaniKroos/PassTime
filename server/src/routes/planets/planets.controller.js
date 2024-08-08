const {getAllPlanets} = require('../../models/planets.model')



function httpGetAllPlanets(req,res){
    return res.status(200).json(getAllPlanets()); // to make sure controller only set the response only once

}

module.exports = {
    httpGetAllPlanets,
};