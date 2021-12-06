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
const queryString = `${baseUrl}/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account`;

//const contacts =  await axios.get(`${baseUrl}/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account`, config);

//const customers = contacts.data.objects;

exports.getContact = function (req, res){
        axios.get(queryString,config).then(customers =>
            res.json(contacts.data.objects)
        ).catch(_=> {res.status(401).send('No Contracts found');
    })
}