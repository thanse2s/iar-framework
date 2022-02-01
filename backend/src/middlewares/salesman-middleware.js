const salemanService = require('../services/salesman-service');

exports.mapNamesToEmployeeIds = async function (req, res, next) {
    for (const orderEvaluation of req.body.orders_evaluation) {
        const name = orderEvaluation.salesman.split(', ');
        orderEvaluation.salesmanId = await salemanService.getIdByName(req.app.get('db'), name.pop(), name.pop());
        if (orderEvaluation.salesmanId === -1) {
            res.status(404).send('A required Salesman could not be found by name. Check if this Salesman requires a new account!');
            return;
        }
    }
    next();
}