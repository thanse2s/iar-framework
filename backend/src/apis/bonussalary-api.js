const bonussalarywrapper = require('../wrapper/orangehrm/bonussalary-wrapper');
const BonusSalary = require('../wrapper/orangehrm/BonusSalary');

exports.post = function (req, res) {
    let bonussalary = new BonusSalary(
        parseInt(req.params.id),
        parseInt(req.query.year),
        parseInt(req.query.value)
    );
    bonussalarywrapper.post(bonussalary)
        .then(_=> res.status(200).send('Bonus salary was updated!'))
        .catch(_=> res.status(401).send('Error: Could not create bonus salary!'));
}

exports.get = function (req, res) {
    bonussalarywrapper.get(req.params.id)
        .then(bonussalary => res.status(200).json(bonussalary))
        .catch(_=> res.status(401).send(`Error: Could not find bonus salary's of Employee with id=${req.params.id}!`))
}
exports.delete = function (req, res) {
    console.log(req.query.year);
    let id = parseInt(req.params.id);
    let year = parseInt(req.query.year);
    bonussalarywrapper.delete(id, year)
        .then(_=> res.status(200).send(`Bonus salary of Employee with id=${id} from year ${year} has been deleted!`))
        .catch(_=> res.status(401).send(`Error: Could not delete Salary of Employee with id=${id} from year ${year}!`));
}