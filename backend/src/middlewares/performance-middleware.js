const bonusSalaryApi = require("../apis/bonussalary-api");
const performanceApi = require("../apis/performanceRecord-api");
/**
 * this middleware splits a message and sends a post request to the bonusSalaryApi
 * otherwise the request gets intercepted and status 401 is returned
 * @param req
 * @param res
 * @param next
 * @return {(function(*, *, *): void)|*}
 */
exports.postBonusSalary = async (req, res, next) => {
    let bonusRes = {};
    await bonusSalaryApi.post(req, res);
    console.log(bonusRes);
    console.log(res);
    next();
}
exports.commit = async (req, res, next) => {
    await performanceApi.commit(req, res);
}
// This Array maps the client_ranking of an order evaluation to a number
const rankingMap = ["bad", "mediocre", "good", "very good", "excellent"];
exports.getRanking = () => {
    return rankingMap;
}
// Enriches bonus salary
exports.correctBonusInBody = (req, res, next) => {
    let body = req.body;
    let invalid = false;
    if (!isNullOrUndefined(body.social_performance)) {
        body.social_performance.forEach(social => {
            if (isNullOrUndefined(social.bonus)) {
                if (!isNullOrUndefined(social.actual_value) && !isNullOrUndefined(social.target_value)) {
                    // This is the algorithm to calculate the Bonus of a social performance
                    social.bonus = social.actual_value / social.target_value * 100;
                } else {
                    invalid = true;
                }
            }
        });
    }
    if (!isNullOrUndefined(body.orders_evaluation)) {
        body.orders_evaluation.forEach(order => {
            if (isNullOrUndefined(order.bonus)) {
                if (!isNullOrUndefined(order.client_ranking) && !isNullOrUndefined(order.items)) {
                    // This is the algorithm to calculate the Bonus of an order evaluation
                    order.bonus = rankingMap.indexOf(order.client_ranking) * order.items * 15;
                } else invalid = true;
            }
        });
    }
    if (invalid) res.status(400).send('Error: There are missing Values in the Record!');
    else next();
}
function isNullOrUndefined(value) {
    return value === null || value === undefined;
}