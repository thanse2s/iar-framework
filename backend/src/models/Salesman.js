/**
 * this model specifies the format to exchange userdata with the frontend and store it in mongoDB
 * @param {number} employ_ID
 * @param {string} firstname
 * @param {string} lastname
 * @param {string} department
 */

class Salesman {
    constructor(employ_ID, firstname, lastname, department) {
        this.employ_ID = employ_ID;
        this.firstname = firstname;
        this.lastname = lastname;
        this.department = department;

    }
}
module.exports = Salesman;