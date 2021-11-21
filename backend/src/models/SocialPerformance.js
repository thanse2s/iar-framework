/**
 * this model specifies the format to exchange social performance records with the frontend and store it in mongoDB
 * @param {number} actual_value
 * @param {number} target_value
 * @param {String} description
 */

class SocialPerformance {
    constructor(actual_value, target_value, description) {
        this.actual_value = actual_value;
        this.target_value = target_value;
        this.description = description;
    }
}
module.exports = SocialPerformance;