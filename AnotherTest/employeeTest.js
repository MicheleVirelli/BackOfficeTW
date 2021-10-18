const chai = require('chai');
const expect = chai.expect;
const should = chai.should();

chai.use(require("chai-things"));
chai.use(require('chai-exclude'));

const request = require('supertest');
const app = require('../index');
const url = "/api/employees/"
const employee = require('../public/models/employee');

describe('Unit test employee', function() {

    const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImNpYW8iLCJpZCI6ImFzZG9pMDE5MjNlYXNkIiwiaWF0IjoxNjMzNzAwOTY0LCJleHAiOjE2MzYzNzkzNjR9._cIrkGfajb6DbVFiSxD0wU8SUjZ3kI3-ojV8Fu_a0Kw";
    const authheader = {"Authorization": adminToken};

    function verifyEmployee(got, expected){
        //Cheating ... 
        got.loginInfo.password = expected.loginInfo.password;
        expect(got).excluding(['_id', '__v']).to.deep.equal(expected);
        /*
        got.firstname.should.equal(expect.firstname);
        got.lastname.should.equal(expect.lastname);
        got.loginInfo.username.should.equal(expect.loginInfo.username);
        got.loginInfo.email.should.equal(expect.loginInfo.email);
        got.authorization.should.equal(expect.authorization);
        */
    }

    async function getAuth(){
        return (await request(app).get(url).set(authheader));
    }

    async function postAuth(employee){
        return (await request(app).post(url).set(authheader).send(employee));
    }

    async function getAuthId(id){
        return (await request(app).get(url + id).set(authheader));
    }

    async function patchAuthId(id, employee){
        return  (await request(app).patch(url + id).set(authheader).send(employee));
    }

    async function deleteAuth(id){
        return (await request(app).delete(url + id).set(authheader));
    }

    const employee1 = {
        firstname: 'John',
        lastname: 'Doe',
        loginInfo: {
            username: 'employee1',
            password: 'cavatappi62',
            email: 'employee1@email.com'
        },
        authorization: 'employee'
    }

    const employee2 = {
        firstname: 'Giovanni',
        lastname: 'Facendo',
        loginInfo: {
            username: 'employee2',
            password: 'SbucciaCarote48',
            email: 'employee2@email.com'
        },
        authorization: 'employee'
    }

    const employee3 = {
        firstname: 'Michele',
        lastname: 'Baia',
        loginInfo: {
            username: 'employee3',
            password: 'boomboom70',
            email: 'employee3@email.com'
        },
        authorization: 'employee'
    }

    it('GET /employee should return an array of employee', async function() {
        let req = await getAuth();
        let value = req.body;
        let statusCode = req.statusCode;
        startingEmployee = value;
        
        statusCode.should.equal(200);
        value.should.be.a("array");
    })

    it('POST /employee should create an eployee on the db, then GET /employee/id should return the employee and then DELETE should return it', async function() {
        let req = await postAuth(employee1);
        let value = req.body;
        let statusCode = req.statusCode;
        let id = req.body._id;

        statusCode.should.equal(201);
        verifyEmployee(value, employee1)

        req = await getAuthId(id);
        value = req.body;
        statusCode = req.statusCode;

        verifyEmployee(value, employee1)
        statusCode.should.equal(200);

        req = await deleteAuth(id);
        value = req.body;
        statusCode = req.statusCode;

        verifyEmployee(value, employee1)       
        statusCode.should.equal(200);
    })

    it('DELETE /employee with a random id should return 404', async function() {
        let id = "616050300f33629454139b9a"
        let req = await deleteAuth(id);
        let value = req.body;
        let statusCode = req.statusCode;
        statusCode.should.equal(404);

        value.should.have.property('message');

    })

    it('DELETE /employee should return 400 with invalid id', async function() {
        let id = "!?:.!";
        let req = await deleteAuth(id);
        let value = req.body;
        let statusCode = req.statusCode;
        statusCode.should.equal(400);

        value.should.have.property('message');

    })

    it('GET /employee should return 404 with random id', async function() {
        let id = "616050300f55729454809b9a";
        let req = await getAuthId(id);
        let value = req.body;
        let statusCode = req.statusCode;
        statusCode.should.equal(404);

        value.should.have.property('message');

    })

    it('PATCH /employee should modify a employee on the db created with a POST', async function() {
        let req = await postAuth(employee3);
        let id = req.body._id

        let modifiedEmployee = employee3;
        modifiedEmployee.loginInfo.username = "Michelo";

        req = await patchAuthId(id, modifiedEmployee);
        let value = req.body;
        let statusCode = req.statusCode;
        statusCode.should.equal(200);
        
        verifyEmployee(value, modifiedEmployee);

        await deleteAuth(id);
    })
    /*
    it('Create some employee with POST and then made some query on them', async function() {
        const employee4 = {
            firstname: 'Nicola',
            lastname: 'Gabbia',
            loginInfo: {
                username: 'employee4',
                password: 'Realli!?',
                email: 'employee4@email.com'
            },
            authorization: 'employee'
        }
        const employee5 = {
            firstname: 'Silvestri',
            lastname: 'Pasquale',
            loginInfo: {
                username: 'employee5',
                password: 'nessunapassword',
                email: 'employee5@email.com'
            },
            authorization: 'employee'
        }
        const rental1 = {
            customer: "è un id ",
            employee: employee1,
            open: true,
            prenotationDate: Date.now(),
            bill: null,
            startDate: Date.now(),
            endDate: Date.now(),
            unit: "per ora è una stringa",
            priceEstimation: "Ed anche questo è un placeholder"
        }
            //Add five emplpoyee
        let req = await postAuth(employee1);
        let id1 = req.body._id;
        req = await postAuth(employee2);
        let id2 = req.body._id;
        req = await postAuth(employee3);
        let id3 = req.body._id;
        req = await postAuth(employee4);
        let id4 = req.body._id;
        req = await postAuth(employee5);
        let id5 = req.body._id;
        req = await postAuthIsm(rental1);
        let id6 = req.body._id;

        //Made a query on a specific username
        let usernameQuery = "employee2";
        req = (await request(app).get('/api/employees?username=' + usernameQuery).set(authheader));
        let value = req.body;
        let statusCode = req.statusCode;
        
        statusCode.should.equal(200);
        verifyEmployee(value[0], employee2);

        //Search all Employee that have rent still open
        req = (await request(app).get('/api/employees?openRent=').set(authheader));
        value = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(200);
        value.should.be.a("array");
        console.log(value);

            //remove the five employee
        req = await deleteAuth(id1);
        req = await deleteAuth(id2);
        req = await deleteAuth(id3);
        req = await deleteAuth(id4);
        req = await deleteAuth(id5);
            //remove the rent 
        req = await deleteAuthIsm(id6);
    })
    */

})