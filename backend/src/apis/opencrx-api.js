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

const queryProducts = `${baseUrl}`

exports.getAllContacts = function (req, res){
        axios.get(queryContacts,config).then(accounts =>
            res.json(accounts.data.objects)

        ).catch(_=> {res.status(401).send('No Contracts found');
    })
}

exports.getContactByID = function (req, res) {
    let id = req.params.id;
    console.log(id);
    let queryIDContact = `${queryContacts}${id}`
    console.log(queryIDContact);
    axios.get(queryIDContact, config).then(account => {
            res.json(account.data);
        }
    ).catch(_=> res.status(401).send(`No Contact with id ${id} found`));
}