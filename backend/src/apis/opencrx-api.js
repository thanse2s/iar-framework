const axios = require('axios');
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
    await axios.get(queryContacts, config).then(accounts => {
        accounts.data.objects.forEach(account => {
            let UID = account.identity.split("/").pop();
            console.log(UID);
            let name = account.fullName;
            console.log(name);
            let costumerRating = account.accountRating;
            /*
            CostumerRating dient als Metrik um Account als Firmen-Account zu identifizieren
            => Gibt es einen besseren weg? TODO: Metrik überprüfen
             */
            if (costumerRating !== 0) {
                let products = getProducts();
                console.log(products);
                let orders = getSalesOrders(name);
                console.log(orders);
            }
        });

    }).catch(_=> res.status(401).send(`Failed to update Database`));
}

exports.getAllContacts = async function (req, res){
        await axios.get(queryContacts,config).then(accounts => {
                accounts.data.objects.forEach(account => {
                    let UID = account.identity.split("/").pop();
                    console.log(UID);
                    let name = account.fullName;
                    console.log(name);
                    let costumerRating = account.accountRating;
                    console.log(costumerRating);
                    if (costumerRating !== 0) {
                        let products = getProducts(name);
                        //console.log(products);
                        let orders = getSalesOrders(name);
                        //console.log(orders);
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
           console.log(product.name);
        });
    });
    return products;
}

async function getSalesOrders(name) {
    let sales = [];
    await axios.get(querySalesOrders, config).then(orders => {
        orders.data.objects.forEach(order => {
           let salesRepID = order.salesRep.$.split("/").pop();
           console.log(salesRepID);
           let salesRep = getAccountnameByID(salesRepID);
           console.log(salesRep);
           let customerID = order.customer.$.split("/").pop();
           console.log(customerID);
           let customer = getAccountnameByID(customerID);
           console.log(customer);

        });
    });
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
        res.json(products);
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
        res.json(salesOrders);
    });
};

exports.getSalesOrderById = async function(req, res) {
    let id = req.params.id;
    let queryIDSalesOrders = `${querySalesOrders}${id}`;
    await axiot.get(queryIDSalesOrders, config).then(salesOrder => {
        res.json(salesOrder);
    });
};