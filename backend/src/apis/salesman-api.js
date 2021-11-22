const salesmanservice = require('../services/salesman-service');
const {Salesman} = require("../../../frontend/src/app/models/Salesman");

/**
 * endpoint, which returns information about the user, which is currently authenticated
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.getOne  = function (req, res){
    const db = req.app.get('db');
    id=req.params.id
    salesmanservice.get(db,id);
}

exports.addSalesMan = function (req, res){
    const db = req.app.get('db');
    salesmanservice.add(db,salesman);
}

exports.deleteSalesMan = function (req,res){
    const db = req.app.get('db');
    id=req.params.id
    salesmanservice.delete(db,id);
}