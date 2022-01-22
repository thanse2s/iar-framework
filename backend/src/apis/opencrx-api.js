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

const queryProducts = `${baseUrl}`;

exports.updateAllOrderEvaluation = async function (req, res) {
    await axios.get(queryContacts, config).then(accounts => {
        accounts.data.objects.forEach(account => {
            let UID = account.identity.split("/").pop();
            console.log(UID);
            let name = account.fullName;
            console.log(name);
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

