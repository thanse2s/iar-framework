const express = require('express');
const router = express.Router();
const {checkAuthorizationForAllRoles, checkAuthorizationByRole} = require('../middlewares/auth-middleware');

/*
    In this file is the routing for the REST-endpoints under /api managed
 */

const authApi = require('../apis/auth-api'); //api-endpoints are loaded from separate files
router.post('/login', authApi.login); //the function decides which request type should be accepted
router.delete('/login',checkAuthorizationForAllRoles, authApi.logout); //middlewares can be defined in parameters
router.get('/login', authApi.isLoggedIn); //the function, which handles requests is specified as the last parameter

const userApi = require('../apis/user-api');
router.get('/user', checkAuthorizationForAllRoles, userApi.getSelf);


const salesmanApi = require('../apis/salesman-api');
router.get('/salesman/:id', checkAuthorizationForAllRoles, salesmanApi.getOne);
router.post('/salesman',checkAuthorizationByRole("manager"),  salesmanApi.addSalesMan);
router.delete('/salesman/:id', checkAuthorizationByRole("manager"), salesmanApi.deleteSalesMan);
router.get('/salesman', checkAuthorizationByRole("manager"), salesmanApi.getAll);

// OrangeHRM
const bonusSalaryApi = require('../apis/bonussalary-api');
router.get('/bonussalary/:id', checkAuthorizationForAllRoles, bonusSalaryApi.get)
router.post('/bonussalary/:id', checkAuthorizationByRole("HR"), bonusSalaryApi.post)
router.delete('/bonussalary/:id', checkAuthorizationByRole("HR"), bonusSalaryApi.delete)

const performanceApi = require('../apis/performanceRecord-api');
const {postBonusSalary, commit, correctBonusInBody} = require('../middlewares/performance-middleware')
router.get('/performance/uncommitted', checkAuthorizationForAllRoles, performanceApi.getCommitted);
router.get('/performance/:id', checkAuthorizationForAllRoles, performanceApi.get);
router.post('/performance/commit/:id',checkAuthorizationByRole("HR"), postBonusSalary, commit);
router.post('/performance/calculatebonus/:id', checkAuthorizationByRole("manager"), correctBonusInBody, performanceApi.sendBack);
router.post('/performance/:id', checkAuthorizationByRole("manager"), correctBonusInBody, performanceApi.update);
router.post('/performance', checkAuthorizationByRole("manager"), correctBonusInBody, performanceApi.add);
router.delete('/performance/:id', checkAuthorizationByRole("manager"), performanceApi.delete);
module.exports = router;

//OpenCRX
const openCRXApi = require('../apis/opencrx-api');
const {mapNamesToEmployeeIds} = require('../middlewares/salesman-middleware');
// CheckAuthorization not implemented for Backend - check TODOs
router.get('/opencrx/update',
    openCRXApi.updateAllOrderEvaluation,
    correctBonusInBody,
    mapNamesToEmployeeIds,
    performanceApi.addMissingOrderEvaluations);