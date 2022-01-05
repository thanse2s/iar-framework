/**
 * this model specifies the format to exchange performancerecords with the frontend and store it in mongoDB
 * @param {number} year
 * @param {number} employee_id
 * @param {social_performance} social_performance
 * @param {orders_evaluation} orders_evaluation
 */

class PerformanceRecord {
    constructor(year, employee_id, social_performance, orders_evaluation) {
        this.year = year;
        this.employee_id = employee_id;
        this.is_committed = false;
        this.social_performance = social_performance;
        this.orders_evaluation = orders_evaluation;
    }

}
module.exports = PerformanceRecord;