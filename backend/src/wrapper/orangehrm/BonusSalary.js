/**
 * this model specifies the format to exchange bonus salarys with orangeHRM
 * @param {number} employee_id
 * @param {number} year
 * @param {number} value
 */
class BonusSalary {
    constructor(employee_id, year, value) {
        this.employee_id = employee_id;
        this.year = year;
        this.value = value;
    }
}
module.exports = BonusSalary;