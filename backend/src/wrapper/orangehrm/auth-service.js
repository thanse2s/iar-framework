const axios = require('axios');
const qs = require('querystring');

const baseUrl = 'https://sepp-hrm.inf.h-brs.de/symfony/web/index.php';
exports.baseUrl = baseUrl;
let accessToken = null;

//getEmployee(9);
//getBonusSalary(9);

exports.authenticate = async function () {
    const body = qs.stringify({
        client_id: 'api_oauth_id',
        client_secret: 'oauth_secret',
        grant_type: 'password',
        username: 'Busse',
        password: '*Safb02da42Demo$'
    });
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        }
    };
    const response = await axios.post(`${baseUrl}/oauth/issueToken`, body, config);
    if (response.data.error) {
        throw Error(response.data.error);
    }
    accessToken = response.data['access_token'];
    console.log(accessToken);
    return {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };
}
async function getEmployee(id) {
    await authenticate();
    const configWithToken = {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };
    const response = await axios.get(`${baseUrl}/api/v1/employee/${id}`, configWithToken);
    if (response.data.error) {
        throw Error(response.data.error);
    } else {
        console.log(response.data);
    }
}