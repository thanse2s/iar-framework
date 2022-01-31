const performanceService = require('../services/performancerecords-service');
const PerformanceRecord = require("../models/PerformanceRecord");
const SocialPerformance = require("../models/SocialPerformance");
const OrderEvaluation = require("../models/OrderEvaluation");

exports.add = function (req, res){
    const db = req.app.get('db');
    let id = parseInt(req.query.id);
    let year = parseInt(req.query.year);
    let performanceRecord = performanceRecordMapper(req.body, id, year);
    performanceService.add(db,performanceRecord)
        .then( _=> res.status(200).send("Performance Record has been created."))
        .catch( _=> res.status(401).send("Error. Couldn't create Performance Record!"));
}

exports.get = function (req, res){
    const db = req.app.get('db');
    let id = parseInt(req.params.id);
    let year = parseInt(req.query.year);
    performanceService.get(db,id,year)
        .then(performanceRecord => res.status(200).json(performanceRecord))
        .catch( _=> res.status(401).send(`Error. No Performance Record for id: ${id} and year: ${year} found!`));
}

exports.update = function (req, res){
    const db = req.app.get('db');
    let id = parseInt(req.params.id);
    let year = parseInt(req.query.year);
    let performanceRecord = performanceRecordMapper(req.body, id, year);
    performanceService.update(db, performanceRecord)
        .then( _=> res.status(200).send("Performance Record has been updated!"))
        .catch( _=> res.status(401).send(`Error. No Performance Record could be updated with id: ${id} and year: ${year}`));
}

exports.delete = function (req, res){
    const db = req.app.get('db');
    let id = parseInt(req.params.id);
    let year = parseInt(req.query.year);
    performanceService.delete(db,id,year)
        .then( _=> res.status(200).send(`Performance Record with id: ${id} and year: ${year} has been deleted!`))
        .catch( _=> res.status(400).send(`Error. Couldn't delete Performance Record with id: ${id} and year: ${year}!`));
}

exports.commit = function (req, res){
    const db = req.app.get('db');
    let id = parseInt(req.params.id);
    let year = parseInt(req.query.year);
    performanceService.commit(db,id,year)
        .then( _=> res.status(200).append(`Performance Record with id: ${id} and year: ${year} has been committed to OrangeHRM!`))
        .catch( _=> res.status(400).append('Error', 'Error while committing a bonus: Something went wrong trying to update in Database!'));
}

exports.getCommitted = function (req, res){
    const db = req.app.get('db');
    performanceService.getCommitted(db)
        .then(performanceRecords => res.status(200).json(performanceRecords))
        .catch( _=> res.status(400).send('Error', 'Hi'));
}

exports.sendBack = function (req, res){
    let id = parseInt(req.params.id);
    let year = parseInt(req.query.year);
    res.status(200).json(performanceRecordMapper(req.body, id, year));
}

exports.addMissingOrderEvaluations = function (req, res) {
    console.log(req.body.orders_evaluation);
}

function performanceRecordMapper(body, id, year) {

    let socialPerformances = [];
    let orderEvaluations = [];
    let performanceRecord;

    //TODO: Check values before insertion
    body["social_performance"].forEach(record => {
        let actual_value = record["actual_value"];
        let target_value = record["target_value"];
        let description = record["description"];
        let bonus = record["bonus"];
        let comment = record["comment"];
        socialPerformances.push(new SocialPerformance(actual_value, target_value, description, bonus, comment));
    });

    body["orders_evaluation"].forEach(record => {
        let client = record["client"];
        let client_ranking = record["client_ranking"];
        let items = record["items"];
        let name_of_product = record["name_of_product"];
        let bonus = record["bonus"];
        let comment = record["comment"];
        orderEvaluations.push(new OrderEvaluation(name_of_product, client, client_ranking, items, bonus, comment));
    });

    performanceRecord = new PerformanceRecord(year, id, socialPerformances, orderEvaluations);
    return performanceRecord;

}
