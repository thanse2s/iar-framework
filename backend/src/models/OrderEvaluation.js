/**
 * this model specifies the format to exchange order evaluations with the frontend and store it in mongoDB
 * @param {String} name_of_product
 * @param {String} client
 * @param {number} client_ranking
 * @param {number} items
 */

class OrderEvaluation {
    constructor(name_of_product, client, client_ranking, items) {
        this.name_of_product = name_of_product;
        this.client = client;
        this.client_ranking = client_ranking;
        this.items = items;
    }
}
module.exports = OrderEvaluation;