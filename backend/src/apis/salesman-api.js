const salesmanservice = require('../services/salesman-service');
const s1 = require("../models/Salesman");

/**
 * endpoint, which returns information about the user, which is currently authenticated
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.getOne  = function (req, res){
    const db = req.app.get('db');
        salesmanservice.get(db,parseInt(req.params.id))
            .then(Salesman => res.json(Salesman))
            .catch(_=> {res.status(404).send('No Salesman found');});
}

exports.getAll = function (req,res){
    const db = req.app.get('db');
    salesmanservice.getAll(db)
        .then(Salesman => res.json(Salesman))
        .catch(_=> {res.status(404).send('No Salesman found');});
}

exports.addSalesMan = function (req, res){
    const db = req.app.get('db');
    salesmanservice.add(db, new s1(
        parseInt(req.body.id),
        req.body.firstname,
        req.body.lastname,
        req.body.department))
        .then(res.send("Salesman added"))
        .catch(_=> {res.status(404).send('No Salesman found');
    });
}

exports.deleteSalesMan = function (req,res){
    const db = req.app.get('db');
    const id = parseInt(req.params.id)
    salesmanservice.delete(db, id)
        .then(res.send("Salesman deleted"))
        .catch(_=> {res.status(404).send('No Salesman found');});
}