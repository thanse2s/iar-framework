const axios = require('axios');
const OrderEvaluation = require('../models/OrderEvaluation');
const {getRanking} = require('../middlewares/performance-middleware')
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

/*
 * Middleware Method to pull and combine Data from OpenCRX. The Result is a set of Order Evaluations.
 * Calls the next handler if done
 */
exports.updateAllOrderEvaluation = async function (req, res, next) {
    req.body = {
        orders_evaluation: [],
        social_performance: null,
    }
    let salesOrders = await axios.get(querySalesOrders, config);
    for (const salesOrder of salesOrders.data.objects) {
        let position = await getRequestFromOpenCRX(salesOrder['@href'] + '/position');
        if (position.data['@total'] > 0) {
            let salesman = await getRequestFromOpenCRX(salesOrder.salesRep['@href']);
            let client = await getRequestFromOpenCRX(salesOrder.customer['@href']);
            let year = parseInt(salesOrder.createdAt.slice(0, 4));
            await position.data.objects.forEach(function (position) {
                getRequestFromOpenCRX(position.product['@href']).then(res => {
                     let orderEvaluation = new OrderEvaluation(
                         res.data.name,
                         client.data.fullName,
                         mapRating(client.data.accountRating),
                         parseInt(position.quantity),
                        null,
                        null);
                     orderEvaluation.year = year;
                     orderEvaluation.salesman = salesman.data.fullName;
                     req.body.orders_evaluation.push(orderEvaluation);
                });
            });
        }
    }
    next();
}

async function getRequestFromOpenCRX(req) {
    return await axios.get(req, config);
}

/*
 * Maps an accountRating from OpenCRX to a textural Representation
 */
const rankingMap = getRanking();
function mapRating(accountRating) {
    return rankingMap[rankingMap.length - accountRating];
}