const salesmanservice = require('../services/salesman-service');
const {Salesman} = require("../models/Salesman");

/**
 * endpoint, which returns information about the user, which is currently authenticated
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.getOne  = function (req, res){
    const db = req.app.get('db');
        salesmanservice.get(db,parseInt(req.params.id)).then(Salesman=> {
                res.json(Salesman);
            }
        ).catch(_=> {res.status(401).send('No Salesman found');
        });
}

exports.addSalesMan = function (req, res){
    const db = req.app.get('db');
    salesmanservice.add(db,salesman);
}

exports.deleteSalesMan = function (req,res){
    const db = req.app.get('db');
    salesmanservice.delete(db,parseInt(req.params.id));
}