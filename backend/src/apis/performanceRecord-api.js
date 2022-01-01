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
    console.log("updating...");
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

function performanceRecordMapper(body, id, year) {

    let socialPerformances = [];
    let orderEvaluations = [];
    let performanceRecord;

    //TODO: Check values before insertion
    body["social_performance"].forEach(record => {
        let actual_value = record["actual_value"];
        let target_value = record["target_value"];
        let description = record["description"];
        socialPerformances.push(new SocialPerformance(actual_value, target_value, description));
    });

    body["orders_evaluation"].forEach(record => {
        let client = record["client"];
        let client_ranking = record["client_ranking"];
        let items = record["items"];
        let name_of_product = record["name_of_product"];
        orderEvaluations.push(new OrderEvaluation(name_of_product, client, client_ranking, items));
    });

    performanceRecord = new PerformanceRecord(year, id, socialPerformances, orderEvaluations);
    return performanceRecord;

}
