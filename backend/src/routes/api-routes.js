const express = require('express');
const router = express.Router();
const {checkAuthorization} = require('../middlewares/auth-middleware');

/*
    In this file is the routing for the REST-endpoints under /api managed
 */

const authApi = require('../apis/auth-api'); //api-endpoints are loaded from separate files
router.post('/login', authApi.login); //the function decides which request type should be accepted
router.delete('/login', checkAuthorization(),authApi.logout); //middlewares can be defined in parameters
router.get('/login', authApi.isLoggedIn); //the function, which handles requests is specified as the last parameter

const userApi = require('../apis/user-api');
router.get('/user', checkAuthorization(), userApi.getSelf);


const salesmanApi = require('../apis/salesman-api');
router.get('/salesman/:id', salesmanApi.getOne);
router.post('/salesman', salesmanApi.addSalesMan);
router.delete('/salesman/:id', salesmanApi.deleteSalesMan);
router.get('/salesman', salesmanApi.getAll);


const performanceApi = require('../apis/performanceRecord-api');
router.get('/performance/:id', performanceApi.get);
router.post('/performance/:id', performanceApi.update)
router.post('/performance', performanceApi.add);
router.delete('/performance/:id', performanceApi.delete);
module.exports = router;

const openCrXApi = require('../apis/opencrx-api');
router.get('/opencrx',openCrXApi.getContact);

// OrangeHRM
const bonusSalaryApi = require('../apis/bonussalary-api');
router.get('/bonussalary/:id', bonusSalaryApi.get)
router.post('/bonussalary/:id', bonusSalaryApi.post)
router.delete('/bonussalary/:id', bonusSalaryApi.delete)