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

exports.updateAllOrderEvaluation = async function (req, res) {
    await axios.get(querySalesOrders, config).then(salesOrders => {
        //axios.get(querySalesOrders + '/L6K69EO6Y3ZS9H2MA4T2TYJFL/position', config).then(a => console.log(a.data.objects));
        salesOrders.data.objects.forEach(async function (salesOrder) {
            let orderEvaluations = [];
            let basicOrderEvaluation = {};
            await getRequestFromOpenCRX(salesOrder.salesRep['@href']).then(salesman => basicOrderEvaluation.salesman = salesman.data.fullName);
            await getRequestFromOpenCRX(salesOrder.customer['@href']).then(client => basicOrderEvaluation.client = client.data.fullName);
            basicOrderEvaluation.year = parseInt(salesOrder.createdAt.slice(0,4));
            let id = salesOrder.identity.split("/").pop();
            let position = await getRequestFromOpenCRX(salesOrder['@href']+'/position');
            console.log(position);
            position.data.objects.forEach(position => {
                let nameOfProduct;
                getRequestFromOpenCRX(position.product['@href']).then(res => nameOfProduct = res.data.objects.name);
                let orderEvaluation = new OrderEvaluation(
                    nameOfProduct,
                    basicOrderEvaluation.client,
                    0,
                    parseInt(position.quantity),
                    null,
                    null);
                console.log(orderEvaluation);
            });
            console.log(basicOrderEvaluation);
        });
    }).catch(_=> res.status(401).send(`Failed to update Database`));
}

async function getRequestFromOpenCRX(req) {
    return await axios.get(req, config);
}

exports.getAllContacts = async function (req, res){
        await axios.get(queryContacts,config).then(accounts => {
                accounts.data.objects.forEach( account => {
                    let UID = account.identity.split("/").pop();
                    //console.log(UID);
                    let name = account.fullName;
                    //console.log(name);
                    let costumerRating = account.accountRating;
                    //console.log(costumerRating);
                    if (costumerRating !== 0) {
                        //let products = getProducts(name);
                        //console.log(products);
                        let orders = getSalesOrders(name);
                        console.log(orders);
                    }
                });
                res.json(accounts.data.objects);
            }
        ).catch(_=> {res.status(401).send('No Contacts found');
    })
}

exports.getContactByID = function (req, res) {
    let id = req.params.id;
    let queryIDContact = `${queryContacts}${id}`;
    console.log(queryIDContact);
    axios.get(queryIDContact, config).then(account => {
            res.json(account.data);
        }
    ).catch(_=> res.status(401).send(`No Contact with id ${id} found`));
}

async function getProducts() {
    let products = [];
    await axios.get(queryProducts, config).then(allproducts => {
        allproducts.data.objects.forEach(product => {
           products.push(product.name);
           //console.log(product.name);
        });
    });
    return products;
}

function getSalesOrders(name) {
    let sales = [];
    axios.get(querySalesOrders, config).then(orders => {
        orders.data.objects.forEach(order => {
           let salesRepID = order.salesRep.$.split("/").pop();
           //console.log(salesRepID);
            sales.push(salesRepID);
           let salesRep = getAccountnameByID(salesRepID);
           //console.log(salesRep);
           let customerID = order.customer.$.split("/").pop();
            console.log(customerID);
            sales.push(customerID);
           let customer = getAccountnameByID(customerID);
           //console.log(customer);
        });
    });
    return sales;
}

function getAccountnameByID(id) {
    let name;
    let queryIDContact = `${queryContacts}${id}`;
    axios.get(queryIDContact, config).then(account => {
            name = account.data.fullName;
        }).catch(_=> console.log(`No Contact with id ${id} found`));
    return name;
}

exports.getAllProducts = async function(req, res) {
    await axios.get(queryProducts, config).then(products => {
        res.json(products.data);
    });
};

exports.getProductById = async function(req, res) {
    let id = req.params.id;
    let queryIDProducts = `${queryProducts}${id}`;
    await axios.get(queryIDProducts, config).then(product => {
        res.json(product);
    });
};

exports.getAllSalesOrders = async function(req, res) {
    await axios.get(querySalesOrders, config).then(salesOrders => {
        res.json(salesOrders.data);
    });
};

exports.getSalesOrderById = async function(req, res) {
    let id = req.params.id;
    let queryIDSalesOrders = `${querySalesOrders}${id}`;
    await axios.get(queryIDSalesOrders, config).then(salesOrder => {
        res.json(salesOrder);
    });
};