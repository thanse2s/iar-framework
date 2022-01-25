const express = require('express');
const router = express.Router();
const {checkAuthorization, haveRole} = require('../middlewares/auth-middleware');

/*
    In this file is the routing for the REST-endpoints under /api managed
 */

const authApi = require('../apis/auth-api'); //api-endpoints are loaded from separate files
router.post('/login', authApi.login); //the function decides which request type should be accepted
router.delete('/login',checkAuthorization(),authApi.logout); //middlewares can be defined in parameters
router.get('/login', authApi.isLoggedIn); //the function, which handles requests is specified as the last parameter

const userApi = require('../apis/user-api');
router.get('/user', checkAuthorization(), userApi.getSelf);


const salesmanApi = require('../apis/salesman-api');
router.get('/salesman/:id',haveRole("manager"), salesmanApi.getOne);
router.post('/salesman',haveRole("manager"), salesmanApi.addSalesMan);
router.delete('/salesman/:id',haveRole("manager"), salesmanApi.deleteSalesMan);
router.get('/salesman',haveRole("manager"), salesmanApi.getAll);

// OrangeHRM
const bonusSalaryApi = require('../apis/bonussalary-api');
router.get('/bonussalary/:id',checkAuthorization(), bonusSalaryApi.get)
router.post('/bonussalary/:id',haveRole("HR"), bonusSalaryApi.post)
router.delete('/bonussalary/:id',haveRole("HR"), bonusSalaryApi.delete)

const performanceApi = require('../apis/performanceRecord-api');
const {postBonusSalary, commit, correctBonusInBody} = require('../middlewares/performance-middleware')
router.get('/performance/uncommitted',checkAuthorization, performanceApi.getCommitted);
router.get('/performance/:id',checkAuthorization, performanceApi.get);
router.get('/performance',checkAuthorization, performanceApi.get);
router.post('/performance/commit/:id',haveRole("HR"), postBonusSalary, commit);
router.post('/performance/calculatebonus/:id',haveRole("manager"), correctBonusInBody, performanceApi.sendBack);
router.post('/performance/:id',haveRole("manager"), correctBonusInBody, performanceApi.update);
router.post('/performance',haveRole("manager"), correctBonusInBody, performanceApi.add);
router.delete('/performance/:id',haveRole("manager"), performanceApi.delete);
module.exports = router;

router.post('/performance/:id',haveRole("manager"), performanceApi.update);
router.post('/performance',haveRole("manager"), performanceApi.add);
router.delete('/performance/:id',haveRole("manager"), performanceApi.delete);
module.exports = router;

const openCRXApi = require('../apis/opencrx-api');
router.get('/opencrx/account', openCRXApi.getAllContacts);
router.get('/opencrx/account/:id', openCRXApi.getContactByID);
router.post('opencrx/update', openCRXApi.updateAllOrderEvaluation);
