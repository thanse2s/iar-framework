const axios = require('axios');
const auth = require('./auth-service');
const BonusSalary = require('./BonusSalary');

exports.get = async function (id) {
    const configWithToken = await auth.authenticate();
    const response = await axios.get(`${auth.baseUrl}/api/v1/employee/${id}/bonussalary`, configWithToken);
    if (response.data.error) {
        throw Error(response.data.error);
    } else {
        let result = [];
        response.data.data.forEach(item => {
            result.push(new BonusSalary(
                id,
                parseInt(item.year),
                parseInt(item.value)
            ));
        });
        return result;
    }
}
exports.post = async function (bonussalary) {
    const configWithToken = await auth.authenticate();
    const response = await axios.post(`${auth.baseUrl}/api/v1/employee/${bonussalary.id}/bonussalary?
    value=${bonussalary.value}&year=${bonussalary.year}`, configWithToken);
    if (response.data.error) {
        throw Error(response.data.error);
    } else {
        console.log(response.data);
    }
}
exports.delete = async function (id, year) {
    const configWithToken = await auth.authenticate();
    const response = await axios.post(`${auth.baseUrl}/api/v1/employee/${id}/bonussalary?year=${year}`, configWithToken);
    if (response.data.error) {
        throw Error(response.data.error);
    } else {
        console.log(response.data);
    }
}