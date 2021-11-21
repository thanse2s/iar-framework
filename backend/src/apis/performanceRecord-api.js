const performanceservice = require('../services/performancerecords-service');
const {Salesman} = require("../../../frontend/src/app/models/performance");

exports.add = function (req, res){
    const db = req.app.get('db');
    performanceservice.get(db,performancereq);
}

exports.get = function (req, res){
    const db = req.app.get('db');
    id=req.params.id
    id=req.params.year
    performanceservice.get(db,id,year);
}

exports.update = function (req, res){

}

exports.delete = function (req, res){
    const db = req.app.get('db');
    id=req.params.id
    id=req.params.year
    performanceservice.delete(db,id,year);
}
