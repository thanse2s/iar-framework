const axios = require('axios');
const auth = require('./auth-service');
const qs = require('qs');
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
                parseInt(id),
                parseInt(item.year),
                parseInt(item.value)
            ));
        });
        return result;
    }
}
exports.post = async function (bonussalary) {
    const configWithToken = await auth.authenticate();
    const body = qs.stringify({
        value: bonussalary.value,
        year: bonussalary.year,
    });
    const response = await axios.post(`${auth.baseUrl}/api/v1/employee/${bonussalary.employee_id}/bonussalary`, body,  configWithToken);
    if (response.data.error) {
        throw Error(response.data.error);
    } else {
        return response.data.success;
    }
}
exports.delete = async function (id, year) {
    const configWithToken = await auth.authenticate();
    configWithToken["data"] = qs.stringify({year: year});
    console.log(configWithToken);
    const response = await axios.delete(`${auth.baseUrl}/api/v1/employee/${id}/bonussalary`, configWithToken);
    console.log(response);
    if (response.data.error) {
        throw Error(response.data.error);
    } else {
        return response.data.success;
    }
}