const chai = require('chai');
const expect = chai.expect;
const should = chai.should();

const request = require('supertest');
const app = require('../index');
const url = "/api/rentals/"

describe('Unit test rental' ,function() {

    const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImNpYW8iLCJpZCI6ImFzZG9pMDE5MjNlYXNkIiwiaWF0IjoxNjMzNzAwOTY0LCJleHAiOjE2MzYzNzkzNjR9._cIrkGfajb6DbVFiSxD0wU8SUjZ3kI3-ojV8Fu_a0Kw";
    const authheader = {"Authorization": adminToken};
    
    function verifyRent(got, expect){
        got.customer.should.equal(expect.customer);
        got.employee.should.equal(expect.employee);
        got.prenotationdate.should.equal(expect.prenotationdate);
        got.open.should.equal(expect.open);
        got.unit.should.equal(expect.unit);
    }

    async function getAuth(){
        return (await request(app).get(url).set(authheader));
    }

    async function postAuth(rental){
        return (await request(app).post(url).set(authheader).send(rental));
    }

    async function getAuthId(id){
        return (await request(app).get(url + id).set(authheader));
    }

    async function patchAuthId(id, rental){
        return  (await request(app).patch(url + id).set(authheader).send(rental));
    }

    async function deleteAuth(id){
        return (await request(app).delete(url + id).set(authheader));
    }

    it('GET /rental should return an array of rental', async function() {
        let req = await getAuth();
        let value = req.body;
        let statusCode = req.statusCode;
        startingRental = value;
        
        statusCode.should.equal(200);
        value.should.be.a("array");
    })
/*
    it('POST /rental should create a rental document on the db, then should GET it and DELETE it', async function() {
        const rent1 = {
            customer: "845846189641",
            employee: "389562062348",
            prenotationdate: Date.now(),
            open: false,
            unit: "43794619691",
        };
        let req = await postAuth(rent1);
        let value = req.body;
        let statusCode = req.statusCode;
        let id = req.body._id;

        statusCode.should.equal(201);
        verifyRent(value, rent1)

        req = await getAuthId(id);
        value = req.body;
        statusCode = req.statusCode;

        verifyRent(value, rent1)
        statusCode.should.equal(200);

        req = await deleteAuth(id);
        value = req.body;
        statusCode = req.statusCode;

        verifyRent(value, rent1)       
        statusCode.should.equal(200);
    })*/
});