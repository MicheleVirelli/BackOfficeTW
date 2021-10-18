const express = require('express');
const Employee = require('../models/employee');
const Customer = require('../models/customer');
const Rental = require('../models/rental');
const router = express.Router();
const authentication = require('../lib/authentication');

const requiredAuthLevel = authentication.authLevel.admin

router.get('/', authentication.verifyAuth(requiredAuthLevel, false), async (req, res) => {
    try {
        let query = {}
        if(req.query.username)
            query["loginInfo.username"] = req.query.username;
        if(req.query.email)
            query["loginInfo.email"] = req.query.email;


        let employees = await Employee.find(query);
        

        if(req.query.openRent){
            let rentals = await Rental.find();

            //Prendo tutti i rental che sono open
            rentals = rentals.filter(rent => rent.state == "open");
            console.log("Verificare che i rent siano aperti");
        
            let final = [];

            //Prendo tutti gli employee che sono associati ad uno di questi rental
            for(employee of employees){
            for(rent of rentals){
                if(employee._id == rent.employee)
                    final.push(employee);
            }
            }
        res.status(200).json(final);
        }
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.post('/', authentication.hashPassword, async (req, res) => {
    let employee = null;
    let jwtToken = null;
    try{
        employee = await Employee(req.body);

        jwtToken = await employee.generateToken();
    } catch (error) {
        res.status(400).json({message: error.message})
    }

    try {
        const newEmployee = await employee.save();
        res.status(201).set({"Authorization": jwtToken}).json(newEmployee);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
})

router.get('/:id', authentication.verifyAuth(requiredAuthLevel, true)  , getEmployeeById, async (req, res) => {
    res.json(res.employee);
})

router.delete('/:id', authentication.verifyAuth(requiredAuthLevel, true), getEmployeeById, async (req, res) => {
    try{
        let removedEmployee = res.employee
        await res.employee.remove();
        res.status(200).json(removedEmployee);
    } catch(error){
        res.status(500).json({message: error.message});
    }
})

router.patch('/:id', authentication.verifyAuth(requiredAuthLevel, true), authentication.hashPassword, getEmployeeById, async (req,res) => {
    try{
        res.employee.set(req.body);
        await res.employee.save();

        res.status(200).json(res.employee);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.get('/:id/rentals',authentication.verifyAuth(requiredAuthLevel, true), getEmployeeById, async (req, res) => {
    try{
        let rentals =  await Rental.find({employee: req.params.id})
        res.send(200).json({rentals})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.get('/:id/customers', authentication.verifyAuth(requiredAuthLevel, true), getEmployeeById, async (req,res) => {
    try {
        let cusotmer = await Cusotmer.find({employee: req.params.id})
        res.status(200).json({cusotmer})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

async function getEmployeeById(req, res, next) {
    let employee;
    try {
        employee = await Employee.findById(req.params.id);
        if(employee == null){
            return res.status(404).json({message: "Employee not found on the database"});
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({message: error.message});
    }

    res.employee = employee;
    next();
}

module.exports = router;