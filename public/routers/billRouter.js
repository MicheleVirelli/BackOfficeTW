const express = require('express');
const Bill = require('../models/bill').model;
const router = express.Router();
const authentication = require('../lib/authentication');

const requiredAuthLevel = authentication.authLevel.admin

router.get('/', authentication.verifyAuth(requiredAuthLevel, true), async (req, res) => {
    try {
        let bill = await Bill.find();

        res.status(200).json(bill);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.post('/', authentication.verifyAuth(requiredAuthLevel, true), async (req, res) => {
    try{
        bill = await Bill(req.body);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
    try {
        const newBill = await bill.save();
        res.status(201).json(newBill);
    } catch (error) {
        console.log(error.message);
        res.status(409).json({message: error.message});
    }
})

router.get('/:id', authentication.verifyAuth(requiredAuthLevel, true), getBillById, async (req, res) => {
    res.json(res.bill);
})

router.delete('/:id', authentication.verifyAuth(requiredAuthLevel, false), getBillById, async (req, res) => {
    try{
        let removedBill = res.bill;
        await res.bill.remove();
        res.status(200).json(removedBill);
    } catch(error){
        res.status(500).json({message: error.message});
    }
})

router.patch('/:id', authentication.verifyAuth(requiredAuthLevel, false),getBillById, async (req,res) => {
    try{
        res.bill.set(req.body);
        await res.bill.save();

        res.status(200).json(res.bill);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

async function getBillById(req, res, next) {
    let bill;
    try {
        bill = await Bill.findById(req.params.id);
        if(bill == null){
            return res.status(404).json({message: "Bill not found on the database"});
        }
    } catch (error) {
        return res.status(400).json({message: error.message});
    }

    res.bill = bill;
    next();
}

module.exports = router;