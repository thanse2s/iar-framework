const axios = require('axios');
const OrderEvaluation = require('../models/OrderEvaluation');
const baseUrl = 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX';
const credentials = {
    username: 'guest',
    password: 'guest',
};
const config = {
    headers:{
        'Accept':'application/json'
    },
    auth: credentials,
};

//const contacts =  await axios.get(`${baseUrl}/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account`, config);
//const customers = contacts.data.objects;

const queryContacts = `${baseUrl}/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/`;

const querySalesOrders = `${baseUrl}/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/`;

const queryProducts = `${baseUrl}/org.opencrx.kernel.product1/provider/CRX/segment/Standard/product/`

exports.updateAllOrderEvaluation = function (req, res, next) {
    req.body = {
        orders_evaluation: [],
        social_performance: null,
    }
    axios.get(querySalesOrders, config).then(salesOrders => {
        salesOrders.data.objects.forEach(async function (salesOrder) {
            let position = await getRequestFromOpenCRX(salesOrder['@href'] + '/position');
            if (position.data['@total'] > 0) {
                let basicOrderEvaluation = {};
                await getRequestFromOpenCRX(salesOrder.salesRep['@href']).then(salesman => basicOrderEvaluation.salesman = salesman.data.fullName);
                await getRequestFromOpenCRX(salesOrder.customer['@href']).then(client => {
                    basicOrderEvaluation.client = client.data.fullName;
                    basicOrderEvaluation.client_ranking = client.data.accountRating;
                });
                basicOrderEvaluation.year = parseInt(salesOrder.createdAt.slice(0, 4));
                position.data.objects.forEach(async function (position) {
                    await getRequestFromOpenCRX(position.product['@href']).then(res => {
                         let orderEvaluation = new OrderEvaluation(
                            res.data.name,
                            basicOrderEvaluation.client,
                            basicOrderEvaluation.client_ranking,
                            parseInt(position.quantity),
                            null,
                            null);
                         orderEvaluation.year = basicOrderEvaluation.year;
                         orderEvaluation.salesman = basicOrderEvaluation.salesman;
                         req.body.orders_evaluation.push(orderEvaluation);
                         console.log(req.body.orders_evaluation);
                    });
                });
            }
        }).then(_ => {
            console.log(req.body);
            next();
        });
    });
}

async function getRequestFromOpenCRX(req) {
    return await axios.get(req, config);
}