const bonussalarywrapper = require('../wrapper/orangehrm/bonussalary-wrapper');
const {Bonussalary} = require('../wrapper/orangehrm/BonusSalary');

exports.post = function (req, res) {
    let bonussalary = new Bonussalary(
        req.params.id,
        req.params.year,
        req.params.value
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
    bonussalarywrapper.delete(
        req.params.id,
        req.params.year
    )
        .then(_=> res.status(200).send(`Bonus salary of Employee with id=${req.params.id} from year ${req.params.year} has been deleted!`))
        .catch(_=> res.status(401).send(`Error: Could not delete Salary of Employee with id=${req.params.id} from year ${req.params.year}!`));
}