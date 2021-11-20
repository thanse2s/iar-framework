/**
 * this model specifies the format to exchange userdata with the frontend and store it in mongoDB
 * @param {number} employee_id
 * @param {string} firstname
 * @param {string} lastname
 * @param {string} department
 */

class Salesman {
    constructor(employee_id, firstname, lastname, department) {
        this.employee_id = employee_id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.department = department;

    }
}
module.exports = Salesman;