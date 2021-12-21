/**
 * this model specifies the format to exchange social performance records with the frontend and store it in mongoDB
 * @param {number} actual_value
 * @param {number} target_value
 * @param {String} description
 * @param {number} bonus
 * @param {string} comment
 */

class SocialPerformance {
    constructor(actual_value, target_value, description, bonus, comment) {
        this.actual_value = actual_value;
        this.target_value = target_value;
        this.description = description;
        if (bonus === undefined) {
            this.bonus = actual_value / target_value * 100;
        } else {
            this.bonus = bonus;
        }
        this.comment = comment;
    }
}
module.exports = SocialPerformance;