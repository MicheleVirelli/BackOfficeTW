const express = require('express');
const router = express.Router();
const Customer = require('../models/customer').model;
const Rental = null//require('../models/rental')
const authentication = require('../lib/authentication');


const requiredAuthLevel = authentication.authLevel.employee;

router.get('/', authentication.verifyAuth(requiredAuthLevel, false), async (req, res) => {
    try {
        let query = {}
        if(req.query.username)
            query["loginInfo.username"] = req.query.username;
        if(req.query.email)
            query["loginInfo.email"] = req.query.email;

        const customer = await Customer.find(query);
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.post('/', authentication.hashPassword, async (req, res) => {
    let customer = null;
    let jwtToken = null;
    try{
        customer = await Customer(req.body);
        jwtToken = await customer.generateToken();
    } catch (error) {
        res.status(400).json({message: error.message})
    }

    try {
        const newCustomer = await customer.save();
        res.status(201).set({"Authorization": jwtToken}).json(newCustomer);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
})

router.get('/:id', authentication.verifyAuth(requiredAuthLevel, true), getCustomerById, async (req, res) => {
    res.json(res.customer);
})

router.delete('/:id', authentication.verifyAuth(requiredAuthLevel, true), getCustomerById, async (req, res) => {
    try{
        let removedCustomer = res.customer;
        await res.customer.remove();
        res.status(200).json(removedCustomer);   //{message: "Customer deleted from the database"});
    } catch(error){
        res.status(500).json({message: error.message});
    }
})

router.patch('/:id', authentication.verifyAuth(requiredAuthLevel, true), authentication.hashPassword, getCustomerById, async (req,res) => {    
    try{
        res.customer.set(req.body);
        await res.customer.save();

        res.status(200).json(res.customer);
    } catch (error) {
        res.status(400).json({message: error.message})          //Non so se restituire 400 o 404
    }
})

router.get('/:id/rentals', authentication.verifyAuth(requiredAuthLevel, true) ,getCustomerById, async (req, res) => {
    try{
        let rentals =  await Rental.find({customer: req.params.id})
        res.status(200).json({rentals})
    } catch (error) {
        res.status(400).json({message: error.message})          //Non so se restituire 400 o 404
    }
})

router.get('/:id/favorites', authentication.verifyAuth(requiredAuthLevel, true) ,async (req, res) => {
    let max = req.query.max;
    res.status(404).json({message: 'Non ancora implementanto'});
})

async function getCustomerById(req, res, next) {
    let customer;
    try {
        customer = await Customer.findById(req.params.id);

        if(customer == null){
            return res.status(404).json({message: "Customer with id " + req.params.id + " not found on the database"});
        }
    } catch (error) {
        return res.status(400).json({message: error.message});
    }

    res.customer = customer;
    next();
}

module.exports = router;
