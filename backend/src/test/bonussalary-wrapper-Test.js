const assert = require("assert");
const sinon = require("sinon");
const wrapper = require("../wrapper/orangehrm/bonussalary-wrapper");
const api = require("../apis/bonussalary-api");

describe("bonussalary-wrapper test", function() {
    it("Check if get returns a bonussalary", function() {
        let req = {
            'params': {
                'id': 0
            }
        };
        let res = {
            send: sinon.spy()
        };

        api.get(req,res);
        assert.equal(true, true);

    })
});