const performanceService = require('../services/performancerecords-service');
const {performanceRecord} = require("../models/PerformanceRecord");

exports.add = function (req, res){
    const db = req.app.get('db');
    let id = req.params.id;
    let year = req.params.year;
    let social_performance = req.params.social_performance;
    let orders_evaluation = req.params.orders_evaluation;
    let performanceRecord = new performanceRecord(year,id,social_performance,orders_evaluation);
    performanceService.add(db,performanceRecord)
        .then( _=> res.status(200).send("Performance Record has been created."))
        .catch( _=> res.status(401).send("Error. Couldn't create Performance Record!"));
}

exports.get = function (req, res){
    const db = req.app.get('db');
    let id=req.params.id
    let year=req.params.year
    performanceService.get(db,id,year)
        .then(performanceRecord => res.status(200).json(performanceRecord))
        .catch( _=> res.status(401).send(`Error. No Performance Record for id: ${id} and year: ${year} found!`));
}

exports.update = function (req, res){
    const db = req.app.get('db');
    let id = req.params.id;
    let year = req.params.year;
    let social_performance = req.params.social_performance;
    let orders_evaluation = req.params.orders_evaluation;
    let performanceRecord = new performanceRecord(year,id,social_performance,orders_evaluation);
    performanceService.update(db, performanceRecord)
        .then( _=> res.status(200).send("Performance Record has been updated!")).
        catch( _=> res.status(401).send(`Error. No Performance Record could be updated with id: ${id} and year: ${year}`));
}

exports.delete = function (req, res){
    const db = req.app.get('db');
    let id=req.params.id
    let year=req.params.year
    performanceService.delete(db,id,year)
        .then( _=> res.status(200).send(`Performance Record with id: ${id} and year: ${year} has been deleted!`))
        .catch( _=> res.status(400).send(`Error. Couldn't delete Performance Record with id: ${id} and year: ${year}!`));
}
